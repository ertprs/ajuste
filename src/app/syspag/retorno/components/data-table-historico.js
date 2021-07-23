import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
// import DescriptionIcon from '@material-ui/icons/Description'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import React from 'react'
// import formatDate from '../../../../util/date'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import exportCSVFile from '../../../../util/exportCSVFile'
import Api from '../../../../services/Api'
import Snackbar from '../../../../components/snackbar'
import FilterData from './FilterData'
import ModalProcessado from './ModalProcessado'

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
    id: 'dtArquivo',
    numeric: false,
    disablePadding: false,
    label: 'DT_ARQUIVO'
  },
  {
    id: 'bco',
    numeric: false,
    disablePadding: false,
    label: 'BCO'
  },
  {
    id: 'qtdLoj',
    numeric: false,
    disablePadding: false,
    label: 'QTD_LOJ'
  },
  {
    id: 'vlFortPag',
    numeric: true,
    disablePadding: false,
    label: 'VL_FORTPAG'
  },
  {
    id: 'vlStage',
    numeric: true,
    disablePadding: false,
    label: 'VL_STAGE'
  },
  {
    id: 'fortpagXstage',
    numeric: true,
    disablePadding: false,
    label: 'FORTPAG_X_STAGE'
  },
  {
    id: 'vlRm',
    numeric: true,
    disablePadding: false,
    label: 'VL_RM'
  },
  {
    id: 'fortpagXrm',
    numeric: true,
    disablePadding: false,
    label: 'FORTPAG_X_RM'
  },
  {
    id: 'qtdRt',
    numeric: true,
    disablePadding: false,
    label: 'QTD_RT'
  },
  {
    id: 'vlRt',
    numeric: true,
    disablePadding: false,
    label: 'VL_RT'
  },
  {
    id: 'qtdRmxRt',
    numeric: true,
    disablePadding: false,
    label: 'QTD_RM_X_RT'
  },
  {
    id: 'vlRmxRt',
    numeric: true,
    disablePadding: false,
    label: 'VL_RM_X_RT'
  },
  {
    id: 'relatorio',
    numeric: true,
    disablePadding: false,
    label: 'RELATORIO'
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
    const { classes, numSelected, onSelectAllClick, rowCount } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headStyle} padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount | (numSelected > 0 && numSelected < rowCount)}
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
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '17px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${rows.length * 10}%`
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green[600]
    },
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
    open: false,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    },
    loadRelatorio: false,
    dtArquivoSelected: '',
    openModalProcessado: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  componentDidMount () {
  }

  gerarRelatorio = async () => {
    const { data } = this.state

    exportCSVFile(data, `relatorio_fidc_remessa`, [])
    this.setState({
      loadRelatorio: false,
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  gerarRelatorioSyspag = async () => {
    const { selected, data } = this.state
    if (selected.length === 0) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Não existe data selecionada'
        }
      })
      return
    }
    this.setState({ loadRelatorio: true })

    let listaDatas = data.filter((value) => selected.includes(value.id))

    try {
      const resultado = await Api.post(`fidc/relatorio_remessa_syspag/`, listaDatas)
      console.log(resultado)
      if (resultado.data.length <= 0) {
        this.setState({
          loadRelatorio: false,
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Ocorreu um erro ao gerar relatório'
          }
        })
        return null
      }
      exportCSVFile(resultado.data, `relatorio_remessa_syspag`, [])
      this.setState({
        loadRelatorio: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        loadRelatorio: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
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
      this.setState(state => ({ selected: state.data.map((value, index) => index) }))
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

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  deletarArquivo = () => {
    const { data, selected } = this.state
    Swal.fire({
      title: 'Confirma a ação?',
      text: 'Você não conseguirá reverter essa ação!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, realizar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        if (result.value) {
          this.setState({ loadRelatorio: true })
          const user = JSON.parse(localStorage.getItem('user'))
          let linhaArquivo = selected.map((item) => data[item])
          let obj = {
            'banco': this.props.banco,
            'arquivos': linhaArquivo,
            'email': user.mail
          }
          const result = await Api.post('syspag/deletar_remessa_arquivo/', obj)
          if (!result) {
            this.setState({ loadRelatorio: false })
            Swal.fire({
              title: 'Error',
              type: 'error',
              text: 'Não foi possivel deletar o arquivo'
            })
          }
          this.props.requestService()
          Swal.fire({
            title: 'Realizado',
            type: 'success',
            text: 'Operação realizada com sucesso'
          })
          this.setState({ loadRelatorio: false })
        }
      } catch (error) {
        this.setState({ loadRelatorio: false })
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel deletar o arquivo'
        })
      }
    })
  }

  deletarArquivoRetorno = () => {
    const { data, selected } = this.state
    Swal.fire({
      title: 'Confirma a ação?',
      text: 'Você não conseguirá reverter essa ação!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, realizar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        if (result.value) {
          this.setState({ loadRelatorio: true })
          const user = JSON.parse(localStorage.getItem('user'))
          let linhaArquivo = selected.map((item) => data[item])
          let obj = {
            'banco': this.props.banco,
            'arquivos': linhaArquivo,
            'email': user.mail
          }
          const result = await Api.post('syspag/deletar_retorno_arquivo/', obj)
          if (result.data) {
            if (result.data.deletados.length) {
              this.props.requestService()
              Swal.fire({
                title: 'Operação realizada com sucesso',
                type: 'success',
                text: 'Dias deletados: ' + result.data.deletados
              })
              this.setState({ loadRelatorio: false })
            } else {
              this.setState({ loadRelatorio: false })
              Swal.fire({
                title: 'Error',
                type: 'error',
                text: 'Não foi possivel deletar o arquivo'
              })
            }
          } else {
            this.setState({ loadRelatorio: false })
            Swal.fire({
              title: 'Error',
              type: 'error',
              text: 'Não foi possivel deletar o arquivo'
            })
          }
        }
      } catch (error) {
        this.setState({ loadRelatorio: false })
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel deletar o arquivo'
        })
      }
    })
  }

  openCloseModalProcessado (dtArquivoSelected) {
    this.setState({ dtArquivoSelected }, () =>
      this.setState({
        openModalProcessado: !this.state.openModalProcessado
      })
    )
  }

  showSnackbar = (open, variant, message) => {
    setTimeout(() => {
      this.setState({
        snackbar: {
          open,
          variant,
          message
        }
      })
    }, 200)
  }

  render () {
    const { classes, innerLoading } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, loadRelatorio } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {this.state.openModalProcessado && (
          <ModalProcessado
            title={'Escolha a opção'}
            open={this.state.openModalProcessado}
            history={this.props.history}
            dtArquivoSelected={this.state.dtArquivoSelected}
            onClose={() => this.openCloseModalProcessado()}
            onClickCancel={() => this.openCloseModalProcessado()}
            onClickConfirm={() => this.openCloseModalProcessado()}
            showSnackBar={this.showSnackbar}
          />
        )}
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.props.filter}
            banco={this.props.banco}
            data={data}
            handleClick={this.props.handleClick}
            cleanFilters={this.props.cleanFilters}
            onChangeInputValue={this.props.onChangeInputValue}
            onChangeInputBanco={this.props.onChangeInputBanco}
            gerarRelatorio={this.gerarRelatorio}
            deletarArquivo={this.deletarArquivo}
            deletarArquivoRetorno={this.deletarArquivoRetorno}
            selected={selected}
          />
        </div>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        { innerLoading | loadRelatorio ? <Loading/> : data === null || data.length === 0
          ? <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
          : <Paper className={classes.root}>
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
                { stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isSelected = this.isSelected(index)
                    return (
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
                            onClick={event => (this.handleClick(event, index))}
                            checked={isSelected}
                          />
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.dt_arquivo}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.bco}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_loj}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.vl_fortpag).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.vl_stage).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          <IconButton
                            disabled={item.fortpag_x_stage === 0}
                            className={classes.cellRowStyle}
                            onClick={() => this.openCloseModalProcessado(item.dt_arquivo)}
                          >
                            {this.prettyNumber(item.fortpag_x_stage).toLocaleString()}
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.vl_rm === 'Aguardando RM' ? item.vl_rm
                            : this.prettyNumber(item.vl_rm).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.fortpag_x_rm === 'Aguardando RM' ? item.fortpag_x_rm
                            : this.prettyNumber(item.fortpag_x_rm).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_rt}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.vl_rt === 'Aguardando' ? item.vl_rt
                            : this.prettyNumber(item.vl_rt).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_rm_x_rt}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left' title={this.prettyNumber(item.vl_rm_x_rt).toLocaleString()}>
                          <IconButton
                            disabled={item.vl_rm_x_rt_txt === 'Pag Efetuado' || item.vl_rm_x_rt_txt === 'Aguardando'}
                            className={classes.cellRowStyle}
                            onClick={() =>
                              this.props.history.push('/app/syspag/repasse-pendente', {
                                dt_arquivo: item.dt_arquivo
                              })
                            }
                          >
                            {item.vl_rm_x_rt_txt}
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='center'>
                          <TableCell className={classes.cellRowStyle} align='center'>
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() =>
                                this.props.history.push('/app/syspag/conferir-sintetico', {
                                  dt_arquivo: item.dt_arquivo
                                })
                              }
                            >
                              SN
                            </IconButton>
                          </TableCell>
                          <TableCell className={classes.cellRowStyle} align='center'>
                            <IconButton
                              className={classes.cellRowStyle}
                              onClick={() =>
                                this.props.history.push('/app/syspag/conferir-analitico', {
                                  dt_arquivo: item.dt_arquivo
                                })
                              }
                            >
                              AN
                            </IconButton>
                          </TableCell>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
