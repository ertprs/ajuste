import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'

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
    id: 'PRODUTO',
    numeric: false,
    disablePadding: false,
    label: 'PRODUTO'
  },
  {
    id: 'CPF',
    numeric: false,
    disablePadding: false,
    label: 'CPF'
  },
  {
    id: 'nome',
    numeric: false,
    disablePadding: false,
    label: 'NOME'
  },
  {
    id: 'TP_ARQUIVO',
    numeric: false,
    disablePadding: false,
    label: 'TP ARQUIVO'
  },
  {
    id: 'MOTIVO_INVALIDADO',
    numeric: true,
    disablePadding: false,
    label: 'MOTIVO INVALIDADO'
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

class DataTableBatimentoBaseUnicaHeadComponent extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { order, orderBy, classes, dataHead } = this.props

    return (
      <TableHead>
        <TableRow>
          {dataHead.map(
            item => (
              <TableCell
                className={classes.headStyle}
                key={Math.random}
                align={'left'}
                padding={item.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === item.id ? order : false}
              >
                {item.replace('_', ' ').replace('_', ' ').toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

DataTableBatimentoBaseUnicaHeadComponent.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableBatimentoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableBatimentoBaseUnicaHeadComponent)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '20px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '20px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6',
    textOverflow: '…',
    minWidth: '100px',
    maxWidth: '120px',
    marginRight: '30px',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  text: {
    fontSize: '12px',
    fontFamily: 'Helvetica',
    lineHeight: '1.6',
    letterSpacing: '0.0075em'
  },
  empytyTable: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    marginLeft: `${rows.length * 30}%`,
    marginTop: '20px'
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
        padding: '0px 20px 0px 0px',
        // whiteSpace: 'nowrap',
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

class DataTableTransacoes extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
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

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes, dataHead } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
            <DataTableBatimentoHeadComponent
              dataHead={dataHead}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.length === 0 ? (
                <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
              ) : (
                stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(item => {
                    const isSelected = this.isSelected(item.id)
                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={Math.random()}
                      >
                        <TableCell className={classes.tableBodyRow} align='left'>
                          <span className={classes.text}>{item.tipo_transacao}</span>
                        </TableCell>
                        <TableCell className={classes.tableBodyRow} align='left'>
                          <span className={classes.text}>{item.valor}</span>
                        </TableCell>
                        <TableCell className={classes.tableBodyRow} align='left'>
                          <span className={classes.text}>{item.numero_transacoes}</span>
                        </TableCell>
                        <TableCell className={classes.tableBodyRow} align='left'>
                          <span className={classes.text}>{item.numero_parcela}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>

          <TablePaginationActions
            rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={'Linhas Por Página'}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </MuiThemeProvider>
    )
  }
}

DataTableTransacoes.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableTransacoes)
