import Checkbox from '@material-ui/core/Checkbox'
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
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import ModalTratativa from './ModalTratativa'
import ModalRetornoAnalitico from './modal-retorno-analitico'
import formatDate from '../../../../util/date'
import green from '@material-ui/core/colors/green'

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
  { id: 'cedente', numeric: true, disablePadding: false, label: 'Conta' },
  {
    id: 'dataCorte',
    numeric: false,
    disablePadding: false,
    label: 'Data Corte'
  },
  {
    id: 'dataVencimento',
    numeric: true,
    disablePadding: false,
    label: 'Data Vencimento'
  },
  {
    id: 'qtdRemessa',
    numeric: true,
    disablePadding: false,
    label: 'QTD REMESSA'
  },
  {
    id: 'qtdRetorno',
    numeric: true,
    disablePadding: false,
    label: 'QTD RETORNO'
  },
  {
    id: 'RemXRet',
    numeric: true,
    disablePadding: false,
    label: 'Rem x Ret'
  },
  {
    id: 'tratativa',
    numeric: true,
    disablePadding: false,
    label: 'Tratativa'
  },
  {
    id: 'detalhes',
    numeric: true,
    disablePadding: false,
    label: 'Detalhar'
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

class DataTableRemessaFaturamentoSinteticoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, classes } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headStyle} padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
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

DataTableRemessaFaturamentoSinteticoHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableRetornoSinteticoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableRemessaFaturamentoSinteticoHead)

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
  palette: {
    secondary: {
      main: green[600]
    }
  },
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

class DataTableRetornoSintetico extends React.Component {
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
    openModalRetornoAnalitico: false,
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

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)

    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    // this.setState({ selected: newSelected })
    let cedentesCsv = this.state.data
      .filter((item, index) => newSelected.includes(index))
      .map(item => item.CONTA)
    // async function to update csv data
    this.setState({ selected: newSelected }, () => this.props.updateCedentesCsv(cedentesCsv))
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

  openCloseModalRetornoAnalitico (cedente, tratativa) {
    this.setState(
      {
        cedente
      },
      () =>
        this.setState({
          openModalRetornoAnalitico: !this.state.openModalRetornoAnalitico
        })
    )
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, cedentes } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {this.state.openDialog && (
          <ModalTratativa
            title={'Tratativa'}
            open={this.state.openDialog}
            idPortadorImport={this.props.idPortadorImport}
            conta={this.state.cedente}
            onClickCancel={() => this.openCloseDialog()}
            onClickConfirm={() => this.openCloseDialog()}
          />
        )}
        {this.state.openModalRetornoAnalitico && (
          <ModalRetornoAnalitico
            title={`Divergências REM x RET da Conta ${this.state.cedente}`}
            conta={this.state.cedente}
            idPortadorImport={this.props.idPortadorImport}
            open={this.state.openModalRetornoAnalitico}
            onClose={() => this.openCloseModalRetornoAnalitico()}
            onClickCancel={() => this.openCloseModalRetornoAnalitico()}
            onClickConfirm={() => this.openCloseModalRetornoAnalitico()}
          />
        )}
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableRetornoSinteticoHeadComponent
                numSelected={selected.length}
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
                    const isSelected = this.isSelected(index)
                    return (
                      <Fragment key={index}>
                        <TableRow
                          className={classes.tableBodyRow}
                          hover
                          role='checkbox'
                          aria-checked={isSelected}
                          tabIndex={index}
                          key={index}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              onClick={event => this.handleClick(event, index)}
                              checked={isSelected}
                            />
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.CONTA}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {formatDate(item.DT_CORTE)}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {formatDate(item.DT_VENCIMENTO)}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {parseInt(item.QTD_REMESSA).toLocaleString()}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {parseInt(item.QTD_RETORNO).toLocaleString()}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {parseInt(item.QTD_REMESSAXRETORNO).toLocaleString()}
                          </TableCell>
                          <TableCell align='left'>
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() => this.openCloseDialog(item.CONTA, item.TRATATIVA)}
                            >
                              {item.TRATATIVA == null ? (
                                <PlaylistAddIcon />
                              ) : (
                                <PlaylistAddCheckIcon style={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell align='left'>
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() => this.openCloseModalRetornoAnalitico(item.CONTA)}
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

DataTableRetornoSintetico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableRetornoSintetico)
