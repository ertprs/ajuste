import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Input from '@material-ui/core/Input'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import formatDate from '../../../util/date'
import Loading from '../../../components/loading'
import TablePaginationActions from '../../../components/table/TablePaginationAction'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'
import Snackbar from '../../../components/snackbar'
import FilterData from './FilterData'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import ModalPrestacaoContas from './ModalPrestacaoContas'
import ModalSaldoContabil from './ModalSaldoContabil'
import ModalContabilizacao from './ModalContabilizacao'
import Grid from '@material-ui/core/Grid'
import DescriptionIcon from '@material-ui/icons/Description'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import SelectReact from 'react-select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

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
    id: 'nome',
    numeric: false,
    disablePadding: false,
    label: 'Nome'
  },
  {
    id: 'setor',
    numeric: false,
    disablePadding: false,
    label: 'Setor'
  },
  {
    id: 'adiantamento',
    numeric: true,
    disablePadding: false,
    label: 'Adiantamento'
  },
  {
    id: 'Origem',
    numeric: true,
    disablePadding: false,
    label: 'Origem'
  },
  {
    id: 'destino',
    numeric: true,
    disablePadding: false,
    label: 'Destino'
  },
  {
    id: 'periodoInicial',
    numeric: true,
    disablePadding: false,
    label: 'P - Inicial'
  },
  {
    id: 'periodoFinal',
    numeric: false,
    disablePadding: false,
    label: 'P - Final'
  },
  {
    id: 'valorAdiantamento',
    numeric: true,
    disablePadding: false,
    label: 'Vl adiantamento'
  },
  {
    id: 'dataAdiantamento',
    numeric: false,
    disablePadding: false,
    label: 'DT Adiantamento'
  },
  {
    id: 'saldo',
    numeric: true,
    disablePadding: false,
    label: 'Saldo'
  },
  {
    id: 'acao',
    numeric: false,
    disablePadding: false,
    label: 'Ação'
  }
]

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
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
    maxWidth: '15ch',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  cellRowStyleNegative: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#d62133'
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

class DataTableAdiantamentoHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: false,
    loadRelatorio: false,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    },
    filter: {
      dataInicial: '',
      dataFinal: ''
    },
    dataTable: null,
    innerLoading: false,
    modalPrestacaoContas: false,
    inputs: {},
    idHistorico: null,
    modalRelatorios: false,
    modalSaldoContabil: false,
    modalContabilizacao: false,
    sending: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  gerarRelatorio = async () => {
    const { selected } = this.state
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

    try {
      const resultado = await Api.post(`/`)
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
      exportCSVFile(resultado.data, `relatorio_adiantamento_viagem_${new Date()}`, [])
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
      this.setState(state => ({ selected: state.data.map((n, index) => index) }))
      return
    }
    this.setState({ selected: [] })
  }

  requestService = async (filter = { dataInicial: this.state.filter.dataInicial, dataFinal: this.state.filter.dataFinal, type: this.state.reportType, busca_lotacao: this.state.busca_lotacao, busca_nome: this.state.busca_nome }) => {
    try {
      let buscaNome = this.state.busca_nome
      let buscaLotacao = this.state.busca_lotacao
      if (!buscaNome) {
        buscaNome = ''
      }
      if (!buscaLotacao) {
        buscaLotacao = ''
      }
      const resultado = await Api.get(`viagens/historic_advance/?initial_date=${filter.dataInicial}&end_date=${filter.dataFinal}&type=${this.state.reportType}&busca_lotacao=${buscaLotacao}&busca_nome=${buscaNome}`)
      this.setState({ ...this.state, innerLoading: false, filter: { dataInicial: filter.dataInicial, dataFinal: filter.dataFinal }, data: resultado.data })
    } catch (error) {
      this.setState({
        innerLoading: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  requestReportAccouting = async (filter = { dataInicial: this.state.filter.dataInicial, dataFinal: this.state.filter.dataFinal }) => {
    try {
      this.setState({ ...this.state, sending: true })
      const resultado = await Api.get(`viagens/accounting_report/?initial_date=${filter.dataInicial}&end_date=${filter.dataFinal}`)
      exportCSVFile(resultado.data, 'contabilizacao')
      this.setState({
        ...this.state,
        sending: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatorio gerado'
        }
      })
    } catch (error) {
      this.setState({
        ...this.state,
        sending: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  budgetReport = () => {
    this.setState({ ...this.state, sending: true })
    exportCSVFile(this.state.data, 'orçamento')
    this.setState({
      ...this.state,
      sending: false,
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatorio gerado'
      }
    })
  }

  handleClick = () => {
    this.setState({ 'data': [], innerLoading: true })
    this.requestService()
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

  openCloseModalTransacao = (idHistorico) => {
    this.setState({ ...this.state, modalPrestacaoContas: !this.state.modalPrestacaoContas, idHistorico: idHistorico })
  }

  openCloseModalSaldoContabil = () => {
    this.setState({ ...this.state, modalSaldoContabil: !this.state.modalSaldoContabil })
  }

  openCloseModalContabilizacao = () => {
    this.setState({ ...this.state, modalContabilizacao: !this.state.modalContabilizacao })
  }

  reloadData = () => {
    window.location.reload()
  }

  cleanFilters = () => {
    this.setState({
      filter: {
        dataInicial: '',
        dataFinal: ''
      }
    })
  }
  onChangeInputValue = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  }

  handleClickListItem = () => {
    this.setState({ ...this.state, modalRelatorios: !this.state.modalRelatorios })
  }

  render () {
    const { classes, dataLocation } = this.props
    const { data, order, innerLoading, orderBy, selected, rowsPerPage, page, sending } = this.state
    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <div className={classes.filterContainer}>
          <Grid item xs={3}>
            <FormControl margin='normal' fullWidth >
              <SelectReact
                options={dataLocation}
                name='busca_lotacao'
                placeholder='Selecione a lotação'
                // value={inputs.location}
                onChange={e => this.setState({ ...this.state, busca_lotacao: e.value }) }
                noOptionsMessage={() => 'Opção não encontrada'}
              />
              {/* <Select
                id='location'
                name='location'
                value={inputs.location}
                onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
              >
                {locations.map(itemLocation => (
                  <MenuItem key={itemLocation.id} value={itemLocation.codigo}>{itemLocation.descricao}</MenuItem>
                ))}
              </Select> */}
            </FormControl>
            <FormControl margin='normal' fullWidth>
              <InputLabel htmlFor='name'>Busca por nome</InputLabel>
              <Input
                id='busca_nome'
                type='name'
                name='busca_nome'
                value={this.state.busca_nome}
                onChange={e => this.setState({ ...this.state, [e.target.name]: e.target.value })}
              />
            </FormControl>
            {/* <FormControl fullWidth>
              <InputLabel shrink htmlFor='dateAdvance'>Busca por setor</InputLabel>
              <Select
                id='busca_lotacao'
                name='busca_lotacao'
                value={this.state.busca_lotacao}
                onChange={e => this.setState({ ...this.state, [e.target.name]: e.target.value }) }
              >
                <MenuItem value={''} />
                <MenuItem value={'101.01'}>{'AUDITORIA'}</MenuItem>
                <MenuItem value={'201.02'}>{'COMERCIAL PRIVATE FORTALEZA [CE]'}</MenuItem>
                <MenuItem value={'201.05'}>{'ACOMERCIAL PRIVATE JUAZEIRO [CE]'}</MenuItem>
              </Select>
            </FormControl> */}
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor='dateAdvance'>Tipo de pesquisa</InputLabel>
              <Select
                id='location'
                name='reportType'
                value={this.state.reportType}
                onChange={e => this.setState({ ...this.state, [e.target.name]: e.target.value }) }
              >
                <MenuItem value={undefined} />
                <MenuItem value={'Tudo em aberto'}>{'Tudo em aberto'}</MenuItem>
                <MenuItem value={'Saldo Contábil'}>{'Saldo Contábil'}</MenuItem>
                <MenuItem value={'Adiantamentos'}>{'Adiantamentos'}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            disable={this.state.reportType}
          />
        </div>
        <Grid container spacing={3} align='right' justify='flex-end' alignContent='space-between'>
          <Button
            onClick={() => this.openCloseModalSaldoContabil()}
            style={{ color: '#FFF', marginRight: '5px' }}
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            <DescriptionIcon />
            Saldo Contabil
          </Button>

          <Button
            onClick={() => this.openCloseModalContabilizacao()}
            style={{ color: '#FFF', marginRight: '5px' }}
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            { sending ? <CircularProgress
              size={25} style={{ color: '#FFF', marginRight: '3px' }} /> : <DescriptionIcon /> }
            Contabilização
          </Button>

          <Button
            onClick={() => this.budgetReport()}
            style={{ color: '#FFF' }}
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            <DescriptionIcon />
            Orçamento
          </Button>
        </Grid>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        { this.state.modalPrestacaoContas ? (
          <ModalPrestacaoContas
            open={this.state.modalPrestacaoContas}
            title={'Prestação de contas'}
            onClickCancel={() => this.openCloseModalTransacao()}
            idHistorico={this.state.idHistorico}
            requestData={() => this.requestService()}
            filterData={this.state.filter}
          />
        ) : null}
        { this.state.modalSaldoContabil ? (
          <ModalSaldoContabil
            open={this.state.modalSaldoContabil}
            title={'Saldo Contábil'}
            onClickCancel={() => this.openCloseModalSaldoContabil()}
            filterData={this.state.filter}
          />
        ) : null}
        { this.state.modalContabilizacao ? (
          <ModalContabilizacao
            open={this.state.modalContabilizacao}
            title={'Contabilização'}
            onClickCancel={() => this.openCloseModalContabilizacao()}
            filterData={this.state.filter}
          />
        ) : null}
        { innerLoading ? <Loading/> : data === null || data.length === 0 || dataLocation === null || dataLocation.length === 0
          ? <span className={classes.empytyTable}>DADOS NÃO ENCONTRADOS</span>
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
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isSelected = this.isSelected(index)
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
                          {item.nome}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.ds_lotacao}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.adiantamento === 1 ? (<span className={classes.sucesso}>Sim</span>) : (<span className={classes.falha}>Não</span>)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.origem}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.destino}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {formatDate(item.periodo_inicial)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {formatDate(item.periodo_final)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.valor_adiantamento)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {formatDate(item.data_adiantamento)}
                        </TableCell>
                        <TableCell className={parseFloat(item.saldo) >= 0 ? classes.cellRowStyle : classes.cellRowStyleNegative } align='left'>
                          {this.prettyNumber(item.saldo)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          <Button
                            onClick={() => this.openCloseModalTransacao(item.id_historico)}
                            variant='contained'
                            color='primary'
                            style={{ color: 'white' }}
                            className={classes.submit}
                          >
                            <EditIcon />
                          </Button>
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
          </Paper>}
      </MuiThemeProvider>
    )
  }
}

DataTableAdiantamentoHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableAdiantamentoHistorico)
