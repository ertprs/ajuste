import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
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
  loadingRelatorioAnalitico: false
}

class HistoricoBancarizacao extends Component {
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
  }

  requestService = async (dates = { ...this.state.filter }) => {
    try {
      this.setState({
        dataTable: [], innerLoading: true
      })
      const result = await Api.get(`bancarizacao/historic/?init_date=${dates.dataInicial}&end_date=${dates.dataFinal}`)
      this.setState({ dataTable: result.data, innerLoading: false, filter: { ...dates } })
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
        <TitlePage text={'Rotativo Bancarização'} />
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
            />
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(HistoricoBancarizacao)
