import IconButton from '@material-ui/core/IconButton'
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
import Swal from 'sweetalert2'
import ModalValidacao from './ModalValidacao'
import ModalStatus from './ModalStatus'
// import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import { prettyNumber } from '../../../../util/number'
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline, IoIosWarning } from 'react-icons/io'
import green from '@material-ui/core/colors/green'
import LinearProgress from '@material-ui/core/LinearProgress'

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
    id: 'dt_arquivo',
    numeric: false,
    disablePadding: false,
    label: 'DT Arquivo'
  },
  {
    id: 'dt_operacao',
    numeric: false,
    disablePadding: false,
    label: 'Dt Operacao'
  },
  {
    id: 'operacao',
    numeric: false,
    disablePadding: false,
    label: 'Operacao'
  },
  {
    id: 'valor_arquivo',
    numeric: true,
    disablePadding: false,
    label: 'Valor'
  },
  {
    id: 'valor_cdt',
    numeric: true,
    disablePadding: false,
    label: 'Valor CDT'
  },
  {
    id: 'diferenca',
    numeric: true,
    disablePadding: false,
    label: 'Diferença'
  },
  {
    id: 'qtd_operacoes',
    numeric: true,
    disablePadding: false,
    label: 'Qtd Operacao'
  },
  {
    id: 'nome_arquivo',
    numeric: false,
    disablePadding: false,
    label: 'Nome Arquivo'
  },
  {
    id: 'validacao',
    numeric: false,
    disablePadding: false,
    label: 'Validação'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  }
  // ,
  // {
  //   id: 'iof',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Valor IOF'
  // },
  // {
  //   id: 'flag_operacao',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Validar'
  // },
  // {
  //   id: 'status',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Status'
  // },
  // {
  //   id: 'dt_bancarizacao',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Dt Bancarizacao'
  // }
]

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

const customValido = {
  'color': '#4CAF50',
  'verticalAlign': 'middle'
}

const customInvalido = {
  'color': '#EF4343',
  'verticalAlign': 'middle'
}

const customEmProcesso = {
  'color': '#ffc107',
  'verticalAlign': 'middle'
}

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
  cellRowStyleNegative: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(240, 68, 34, 0.74)'
  },
  rowStatus: {
    'color': '#008B45'
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
  palette: {
    primary: green
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
    arquivoBatimento: null,
    openModalRemessaAnalitico: false
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

  FormatdateApi = dateStr => {
    let dateList = dateStr.match(/\d+/g)
    return `${dateList[2]}-${dateList[1]}-${dateList[0]}`
  }

  openCloseModalValidacao (arquivo) {
    Swal.fire({
      title: 'Continuar?',
      text: 'Lembre-se das operações que possam ocorrer caso você valide ou não!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar!',
      cancelButtonText: 'Voltar'
    }).then(async (result) => {
      if (result.value) {
        this.setState({
          arquivoBatimento: arquivo,
          openModalValidacao: !this.state.openModalValidacao
        })
      }
    })
  }

  openCloseStatus (arquivo) {
    Swal.fire({
      title: 'Continuar?',
      text: 'Lembre-se das operações que possam ocorrer caso você bancarize ou não!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar!',
      cancelButtonText: 'Voltar'
    }).then(async (result) => {
      if (result.value) {
        this.setState({
          arquivoBatimento: arquivo,
          openModalStatus: !this.state.openModalStatus
        })
      }
    })
  }

  closeModalValidacao = () => {
    this.setState({
      openModalValidacao: !this.state.openModalValidacao
    })
  }

  closeModalStatus = () => {
    this.setState({
      openModalStatus: !this.state.openModalStatus
    })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes, innerLoading, date } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {this.state.openModalValidacao && (
          <ModalValidacao
            title={'Escolha a opção abaixo: '}
            open={this.state.openModalValidacao}
            history={this.props.history}
            arquivoBatimento={this.state.arquivoBatimento}
            date={date}
            onClose={() => this.closeModalValidacao()}
            onClickCancel={() => this.closeModalValidacao()}
            onClickConfirm={() => this.closeModalValidacao()}
            requestService={this.props.requestService}
          />
        )}
        {this.state.openModalStatus && (
          <ModalStatus
            title={'Escolha a opção abaixo: '}
            open={this.state.openModalStatus}
            history={this.props.history}
            arquivoBatimento={this.state.arquivoBatimento}
            date={date}
            onClose={() => this.closeModalStatus()}
            onClickCancel={() => this.closeModalStatus()}
            onClickConfirm={() => this.closeModalStatus()}
            requestService={this.props.requestService}
          />
        )}
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
                          {item.dt_arquivo}
                        </TableCell>

                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.dt_operacao}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.operacao}
                        </TableCell>
                        <TableCell align='left' className={classes.cellRowStyle}>
                          {parseInt(item.valor_arquivo) === 0 ? prettyNumber(0)
                            : (
                              <IconButton
                                className={classes.cellRowStyle}
                                onClick={() => {
                                  this.props.history.push(
                                    '/app/bancarizacao/analitico-arquivo',
                                    {
                                      dataOperacao: this.FormatdateApi(item.dt_operacao),
                                      dataArquivo: this.FormatdateApi(item.dt_arquivo),
                                      tipo: item.operacao,
                                      date: date
                                    }
                                  )
                                }}
                              >
                                {prettyNumber(item.valor_arquivo)}
                              </IconButton>

                            )
                          }
                        </TableCell>
                        <TableCell align='left' className={classes.cellRowStyle}>
                          {parseInt(item.valor_cdt) === 0 ? prettyNumber(0)
                            : (
                              <IconButton
                                className={classes.cellRowStyle}
                                onClick={() => {
                                  this.props.history.push(
                                    '/app/bancarizacao/analitico-base-unica',
                                    {
                                      dataOperacao: this.FormatdateApi(item.dt_operacao),
                                      tipo: item.operacao,
                                      date: date
                                    }
                                  )
                                }}
                              >
                                {prettyNumber(item.valor_cdt)}
                              </IconButton>

                            )
                          }
                        </TableCell>
                        {item.diferenca < 0 ? (
                          <TableCell align='left' className={classes.cellRowStyleNegative}>
                            {prettyNumber(item.diferenca)}
                          </TableCell>
                        ) : <TableCell align='left' className={classes.cellRowStyle}>
                          {prettyNumber(item.diferenca)}
                        </TableCell> }
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_operacoes === null ? 'AGUARDANDO'
                            : item.qtd_operacoes}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.nome_arquivo}
                        </TableCell>

                        <TableCell className={classes.cellRowStyle} align='left'>
                          <IconButton
                            className={classes.cellRowStyle} title='Validação do arquivo'
                            onClick={() => {
                              this.openCloseModalValidacao(item.nome_arquivo)
                            }}
                          >{item.validacao === 1
                              ? <p style={customValido}> <IoIosCheckmarkCircleOutline style={customValido} size={23} /> VALIDO</p>
                              : <p style={customInvalido}> <IoIosCloseCircleOutline style={customInvalido} size={23} /> INVALIDO</p>
                            }</IconButton>
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.validacao !== 1 ? <p style={customInvalido}> <IoIosCloseCircleOutline style={customInvalido} size={23} /> NÃO BANCARIZADO</p>
                            : (
                              <IconButton
                                className={classes.cellRowStyle}
                                onClick={() => {
                                  this.openCloseStatus(item.nome_arquivo)
                                }}
                              >
                                {item.status === 0 ? <p style={customInvalido}> <IoIosCloseCircleOutline style={customInvalido} size={23} /> NÃO BANCARIZADO</p>
                                  : (
                                    item.status === 2 ? <p style={customValido}> <IoIosCheckmarkCircleOutline style={customValido} size={23} /> BANCARIZADO</p>
                                      : item.status === 1 ? <p style={customEmProcesso}> <IoIosWarning style={customEmProcesso} size={23} /> EM BANCARIZACAO</p>
                                        : <p style={customInvalido}> <IoIosCloseCircleOutline style={customInvalido} size={23} /> NÃO BANCARIZADO</p>
                                  )}
                              </IconButton>

                            )
                          }
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
          {innerLoading && <LinearProgress /> }
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
