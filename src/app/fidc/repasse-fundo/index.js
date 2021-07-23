import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
import Snackbar from '../../../components/snackbar'
import Api from '../../../services/Api'
import exportCSVFile from '../../../util/exportCSVFile'

const styles = theme => ({
  filterContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 0
    }
  },
  dataTableContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 5
    }
  }
})

const INITIAL_STATE = {
  dataCard: [],
  filter: {
    dataInicial: '',
    dataFinal: '',
    cedente: ''
  },
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  data: [],
  innerLoading: false,
  relatorioFuturoLoad: false
}

class RepasseFundo extends Component {
  constructor (props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.cleanFilters = this.cleanFilters.bind(this)
  }

  componentWillMount () {
    this.requestService()
  }

  onChangeInputValue = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  }

  cleanFilters () {
    this.setState({
      filter: {
        dataInicial: '',
        dataFinal: '',
        cedente: ''
      }
    })
  }

  requestService = async (e) => {
    const { filter } = this.state
    this.setState({ innerLoading: true })
    try {
      const resultado = await Api.get(`fidc/pegar_repasse_fundo?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
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
  handleClick = () => {
    this.setState({ data: [], innerLoading: false })
    this.requestService()
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  gerarRelatorioFuturo = async () => {
    const { filter } = this.state
    this.setState({ relatorioFuturoLoad: true })
    try {
      const resultado = await Api.get(`fidc/pegar_repasse_fundo?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
      this.setState({ data: resultado.data, relatorioFuturoLoad: false })
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
      exportCSVFile(resultado.data, `relatorio_lancamentos_futuros`, ['enviado_ftp'])
      this.setState({
        relatorioFuturoLoad: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        relatorioFuturoLoad: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  render () {
    const { classes } = this.props
    const { innerLoading, relatorioFuturoLoad } = this.state
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Repasse Fundo'} />
        <div className={classes.dataTableContainer}>
          <DataTableHistorico
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            gerarRelatorioFuturo={this.gerarRelatorioFuturo}
            data={this.state.data}
            history={this.props.history}
            innerLoading={innerLoading}
            relatorioFuturoLoad={relatorioFuturoLoad}
          />
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(RepasseFundo)
