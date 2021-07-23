import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes-por-mes'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import Api from '../../../services/Api'
import ModalTransacao from './components/ModalTransacao'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import exportCSVFile from '../../../util/exportCSVFile'

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
  openModalBatimento: false,
  editarCotacao: false,
  totalDolar: '',
  totalReal: '',
  variacao: '',
  openAlert: false,
  gerarRelatorioGarantia: false
}

class ContaGarantidaMaster extends Component {
  componentWillMount () {
    this.requestService()
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

  requestService = async () => {
    const { filter } = this.state
    this.setState({ innerLoading: true })
    try {
      const resultado = await Api.get(`mastercard-garantias/get_liquidacoes?&data_inicial=${filter.dataInicial.trim()}&data_final=${filter.dataFinal}`)
      if (resultado.data && resultado.data.hasOwnProperty('detail')) {
        this.setState({
          innerLoading: false
        })
      } else if (resultado.data) {
        this.setState({ data: resultado.data, innerLoading: false })
      }
    } catch (error) {
      if (error.response) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: error.response.data.detail
          },
          innerLoading: false
        })
      } else {
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro interno no servidor'
          },
          innerLoading: false
        })
      }
    }
  }

  handleClick = () => {
    this.setState({ data: [], isComplete: false })
    this.requestService()
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  openCloseModalBatimento = () => {
    this.setState({ openModalBatimento: !this.state.openModalBatimento })
  }

  openAlertByModalBatimento = () => {
    this.setState({ openModalBatimento: !this.state.openModalBatimento })
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

  gerarRelatorio = async () => {
    const { filter } = this.state
    if (filter.dataInicial === '' || filter.dataFinal === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Precisa preencher data inicial e final'
        }
      })
      return
    }
    this.setState({ gerarRelatorioGarantia: true })
    try {
      const resultado = await Api.get(`mastercard-garantias/get_liquidacoes?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      if (resultado.data.length <= 0) {
        this.setState({
          gerarRelatorioGarantia: false,
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Não existe ajuste para essa data'
          }
        })
        return null
      }
      exportCSVFile(resultado.data, `relatorio_mastercard_garantia`, [])
      this.setState({
        gerarRelatorioGarantia: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        gerarRelatorioGarantia: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
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
        <TitlePage text={'Conta Garantida'} />
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
        {this.state.openModalBatimento && (
          <ModalTransacao
            title={'Cotação'}
            data={this.state.data}
            taxaCambio={this.state.taxaCambio}
            open={this.state.openModalBatimento}
            dataArquivo={this.state.filter.dataInicial}
            changeIsComplete={this.changeIsComplete}
            onClose={() => this.openAlertByModalBatimento()}
            onClickCancel={() => this.openAlertByModalBatimento()}
            onClickConfirm={() => this.openAlertByModalBatimento()}
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
            openCloseModalBatimento={() => this.openCloseModalBatimento()}
            gerarRelatorioGarantia={this.state.gerarRelatorioGarantia}
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
              openCloseModalBatimento={() => this.openCloseModalBatimento()}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(ContaGarantidaMaster)
