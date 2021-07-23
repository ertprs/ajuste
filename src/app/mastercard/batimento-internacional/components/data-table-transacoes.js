import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
// import IconButton from '@material-ui/core/IconButton'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
// import CustomizedTooltips from './CustomizedTooltips'
// import Grid from '@material-ui/core/Grid'
// import Typography from '@material-ui/core/Typography'

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

// const textAcumuladoCss = {
//   fontFamily: 'sans-serif',
//   fontSize: '15px',
//   fontWeight: 'bold',
//   color: 'rgba(10, 1, 1, 0.54)'
// }

class DataTableHistoricoHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes, dataHead } = this.props
    return (
      <TableHead>
        <TableRow>
          {dataHead.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
              >
                {row.replace('_', ' ').replace('_', ' ').toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

const DataTableHistoricoHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableHistoricoHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '10px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6'
  },
  cellRowStyle: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  cellRowStyleNegative: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(240, 68, 34, 0.74)'
  },
  sucesso: {
    color: '#008B45'
  },
  falha: {
    color: '#d62133'
  },
  textInsideTable: {
    fontSize: '11px'
  },
  empytyTable: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    justifyContent: 'center',
    marginTop: '20px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${5 * 10}%`
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
    },
    MuiToolbar: {
      root: {
        // override no root do componente
        paddingleft: 0
      },
      gutters: {
        paddingleft: 0
      }
    }
  }
})

class DataTableHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
  }
  desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }
  getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy)
  }

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  FormatdateApi = dateStr => {
    let dateList = dateStr.match(/\d+/g)
    return `${dateList[2]}-${dateList[1]}-${dateList[0]}`
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  sumTotalFields = (data, field) => {
    let totalLiquidacao = 0
    let totalAnterior = 0
    let totalDeposito = 0
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        totalLiquidacao += row[field] * (-1)
      } else if (row.transacao === 'SALDO ANTERIOR') {
        totalAnterior += row[field]
      } else if (row.transacao === 'DEPOSITO') {
        totalDeposito += row[field]
      } else {
        total += row[field] * (-1)
      }
      return row
    })
    return totalLiquidacao + totalDeposito + totalAnterior + total
  }
  sumTotalDolar = (data, field) => {
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        total += -row[field]
      } else {
        total += row[field]
      }
      return row
    })
    return total
  }
  sumTotalComissaoDolar = (data) => {
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        total += -row.comissao
      } else {
        total += row.comissao
      }
      return row
    })
    return total
  }

  sumTotalComissaoReal = (data) => {
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        total += -row.comissao_real
      } else {
        total += row.comissao_real
      }
      return row
    })
    return total
  }

  sumSaldoDolar = (data) => {
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        total += -row.valor_total_dolar
      } else {
        total += row.valor_total_dolar
      }
      return row
    })
    return total
  }

  sumSaldoReal = (data) => {
    let total = 0
    data.map(row => {
      if (row.transacao === 'LIQUIDACAO') {
        total += -row.valor_total_real
      } else {
        total += row.valor_total_real
      }
      return row
    })
    return total
  }

  render () {
    const { classes, innerLoading, dataHead } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        { innerLoading ? <Loading/> : data === null || data.length === 0
          ? <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
          : <Paper className={classes.root}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableHistoricoHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                rowCount={data.length}
                dataHead={dataHead}
              />
              <TableBody>
                {!innerLoading && data.length === 0 ? (
                  <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
                ) : (
                  this.stableSort(data, this.getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => {
                      const isSelected = this.isSelected(item.id)
                      return (
                        <TableRow
                          className={classes.tableBodyRow}
                          hover
                          role='checkbox'
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={Math.random()}
                        >
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.dt_geracao}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {item.transacao}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.valor_real !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.valor_real * (-1))
                              : this.prettyNumber(item.valor_real)}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.comissao_real !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.comissao_real * (-1))
                              : this.prettyNumber(item.comissao_real)}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.valor_dolar !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.valor_dolar * (-1))
                              : this.prettyNumber(item.valor_dolar)}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.comissao !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.comissao * (-1))
                              : this.prettyNumber(item.comissao)}
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='left'>
                            {this.prettyNumber(item.cotacao)}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.valor_total_dolar !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.valor_total_dolar * (-1))
                              : this.prettyNumber(item.valor_total_dolar)}
                          </TableCell>
                          <TableCell className={item.transacao === 'LIQUIDACAO' && item.valor_total_real !== 0 ? classes.cellRowStyleNegative : classes.cellRowStyle} align='left'>
                            {['LIQUIDACAO', 'CREDITO'].includes(item.transacao) ? this.prettyNumber(item.valor_total_real * (-1))
                              : this.prettyNumber(item.valor_total_real)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
                <TableRow>
                  <TableCell className={classes.cellRowStyle} align='left'>
                    TOTAL
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left' />
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'valor_real'))}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'comissao_real'))}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'valor_dolar'))}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'comissao'))}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left' />
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'valor_total_dolar'))}
                  </TableCell>
                  <TableCell className={classes.cellRowStyle} align='left'>
                    {this.prettyNumber(this.sumTotalFields(data, 'valor_total_real'))}
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
          </Paper> }
      </MuiThemeProvider>
    )
  }
}

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
