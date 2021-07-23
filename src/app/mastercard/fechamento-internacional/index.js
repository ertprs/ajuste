import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'
import ModalCotacao from './components/ModalCotacao'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  filterContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 0
    }
  },
  DataTableHistorico: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 5
    }
  },
  root: {
    height: 500,
    width: 200
  }
})

const INITIAL_STATE = {
  filter: {
    dataInicial: '',
    dataFinal: ''
  },
  isComplete: false,
  data: null,
  taxaCambio: '',
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  csv: [],
  report: '',
  existeSaldoAcumulado: false,
  saldoAcumulado: 0,
  labelTable: 'Visão por dia',
  labelChecked: false,
  table: false,
  innerLoading: false,
  openModalCotacao: false,
  editarCotacao: false,
  totalDolar: '',
  totalReal: '',
  variacao: '',
  openAlert: false
}

class FechamentoInternacionalMaster extends Component {
  componentWillMount () {
    // if (this.props.location.state !== undefined) {
    //   this.requestLastFilter(this.props.location.state.filter)
    // } else {
    //   this.requestService()
    // }
    // this.getSaldoAcumulado()
    // this.getProjecaoPorMes()
  }

  onChangeInputValue = e => {
    this.setState({
      [e.target.name]: e.target.value === 'undefined' ? '' : e.target.value
    })
  }

  onChangeInputValueDates = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value === 'undefined' ? '' : e.target.value
      }
    })
  }

  componentWillReceiveProps ({ datasConsulta }) {
    this.setState({ 'filter': { ...datasConsulta } })
  }

  cleanFilters = () => {
    this.setState({
      filter: {
        dataInicial: '',
        dataFinal: ''
      }
    })
  }

  requestLastFilter = async (filter) => {
    try {
      const resultado = await Api.get(`mastercard-internacional/get_batimento?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
      const resultadoPorMes = await Api.get(`projecao-parcelas-mastercard-por-mes?&data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal.trim()}`)
      this.setState({ filter: { dataInicial: filter.dataInicial, dataFinal: filter.dataFinal }, data: resultado.data, dataMonth: resultadoPorMes.data })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
    // this.setState({ filter: { dataInicial: filter.dataInicial, dataFinal: filter.dataFinal } })
  }

  requestService = async () => {
    const { filter } = this.state
    this.setState({ innerLoading: true })
    try {
      const resultado = await Api.get(`mastercard-internacional/get_fechamento?&data_inicial=${filter.dataInicial.trim()}&data_final=${filter.dataFinal.trim()}`)
      if (resultado.data) {
        if ('variacao' in resultado.data && 'cotacao' in resultado.data) {
          this.setState({
            variacao: resultado.data['variacao'],
            taxaCambio: resultado.data['cotacao'],
            editarCotacao: true,
            isComplete: true
          })
        } else {
          this.setState({
            variacao: '',
            taxaCambio: '',
            editarCotacao: false,
            isComplete: false
          })
        }
        this.setState({ data: resultado.data, innerLoading: false })
      }
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: error.response.data.detail
        },
        innerLoading: false
      })
    }
  }

  getSaldoAcumulado = async () => {
    try {
      const resultado = await Api.get(`consulta-saldo-acumulado-mastercardT140?&data_inicial=${this.state.filter.dataInicial.trim()}&data_final=${this.state.filter.dataFinal.trim()}`)
      if (resultado.data.divergencia) {
        this.setState({ saldoAcumulado: resultado.data.divergencia, existeSaldoAcumulado: true })
      }
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro ao buscar Saldo Acumulado'
        }
      })
    }
  }

  handleClick = () => {
    this.setState({ data: [], isComplete: false, taxaCambio: '', variacao: '' })
    this.requestService()
    // this.getSaldoAcumulado()
    // this.getProjecaoPorMes()
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.table ? this.state.dataMonth : this.state.data, `relatorio_mastercard`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  onChangeDataTable = () => {
    this.setState({
      labelChecked: !this.state.labelChecked,
      labelTable: this.state.labelChecked ? 'Visão por dia' : 'Visão por mês',
      table: !this.state.table
    })
  }

  openCloseModalCotacao = () => {
    if (this.state.editarCotacao) {
      this.setState({ openAlert: true })
    } else {
      this.setState({ openModalCotacao: !this.state.openModalCotacao })
    }
  }

  openAlertByModalCotacao = () => {
    this.setState({ openModalCotacao: !this.state.openModalCotacao })
  }

  changeIsComplete = (e) => {
    this.setState({
      variacao: e['variacao'],
      taxaCambio: e['taxaCambio'],
      isComplete: true
    })
  }
  closeAlert = () => {
    this.setState({ openAlert: !this.state.openAlert })
  }

  closeAlertSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  state = { ...INITIAL_STATE }
  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.closeAlertSnack}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Fechamento Internacional'} />
        <Dialog
          open={this.state.openAlert}
          onClose={this.closeAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Deseja editar a cotação?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Alterando o valor da cotação o saldo final também será alterado
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeAlert}>
              Cancelar
            </Button>
            <Button color="primary" autoFocus onClick={() => this.setState({ openAlert: false, openModalCotacao: true }) }>
              Aceitar
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.openModalCotacao && (
          <ModalCotacao
            title={'Cotação'}
            data={this.state.data}
            taxaCambio={this.state.taxaCambio}
            open={this.state.openModalCotacao}
            changeIsComplete={this.changeIsComplete}
            onClose={() => this.openAlertByModalCotacao()}
            onClickCancel={() => this.openAlertByModalCotacao()}
            onClickConfirm={() => this.openAlertByModalCotacao()}
          />
        )}

        <div className={classes.filterContainer}>
          <FilterData
            editarCotacao={this.state.editarCotacao}
            taxaCambio={this.state.taxaCambio}
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            onChangeInputValueDates={this.onChangeInputValueDates}
            gerarRelatorio={() => this.gerarRelatorio()}
            openCloseModalCotacao={() => this.openCloseModalCotacao()}
            history={this.props.history}
          />
        </div>
        <div className={classes.DataTableHistorico}>
          <Fragment>
            <DataTableHistorico
              innerLoading={this.state.innerLoading}
              onChangeInputValue={this.onChangeInputValue}
              data={this.state.data}
              variacao={this.state.variacao}
              history={this.props.history}
              taxaCambio={this.state.taxaCambio}
              isComplete={this.state.isComplete}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(FechamentoInternacionalMaster)
