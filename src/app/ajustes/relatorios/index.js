import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'

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
  labelTable: 'Somente SIG',
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
  table: false,
  innerLoading: false
}

class RelatorioAjuste extends Component {
  componentWillMount () {
    this.requestService()
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

  async requestService () {
    this.setState({ innerLoading: true })
    try {
      const resultado = await Api.get(`ajustes/relatorio_acesso_sig?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      this.setState({ data: resultado.data, innerLoading: false })
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

  gerarRelatorioAcessoSig = () => {
    exportCSVFile(this.state.table ? this.state.dataMonth : this.state.data, `relatorio_acesso_sig`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  gerarRelatorioLojista = async () => {
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
    this.setState({ gerarLojistaLoad: true })
    try {
      const resultado = await Api.get(`ajustes/relatorio_acesso_lojista?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      if (resultado.data.length <= 0) {
        this.setState({
          gerarLojistaLoad: false,
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Não existe ajuste para essa data'
          }
        })
        return null
      }
      exportCSVFile(resultado.data, `relatorio_ajuste_lojista`, [])
      this.setState({
        gerarLojistaLoad: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        gerarLojistaLoad: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
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
    this.setState({ gerarRelatorioSigLoad: true })
    try {
      const resultado = await Api.get(`ajustes/relatorio_batimento_ajuste?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      if (resultado.data.length <= 0) {
        this.setState({
          gerarRelatorioSigLoad: false,
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Não existe ajuste para essa data'
          }
        })
        return null
      }
      exportCSVFile(resultado.data, `relatorio_batimento_ajuste`, [])
      this.setState({
        gerarRelatorioSigLoad: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        gerarRelatorioSigLoad: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  handleClick = () => {
    this.setState({ 'data': [] })
    this.requestService()
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  state = { ...INITIAL_STATE }
  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Ajuste - Relatórios'} />
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            gerarRelatorio={() => this.gerarRelatorio()}
            gerarRelatorioAcessoSig={() => this.gerarRelatorioAcessoSig()}
            gerarRelatorioLojista={() => this.gerarRelatorioLojista()}
            gerarRelatorioSigLoad={this.state.gerarRelatorioSigLoad}
            gerarLojistaLoad={this.state.gerarLojistaLoad}
          />
        </div>
        <div className={classes.DataTableHistorico}>
          <Fragment>
            <DataTableHistorico
              dataHead={this.state.data.length === 0 ? null : Object.keys(this.state.data[0])}
              data={this.state.data}
              labelChecked={this.state.labelChecked}
              history={this.props.history}
              filter={{ ...this.state.filter }}
              innerLoading={this.state.innerLoading}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(RelatorioAjuste)
