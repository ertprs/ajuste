import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'

const styles = (theme) => ({
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
    searchId: '',
    nomeCliente: '',
    tipo_ccb: '',
    cpf_cliente: '',
    titularidade: '',
    nome_arquivo: '',
    status: ''
  },
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  dataTable: null,
  innerLoading: false,
  loadingRelatorioAnalitico: false
}

class ControleCcbs extends Component {
  constructor (props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.cleanFilters = this.cleanFilters.bind(this)
  }

  componentWillMount () {
    if (this.props.location.state !== undefined) {
      this.requestService({ ...this.props.location.state.date })
    } else {
      this.requestService()
    }
  }

  onChangeInputValue = (e) => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  };

  cleanFilters () {
    this.setState({
      filter: {
        dataInicial: '',
        dataFinal: ''
      }
    })
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.dataTable, `relatorio_historico_bancarizacao`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  };

  requestService = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({
        dataTable: [],
        innerLoading: true
      })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?data_inicial=${dates.dataInicial}&data_final=${dates.dataFinal}`
      )
      this.setState({
        dataTable: result.data,
        innerLoading: false,
        filter: { ...dates }
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
    // this.setState( { dataTable: dataHistoricoPagamentos, innerLoading: false } )
  };
  // Pesquisa pelo IdCliente
  searchIdConta = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?id_conta=${dates.searchId}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim do IDCliente

  // Pesquisa pelo nome do Cliente
  searchNomeCliente = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?nome_cliente=${dates.nomeCliente}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim Pesquisa pelo nome do Cliente

  // Pesquisa pelo Tipo de CCB searchTipoCcb
  searchTipoCcb = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?tipo_ccb=${dates.tipo_ccb}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim do tipo de CCB

  // Pesquisa pelo CPF searchCpf
  searchCpf = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?cpf_cliente=${dates.cpf_cliente}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim do tipo de searchCpf

  // Pesquisa pelo Titularidade searchTitularidade
  searchTitularidade = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?titularidade=${dates.titularidade}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim do tipo de Titularidade

  // Pesquisa pelo nome_arquivo
  searchNomeArquivo = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({ dataTable: [], innerLoading: true })
      const result = await Api.get(
        `bancarizacao/controle_ccbs/?nome_arquivo=${dates.nome_arquivo}`
      )
      this.setState({
        dataTable: result.data,
        filter: { ...dates },
        innerLoading: false
      })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  };
  // Fim do tipo de Titularidade
  handleClick = () => {
    this.setState({ dataTable: [], innerLoading: true })
    this.requestService()
    this.searchIdConta()
    this.searchNomeCliente()
    this.searchTipoCcb()
    this.searchCpf()
    this.searchTitularidade()
    this.searchNomeArquivo()
  };
  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  };

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
        <TitlePage text={'Controle de CCBS'} />
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            gerarRelatorio={() => this.gerarRelatorio()}
          />
        </div>
        <div className={classes.dataTableContainer}>
          {this.state.dataTable ? (
            <DataTableHistorico
              data={this.state.dataTable}
              history={this.props.history}
              innerLoading={innerLoading}
              date={this.state.filter}
              requestService={() => this.requestService()}
              searchIdConta={() => this.searchIdConta()}
              searchNomeCliente={() => this.searchNomeCliente()}
              searchTipoCcb={() => this.searchTipoCcb()}
              searchCpf={() => this.searchCpf()}
              searchTitularidade={() => this.searchTitularidade()}
              searchNomeArquivo={() => this.searchNomeArquivo()}
            />
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(ControleCcbs)
