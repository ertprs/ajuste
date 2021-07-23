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
// import Swal from 'sweetalert2'
import React from 'react'
import formatDate from '../../../../util/date'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import exportCSVFile from '../../../../util/exportCSVFile'
import Api from '../../../../services/Api'
import Snackbar from '../../../../components/snackbar'
import FilterData from './FilterData'
import ModalRegularizacao from './ModalRegularizacao'

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
    id: 'cnpj',
    numeric: false,
    disablePadding: false,
    label: 'CNPJ'
  },
  {
    id: 'agencia',
    numeric: true,
    disablePadding: false,
    label: 'AGÊNCIA'
  },
  {
    id: 'conta',
    numeric: true,
    disablePadding: false,
    label: 'CONTA'
  },
  {
    id: 'razaoSocial',
    numeric: true,
    disablePadding: false,
    label: 'ESTABELECIMENTO'
  },
  {
    id: 'motivo',
    numeric: true,
    disablePadding: false,
    label: 'MOTIVO'
  },
  {
    id: 'vlPendente',
    numeric: true,
    disablePadding: false,
    label: 'VL_PENDENTE'
  },
  {
    id: 'vlRegl',
    numeric: true,
    disablePadding: false,
    label: 'VL_REGL'
  },
  {
    id: 'dtRegl',
    numeric: true,
    disablePadding: false,
    label: 'DT_REGL'
  },
  {
    id: 'tpReg',
    numeric: true,
    disablePadding: false,
    label: 'TIPO_REGL'
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
    dataAux: this.props.data,
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
    openModalRegularizacao: false,
    banco: '',
    cnpj: '',
    reglEditado: [],
    tipoRegl: '',
    vlRegl: '',
    itemSelected: '',
    loadingRegularizacao: false,
    lote: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data, dataAux: data })
  }

  componentDidMount () {
  }

  gerarRelatorio = async () => {
    const { data } = this.state

    exportCSVFile(data, `relatorio_repasse_pendente`, [])
    this.setState({
      loadRelatorio: false,
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
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

  openCloseModalRegularizacao (itemSelected, index) {
    this.setState({ itemSelected: index, tipoRegl: '', vlRegl: '' }, () =>
      this.setState({
        openModalRegularizacao: !this.state.openModalRegularizacao
      })
    )
  }

  onChangeInputBanco = e => {
    this.setState({
      banco: e.target.value
    })
  }

  onChangeInputCnpj = e => {
    this.setState({
      cnpj: e.target.value
    })
  }

  filtrarData = () => {
    const { dataAux, banco, cnpj } = this.state
    let newData = dataAux
    if (banco) {
      newData = newData.filter((value) => value.bco === banco)
    }
    if (cnpj) {
      newData = newData.filter((value) => value.cnpj === cnpj)
    }
    this.setState({ data: newData, page: 0 })
  }

  cleanFilters = () => {
    this.setState({ data: this.state.dataAux, page: 0, banco: '', cnpj: '' })
  }

  onChangeInputValueModal = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onChangeInputVlRegl = (e) => {
    this.setState({ vlRegl: e })
  }

  salvarAlteracoesRegularizacao = async () => {
    const { itemSelected, data, tipoRegl, vlRegl } = this.state
    this.setState({ loadingRegularizacao: true })
    const user = JSON.parse(localStorage.getItem('user'))
    let obj = {
      item_selected: data[itemSelected],
      tipo_regl: tipoRegl,
      vl_regl: vlRegl,
      email: user.mail
    }
    try {
      const resultado = await Api.post(`syspag/realizar_regularizacao_pendente/`, obj)
      if (resultado.data.error) {
        this.setState({
          loadingRegularizacao: false,
          snackbar: {
            open: true,
            variant: 'error',
            message: resultado.data.message
          }
        })
        return
      }
      this.setState({
        snackbar: {
          open: true,
          variant: 'success',
          message: resultado.data.message
        }
      })
      await this.props.requestService()
      this.setState({
        openModalRegularizacao: false,
        loadingRegularizacao: false
      })
    } catch (error) {
      this.setState({
        loadingRegularizacao: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  salvarAlteracoesRegularizacaoLote = async () => {
    const { data, tipoRegl, vlRegl, selected } = this.state
    this.setState({ loadingRegularizacao: true })
    const user = JSON.parse(localStorage.getItem('user'))
    let newData = selected.map((value) => data[value])
    let obj = {
      item_selected: newData,
      tipo_regl: tipoRegl,
      vl_regl: vlRegl,
      email: user.mail
    }
    try {
      const resultado = await Api.post(`syspag/realizar_regularizacao_pendente/`, obj)
      if (resultado.data.error) {
        this.setState({
          loadingRegularizacao: false,
          snackbar: {
            open: true,
            variant: 'error',
            message: resultado.data.message
          }
        })
        return
      }
      this.setState({
        snackbar: {
          open: true,
          variant: 'success',
          message: resultado.data.message
        }
      })
      await this.props.requestService()
      this.setState({
        openModalRegularizacao: false,
        loadingRegularizacao: false
      })
    } catch (error) {
      this.setState({
        loadingRegularizacao: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  showTipoRegl = (item, index) => {
    if (item.tipo_regl) {
      return item.tipo_regl
    } else {
      return 'Tipo Regl'
    }
  }

  openCloseModalRegularizacaoLote = () => {
    this.setState({ lote: true })
    this.openCloseModalRegularizacao()
  }

  verificarSalvarRegl = () => {
    if (this.state.lote) {
      this.salvarAlteracoesRegularizacaoLote()
    } else {
      this.salvarAlteracoesRegularizacao()
    }
  }

  render () {
    const { classes, innerLoading } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, loadRelatorio, banco, cnpj } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {this.state.openModalRegularizacao && (
          <ModalRegularizacao
            title={'Escolha a opção'}
            open={this.state.openModalRegularizacao}
            history={this.props.history}
            tipoRegl={this.state.tipoRegl}
            vlRegl={this.state.vlRegl}
            loadingRegularizacao={this.state.loadingRegularizacao}
            onChangeInputValue={this.onChangeInputValueModal}
            onChangeInputVlRegl={this.onChangeInputVlRegl}
            onClose={() => this.openCloseModalRegularizacao()}
            onClickCancel={() => this.openCloseModalRegularizacao()}
            onClickConfirm={() => this.verificarSalvarRegl()}
          />
        )}
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.props.filter}
            banco={banco}
            cnpj={cnpj}
            data={data}
            handleClick={this.filtrarData}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.props.onChangeInputValue}
            onChangeInputBanco={this.onChangeInputBanco}
            onChangeInputCnpj={this.onChangeInputCnpj}
            gerarRelatorio={this.gerarRelatorio}
            openCloseModalRegularizacaoLote={() => this.openCloseModalRegularizacaoLote()}
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
                          {formatDate(item.dt_arquivo)}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.bco}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.cnpj}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.agencia}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.conta}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left' title={item.razao_social}>
                          {item.razao_social_cut}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left' title={item.motivo}>
                          {item.motivo_cut}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.vl_pendente).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.vl_regl).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.dt_regl ? formatDate(item.dt_regl) : ''}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          <IconButton
                            className={classes.cellRowStyle}
                            onClick={() => this.openCloseModalRegularizacao(item, index)}
                            disabled={item.motivo === 'Não Encontrado no Retorno'}
                          >
                            {this.showTipoRegl(item, index)}
                          </IconButton>
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
