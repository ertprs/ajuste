import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
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
  dataTable: null,
  innerLoading: false
}

class Historico extends Component {
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

  requestService = e => {
    const data = {
      data_inicial: this.state.filter.dataInicial,
      data_final: this.state.filter.dataFinal,
      cedente: this.state.filter.cedente
    }

    fetch(`${process.env.REACT_APP_API_URL}/emissao-registro/load-grig-historico-cortes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(data => data.json())
      .then(data => {
        this.setState({ dataTable: data, innerLoading: false })
      })
      .catch(() =>
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro no servidor'
          }
        })
      )
  }

  requestServiceRelatorioSintetico = () => {
    exportCSVFile(this.props.dataSintetico, `relatorio_sintetico`)
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
    const { innerLoading } = this.state
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Acompanhamento'} />
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
          />
        </div>
        <div className={classes.dataTableContainer}>
          {this.state.dataTable ? (
            <DataTableHistorico
              data={this.state.dataTable}
              history={this.props.history}
              innerLoading={innerLoading}
            />
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(Historico)
