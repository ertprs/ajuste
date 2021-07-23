import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import formatDate from '../../../../util/date'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
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
  {
    id: 'dt_pagamento',
    numeric: false,
    disablePadding: false,
    label: 'DT PAGAMENTO',
    align: 'left'
  },
  {
    id: 'arquivo',
    numeric: false,
    disablePadding: false,
    label: 'ARQUIVO',
    align: 'left'
  },
  {
    id: 'cedente',
    numeric: false,
    disablePadding: false,
    label: 'CEDENTE',
    align: 'left'
  },
  {
    id: 'conta',
    numeric: true,
    disablePadding: false,
    label: 'CONTA',
    align: 'center'
  },
  {
    id: 'quantidade',
    numeric: true,
    disablePadding: false,
    label: 'QUANTIDADE',
    align: 'right'
  },
  {
    id: 'vlrecebido',
    numeric: true,
    disablePadding: false,
    label: 'VL RECEBIDO',
    align: 'right'
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

class DataTableProcessamentoRecebimentoHead extends React.Component {
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
                align={row.align}
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

DataTableProcessamentoRecebimentoHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableProcessamentoRecebimentoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableProcessamentoRecebimentoHead)

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
  },
  cellRowStyle2: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    width: '8px'
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

class DataTableProcessamentoCedente extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    cedentes: [],
    page: 0,
    rowsPerPage: 10,
    open: [],
    openDialog: false,
    cedentesSelect: [],
    cedente: null,
    tratativa: null
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  componentDidMount () {
    this.setState({
      cedentes: Array.from(this.state.data.map(item => item.cedente)),
      contas: Array.from(this.state.data.map(item => item.conta))
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

  handleSelectAllClick = (cedentes, contas) => event => {
    if (event.target.checked) {
      this.setState(
        {
          selected: cedentes.map((item, index) => index)
        },
        () => this.props.updateCedentesContasCsv(cedentes, contas)
      )
      return
    }
    this.setState({ selected: [] }, () => this.props.updateCedentesContasCsv([]))
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
    let CedentesCsv = this.state.data
      .filter((item, index) => newSelected.includes(index))
      .map(item => item.cedente)
    let contasCsv = this.state.data
      .filter((item, index) => newSelected.includes(index))
      .map(item => item.conta)
    // async function to update csv data
    this.setState({ selected: newSelected }, () =>
      this.props.updateCedentesContasCsv(CedentesCsv, contasCsv)
    )
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

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, cedentes, contas } = this.state
    const totalRecebido = data
      .map(row => parseFloat(row.vl_recebido))
      .reduce((acc, row) => row + acc)

    const totalQuantidade = data.map(row => parseInt(row.total)).reduce((acc, row) => row + acc)

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableProcessamentoRecebimentoHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick(cedentes, contas)}
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
                            {item.dt_ocorrencia === null
                              ? `AGUARDANDO`
                              : formatDate(item.dt_ocorrencia)}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.nome_arquivo}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.cedente}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='center'>
                            {item.conta}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='right'>
                            {item.total}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='right'>
                            {item.vl_recebido === null
                              ? `-`
                              : parseFloat(item.vl_recebido).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    )
                  })}
                <TableRow>
                  <TableCell rowSpan={4} colSpan={4} />
                  <TableCell className={classes.cellRowStyle} align='right'>
                    TOTAL
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='right'>
                    {totalQuantidade}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='right'>
                    {parseFloat(totalRecebido).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                </TableRow>
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
          </div>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

DataTableProcessamentoCedente.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableProcessamentoCedente)
