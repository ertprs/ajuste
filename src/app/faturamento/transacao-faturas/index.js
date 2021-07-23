import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes-por-mes'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import Api from '../../../services/Api'
import ModalTransacao from './components/ModalTransacao'

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
  data: [],
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
  loaded: false
}

class TransacaoFaturamento extends Component {
  componentWillMount () {
    // this.requestService()
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
      const resultado = await Api.get(`faturamento/get_faturamento_list?data_inicial=${filter.dataInicial.trim()}&data_final=${filter.dataFinal.trim()}`)
      if (resultado.data) {
        this.setState({ data: resultado.data, innerLoading: false, loaded: true })
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
        <TitlePage text={'Transação Fatura'} />
        {this.state.openModalBatimento && (
          <ModalTransacao
            title={'Cotação'}
            data={this.state.data}
            taxaCambio={this.state.taxaCambio}
            open={this.state.openModalBatimento}
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

export default withStyles(styles)(TransacaoFaturamento)
