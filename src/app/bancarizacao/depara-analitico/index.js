import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'

const styles = theme => ({
  root: {
    width: '50%',
    marginTop: theme.spacing.unit * 7,
    margin: 'auto',
    textAlign: 'center',
    overflowX: 'auto',
    padding: '10px'
  },
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
    dataFinal: ''
  },
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  dataTable: null,
  innerLoading: false,
  loadingRelatorioAnalitico: false,
  idConta: '',
  cpf: '',
  ccb: '',
  nomeArquivo: '',
  nomeCliente: '',
  titularidade: ''
}

class HistoricoAnalitico extends Component {
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

  onChangeInputValue = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  }

  onChangeInputValueFilters = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  cleanFilters () {
    this.setState({
      filter: {
        dataInicial: '',
        dataFinal: ''
      }
    })
  }

  gerarRelatorio = () => {
    if (!this.state.dataTable) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Resultado vazio'
        }
      })
    }
    exportCSVFile(this.state.dataTable, `relatorio_historico_bancarizacao`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  requestService = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({
        dataTable: [], innerLoading: true
      })

      let body = {
        'data_inicial': dates.dataInicial,
        'data_final': dates.dataFinal,
        'id_conta': this.state.idConta,
        'cpf': this.state.cpf,
        'ccb': this.state.ccb,
        'nome_arquivo': this.state.nomeArquivo,
        'nome_cliente': this.state.nomeCliente,
        'titularidade': this.state.titularidade
      }

      const result = await Api.post('bancarizacao/depara_analitico/', body)
      this.setState({ dataTable: result.data, innerLoading: false, filter: { ...dates } })
      exportCSVFile(this.state.dataTable, `relatorio_analitco_bancarizacao`, [])
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        },
        innerLoading: false
      })
    }
  }

  handleClick = () => {
    this.setState({ dataTable: [], innerLoading: true })
    this.requestService()
  }
  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

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
        <TitlePage text={'Relatório Analítico'} />
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            idConta={this.state.idConta}
            cpf={this.state.cpf}
            ccb={this.state.ccb}
            nomeArquivo={this.state.nomeArquivo}
            nomeCliente={this.state.nomeCliente}
            titularidade={this.state.titularidade}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            onChangeInputValueFilters={this.onChangeInputValueFilters}
          />
        </div>
        <div className={classes.dataTableContainer}>
          {this.state.innerLoading
            ? <Loading />
            : <Paper className={classes.root}>
              {this.state.dataTable && !this.state.innerLoading
                ? <span className={classes.empytyTable}>ARQUIVO GERADO</span>
                : <span className={classes.empytyTable}>SEM RESULTADO</span>}
            </Paper>
          }
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(HistoricoAnalitico)
