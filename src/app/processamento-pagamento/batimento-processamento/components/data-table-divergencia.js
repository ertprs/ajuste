import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
// import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
// import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import ModalBatimentoAnalitico from './modal-divergencia-analitico'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting (order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rows = [
  {
    id: 'cedente',
    numeric: false,
    disablePadding: false,
    label: 'CEDENTE'
  },
  {
    id: 'conta',
    numeric: true,
    disablePadding: false,
    label: 'CONTA'
  },
  {
    id: 'quantidade',
    numeric: true,
    disablePadding: false,
    label: 'QUANTIDADE'
  },
  {
    id: 'divergencia',
    numeric: true,
    disablePadding: false,
    label: 'DIVERGENCIA'
  },
  {
    id: 'inclusoes',
    numeric: true,
    disablePadding: false,
    label: 'INCLUSOES'
  },
  {
    id: 'saldo',
    numeric: true,
    disablePadding: false,
    label: 'SALDO'
  },
  {
    id: 'detalhes',
    numeric: true,
    disablePadding: false,
    label: 'DETALHES'
  }
]

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableBatimentoSinteticoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { order, orderBy, classes } = this.props

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                {row.label.toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

DataTableBatimentoSinteticoHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableBatimentoSinteticoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableBatimentoSinteticoHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    borderCollapse: 'separate'
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: '20px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6',
    borderTop: '2px solid #D6D6D6'
  },
  cellRowStyle: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  }
})

const muiDatatableTheme = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
        webkitScrollbarThumb: 'active'
      }
    },
    MuiTableCell: {
      root: {
        padding: '0px 0px 0px 0px',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#fff',
        borderBottom: 0
      }
    },
    MuiTableRow: {
      footer: {
        height: 40
      }
    },
    select: {
      paddingRight: '50px',
      width: 200
    },
    MuiIconButton: {
      root: {
        // override no root do componente
        padding: 6,
        borderRadius: 10
      }
    }
  }
})

class DataTableRemessaSintetico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    cedentes: [],
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false,
    cedentesSelect: [],
    cedente: null,
    tratativa: null
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  componentDidMount () {
    this.setState({
      cedentes: Array.from(new Set(this.state.data.map(item => item.CONTA)))
    })
  }

  openCloseExpand (cedente) {
    let { open } = this.state
    if (open.includes(cedente)) {
      open = open.filter(row => row !== cedente)
    } else {
      open.push(cedente)
    }
    this.setState({ open })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = cedentes => event => {
    if (event.target.checked) {
      this.setState(
        {
          selected: cedentes.map((item, index) => index)
        },
        () => this.props.updateCedentesCsv(cedentes)
      )
      return
    }
    this.setState({ selected: [] }, () => this.props.updateCedentesCsv([]))
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  openCloseDialog (cedente) {
    this.setState(
      {
        cedente
      },
      () => this.setState({ openDialog: !this.state.openDialog })
    )
  }

  openCloseModalBatimentoAnalitico (cedente, tratativa) {
    this.setState(
      {
        cedente
      },
      () =>
        this.setState({
          openModalBatimentoAnalitico: !this.state.openModalBatimentoAnalitico
        })
    )
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes } = this.props
    const { data, order, orderBy, rowsPerPage, page, cedentes } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {/* {this.state.openDialog && (
          <ModalTratativa
            title={'Tratativa'}
            open={this.state.openDialog}
            idPortadorImport={this.props.idPortadorImport}
            conta={this.state.cedente}
            onClickCancel={() => this.openCloseDialog()}
            onClickConfirm={() => this.openCloseDialog()}
          />
        )} */}
        {this.state.openModalBatimentoAnalitico && (
          <ModalBatimentoAnalitico
            title={`Detalhamento Divergências ${this.state.cedente}`}
            conta={this.state.cedente}
            idPortadorImport={this.props.idPortadorImport}
            open={this.state.openModalBatimentoAnalitico}
            onClose={() => this.openCloseModalBatimentoAnalitico()}
            onClickCancel={() => this.openCloseModalBatimentoAnalitico()}
            onClickConfirm={() => this.openCloseModalBatimentoAnalitico()}
          />
        )}
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableBatimentoSinteticoHeadComponent
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick(cedentes)}
                onRequestSort={this.handleRequestSort}
                rowCount={cedentes.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    return (
                      <Fragment key={index}>
                        <TableRow className={classes.tableBodyRow}>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.CEDENTE}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.CONTA}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.QUANTIDADE}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.DIVERGENCIA}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.INCLUSOES}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.SALDO}
                          </TableCell>
                          {/* <TableCell className={classes.cellRowStyle} align='left'>
                            <IconButton
                              onClick={() => this.openCloseDialog(item.CONTA, item.TRATATIVA)}
                            >
                              {item.TRATATIVA == null ? (
                                <PlaylistAddIcon />
                              ) : (
                                <PlaylistAddCheckIcon style={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </TableCell> */}
                          <TableCell align='left'>
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() => this.openCloseModalBatimentoAnalitico(item.CONTA)}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

DataTableRemessaSintetico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableRemessaSintetico)
