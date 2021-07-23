import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import TitlePage from '../../../components/title'
// import Loading from '../../../components/loading'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'
import ModalTransacao from './components/ModalTransacao'
import ModalFechamento from './components/ModalFechamento'
import ModalCotacao from './components/ModalCotacao'

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
  data: [],
  filter: {
    dataInicial: '',
    dataFinal: ''
  },
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
  innerLoading: true,
  openModalTransacao: false,
  openModalCotacao: false
}

class BatimentoInternacionalMaster extends Component {
  componentWillMount () {
    if (this.props.location.state !== undefined) {
      this.requestLastFilter(this.props.location.state.filter)
    } else {
      this.requestService()
    }
  }

  onChangeInputValue = e => {
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

  async requestService () {
    try {
      const resultado = await Api.get(`mastercard-internacional/get_batimento?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      this.setState({ data: resultado.data, innerLoading: false })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  handleClick = () => {
    this.setState({ innerLoading: true })
    this.requestService()
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.table ? this.state.dataMonth : this.state.data, `relatorio_mastercard`, [], true)
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

  openCloseModalTransacao = () => {
    this.setState({ openModalTransacao: !this.state.openModalTransacao })
  }

  openCloseModalCotacao = () => {
    this.setState({ openModalCotacao: !this.state.openModalCotacao })
  }

  state = { ...INITIAL_STATE }
  render () {
    const { classes } = this.props
    const { innerLoading } = this.state
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Mastercard Internacional'} />
        {this.state.openModalTransacao && (
          <ModalTransacao
            title={'Informar Transação'}
            open={this.state.openModalTransacao}
            onClose={() => this.openCloseModalTransacao()}
            onClickCancel={() => this.openCloseModalTransacao()}
            onClickConfirm={() => this.openCloseModalTransacao()}
          />
        )}

        {this.state.openModalCotacao && (
          <ModalCotacao
            title={'Cotação'}
            open={this.state.openModalCotacao}
            onClose={() => this.openCloseModalCotacao()}
            onClickCancel={() => this.openCloseModalCotacao()}
            onClickConfirm={() => this.openCloseModalCotacao()}
          />
        )}

        {this.state.openModalFechamento && (
          <ModalFechamento
            title={'Fechamento'}
            open={this.state.openModalFechamento}
            onClose={() => this.openCloseModalFechamento()}
            onClickCancel={() => this.openCloseModalFechamento()}
            onClickConfirm={() => this.openCloseModalFechamento()}
          />
        )}

        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            gerarRelatorio={() => this.gerarRelatorio()}
            openModalTransacao={() => this.openCloseModalTransacao()}
            openModalCotacao={() => this.openCloseModalCotacao()}
            history={this.props.history}
          />
        </div>
        <div className={classes.DataTableHistorico}>
          <Fragment>
            <DataTableHistorico
              innerLoading={innerLoading}
              dataHead={this.state.data.length === 0 ? null : Object.keys(this.state.data[0])}
              data={this.state.data}
              history={this.props.history}
              saldoAcumulado={this.state.saldoAcumulado}
              filter={{ ...this.state.filter }}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(BatimentoInternacionalMaster)
