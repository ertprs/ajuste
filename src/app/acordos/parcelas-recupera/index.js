import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-acordos'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
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
  filter: {
    dataInicial: '',
    dataFinal: ''
  },
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  csv: []
}

class HistoricoParcelasRecupera extends Component {
  componentWillMount () {
    console.log(this.props.location.state)
    if (this.props.location.state !== undefined) {
      this.requestService(this.props.location.state.filter)
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

  requestService = async (filter = { dataInicial: this.state.filter.dataInicial, dataFinal: this.state.filter.dataFinal }) => {
    try {
      const resultado = await Api.get(`recupera/historic/?init_date=${filter.dataInicial}&end_date=${filter.dataFinal}`)
      this.setState({ filter: { dataInicial: filter.dataInicial, dataFinal: filter.dataFinal }, data: resultado.data })
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
    this.setState({ 'data': [] })
    this.requestService()
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.table ? this.state.dataMonth : this.state.data, `relatorio_parcelas_recupera`, [])
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
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Parcelas Recupera'} />
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
          { this.state.data && this.state.data.length > 0 ? (
            <Fragment>
              <DataTableHistorico
                dataHead= {Object.keys(this.state.data[0])}
                data={this.state.data}
                history={this.props.history}
                saldoAcumulado={this.state.saldoAcumulado}
                filter={{ ...this.state.filter }}
              />
            </Fragment>
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(HistoricoParcelasRecupera)
