import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DescriptionIcon from '@material-ui/icons/Description'
import PropTypes from 'prop-types'
import React from 'react'
import formatDate from '../../../../util/date'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import Api from '../../../../services/Api'
import exportCSVFile from '../../../../util/exportCSVFile'

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
    id: 'dataCorte',
    numeric: false,
    disablePadding: false,
    label: 'DT Corte'
  },
  {
    id: 'dataVencimento',
    numeric: false,
    disablePadding: false,
    label: 'DT Vencimento'
  },
  {
    id: 'quantidadeRemessa',
    numeric: true,
    disablePadding: false,
    label: 'Qtd Remessa'
  },
  {
    id: 'Importacao',
    numeric: true,
    disablePadding: false,
    label: 'Importacao'
  },
  {
    id: 'quantidadeFaturamento',
    numeric: true,
    disablePadding: false,
    label: 'Qtd Faturamento'
  },
  {
    id: 'diferencaRemessaDW',
    numeric: true,
    disablePadding: false,
    label: 'Remessa x DW'
  },
  {
    id: 'remessaXFaturamento',
    numeric: false,
    disablePadding: false,
    label: 'Conferir Remessa'
  },
  {
    id: 'quantidadeEnviado',
    numeric: true,
    disablePadding: false,
    label: 'Enviado Banco'
  },
  {
    id: 'quantidadeRetorno',
    numeric: true,
    disablePadding: false,
    label: 'Qtd Retorno'
  },
  {
    id: 'remessaXRetorno',
    numeric: false,
    disablePadding: false,
    label: 'Conferir Retorno'
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

class DataTableHistoricoCortesHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes } = this.props

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

DataTableHistoricoCortesHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableHistoricoCortesHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableHistoricoCortesHead)

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
    marginLeft: `${rows.length * 30}%`,
    marginTop: '20px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${rows.length * 10}%`
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

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  requestServiceRelatorioAnalitico = async (idPortadorImport) => {
    try {
      const resultado = await Api.post(`emissao-registro/load-grid-remessa-enviado`, {
        'id_portador_import': idPortadorImport }, {
        baseURL: process.env.REACT_APP_API_URL
      })
      if (resultado.data.length > 0) {
        exportCSVFile(resultado.data, `relatorio_analitico`)
        this.setState({
          snackbar: {
            open: true,
            variant: 'success',
            message: 'Relatório Gerado'
          }
        })
      } else {
        this.setState({
          snackbar: {
            open: true,
            variant: 'info',
            message: 'Não há registros para gerar relatório'
          }
        })
      }
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'Error',
          message: 'Erro interno no servidor'
        }
      })
    }
  }

  render () {
    const { classes, innerLoading } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <Paper className={classes.root}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
            <DataTableHistoricoCortesHeadComponent
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {innerLoading && <Loading marginLeft={`${rows.length * 70}%`} />}
              {!innerLoading && data.length === 0 ? (
                <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
              ) : (
                stableSort(data, getSorting(order, orderBy))
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
                          {formatDate(item.DT_CORTE)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {formatDate(item.DT_VENCIMENTO)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.FLAG_REMESSA_IMPORTACAO === 0 && item.QTD_REMESSA !== null && (
                            <p className={classes.textInsideTable}>IMPORTANDO</p>
                          )}
                          {item.FLAG_REMESSA_IMPORTACAO === 1 &&
                            parseInt(item.QTD_REMESSA).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.TP_IMPORTACAO_REMESSA}
                        </TableCell>

                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.FLAG_FATURAMENTO_IMPORTACAO === 0 && item.QTD_FATURAMENTO === null && (
                            <p className={classes.textInsideTable}>
                              {item.TP_IMPORTACAO_REMESSA === 'MANUAL'
                                ? 'IMPORTANDO'
                                : `AGUARDANDO
                         FATURA`}
                            </p>
                          )}
                          {item.FLAG_FATURAMENTO_IMPORTACAO === 0 &&
                            item.QTD_FATURAMENTO !== null && (
                            <p className={classes.textInsideTable}>IMPORTANDO</p>
                          )}
                          {item.FLAG_FATURAMENTO_IMPORTACAO === 1 &&
                            parseInt(item.QTD_FATURAMENTO).toLocaleString() +
                              ` ${String(
                                item.TP_IMPORTACAO_FATURAMENTO === 'DW-STAGE' ? 'DW' : ''
                              )}`}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          {parseInt(item.QTD_REMESSA - item.QTD_FATURAMENTO) === 0 ? (
                            <span>{parseInt(item.QTD_REMESSA - item.QTD_FATURAMENTO)}</span>
                          ) : (
                            <IconButton
                              className={classes.cellRowStyle} title='divergência'
                              onClick={() =>
                                this.props.history.push('/app/emissao-registro/remessa-faturamento', {
                                  id: item.ID_PORTADOR_IMPORT
                                })
                              }
                            >{parseInt(item.QTD_REMESSA - item.QTD_FATURAMENTO)}</IconButton>
                          )}
                        </TableCell>
                        <TableCell align='left'>
                          <IconButton
                            className={classes.cellRowStyle}
                            onClick={() =>
                              this.props.history.push('/app/emissao-registro/conferir-remessa', {
                                id: item.ID_PORTADOR_IMPORT
                              })
                            }
                          >
                            {item.TP_IMPORTACAO_REMESSA === 'COMPLEMENTAR' ? '-'
                              : item.FLAG_FATURAMENTO_IMPORTACAO === 1 &&
                                item.FLAG_REMESSA_IMPORTACAO === 1 ? (
                                  item.FLAG_REMESSAXFATURAMENTO === 0 ? (
                                <>
                                  <DescriptionIcon className={classes.sucesso} />
                                  <span className={classes.sucesso}>VALIDO</span>
                                </>
                                  ) : (
                                <>
                                  <DescriptionIcon className={classes.falha} />
                                  <span className={classes.falha}>INVALIDO</span>
                                </>
                                  )
                                ) : (
                                  ''
                                )}
                          </IconButton>
                        </TableCell>
                        <TableCell align='left'>
                          {item.FLAG_ENVIO_BANCO === 0 ? (
                            <span className={classes.falha}>Não</span>
                          ) : (
                            <IconButton className={classes.cellRowStyle} title='CSV remessas enviados'
                              onClick={() => this.requestServiceRelatorioAnalitico(item.ID_PORTADOR_IMPORT)}
                            ><DescriptionIcon className={classes.sucesso} />
                              <span className={classes.sucesso}>SIM</span>
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {
                            item.TP_IMPORTACAO_REMESSA === 'COMPLEMENTAR' ? '-'
                              : item.FLAG_ENVIO_BANCO === 1 && item.QTD_RETORNO === null && (
                                <p className={classes.textInsideTable}>
                              AGUARDANDO
                                  <br /> RETORNO
                                </p>
                              )}
                          {item.FLAG_RETORNO_IMPORTACAO === 0 && item.QTD_RETORNO !== null && (
                            <p className={classes.textInsideTable}>IMPORTANDO</p>
                          )}
                          {item.FLAG_RETORNO_IMPORTACAO === 1 &&
                            parseInt(item.QTD_RETORNO).toLocaleString()}
                        </TableCell>
                        <TableCell align='left'>
                          {item.FLAG_RETORNO_IMPORTACAO === 1 && item.QTD_RETORNO !== null && (
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() =>
                                this.props.history.push('/app/emissao-registro/conferir-retorno', {
                                  id: item.ID_PORTADOR_IMPORT
                                })
                              }
                            >
                              <>
                                <DescriptionIcon className={classes.sucesso} />
                                {item.QTD_OCORRENCIA_REJEITADO > 0 ? (
                                  <span className={classes.sucesso} style={{ fontSize: 11.5 }}>
                                    REGISTRADO
                                    <br />
                                    <span style={{ color: '#d5de35', fontSize: 11.5 }}>
                                      DIVERGÊNCIA
                                    </span>
                                  </span>
                                ) : (
                                  <span className={classes.sucesso}>REGISTRADO</span>
                                )}
                              </>
                            </IconButton>
                          )}
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

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
