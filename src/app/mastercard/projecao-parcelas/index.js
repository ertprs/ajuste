import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import DataTableTransacoesMes from './components/data-table-transacoes-por-mes'

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

const labelSwitch = {
  fontFamily: 'sans-serif',
  fontSize: '13px',
  fontWeight: 'bold',
  color: 'rgba(0, 0, 0, 0.54)'
}

const INITIAL_STATE = {
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
  innerLoading: false
}

class BatimentoParcelasMaster extends Component {
  componentWillMount () {
    if (this.props.location.state !== undefined) {
      this.requestLastFilter(this.props.location.state.filter)
    } else {
      this.requestService()
    }
    this.getSaldoAcumulado()
    this.getProjecaoPorMes()
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
      const resultado = await Api.get(`projecao-parcelas-mastercard?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
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
      const resultado = await Api.get(`projecao-parcelas-mastercard?data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal}`)
      this.setState({ data: resultado.data })
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

  getProjecaoPorMes = async () => {
    try {
      const resultado = await Api.get(`projecao-parcelas-mastercard-por-mes?&data_inicial=${this.state.filter.dataInicial}&data_final=${this.state.filter.dataFinal.trim()}`)
      this.setState({ dataMonth: resultado.data })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro ao buscar projecao por mes'
        }
      })
    }
  }

  handleClick = () => {
    this.setState({ 'data': [] })
    this.requestService()
    this.getSaldoAcumulado()
    this.getProjecaoPorMes()
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
        <TitlePage text={'Acompanhamento Mastercard'} />
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            gerarRelatorio={() => this.gerarRelatorio()}
          />
        </div>
        <div className={classes.DataTableHistorico}>
          <FormControlLabel
            control={
              <Switch color='default' checked={this.state.labelChecked} onChange={this.onChangeDataTable} />
            }
            label={<span style={labelSwitch}>{this.state.labelTable}</span>}
          />
          { this.state.data && this.state.data.length > 0 && this.state.dataMonth && this.state.dataMonth.length > 0 ? (
            <Fragment>
              {this.state.table ? (
                <DataTableTransacoesMes
                  dataHead={Object.keys(this.state.dataMonth[0])}
                  data={this.state.dataMonth}
                  history={this.props.history}
                  innerLoading={innerLoading}
                  filter={{ ...this.state.filter }}
                />
              ) : (
                <DataTableHistorico
                  dataHead={Object.keys(this.state.data[0])}
                  data={this.state.data}
                  history={this.props.history}
                  saldoAcumulado={this.state.saldoAcumulado}
                  filter={{ ...this.state.filter }}
                />)}
            </Fragment>
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(BatimentoParcelasMaster)
