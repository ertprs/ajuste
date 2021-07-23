import { withStyles } from '@material-ui/core/styles'
import FilterData from './components/FilterData'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-acordos'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import Snackbar from '../../../components/snackbar'
import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'
import Grid from '@material-ui/core/Grid'
import IconButton from '../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

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

class RegistradosRetorno extends Component {
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

  requestService = async () => {
    try {
      const resultado = await Api.get(`acompanhamentos-acordos/retorno_registrados/?data_emissao=${this.props.location.state.dt_emissao}`)
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

  handleClick = () => {
    this.setState({ 'data': [] })
    this.requestService()
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.data, `relatorio_retorno_registrados`, [])
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
        <TitlePage text={'Acordos - Retorno x Online'} />
        <div className={classes.DataTableHistorico}>
          { this.state.data && this.state.data.length > 0 ? (
            <Fragment>
              <Grid container direction='row' justify='flex-end' alignItems='baseline'>
                <FilterData gerarRelatorio={() => this.gerarRelatorio()} />
              </Grid>
              <DataTableHistorico
                dataHead= {Object.keys(this.state.data[0])}
                data={this.state.data}
                history={this.props.history}
                saldoAcumulado={this.state.saldoAcumulado}
                filter={{ ...this.state.filter }}
              />
              <Grid container style={{ marginTop: '10px' }} direction='column' justify='space-around' alignItems='flex-end'>
                <IconButton
                  onClick={() => this.props.history.push(
                    '/app/acordos/historico-acordos',
                    {
                      filter: this.props.location.state.filter
                    }
                  )}
                  className={classes.button}
                  text={'Voltar'}
                  icon={<ArrowBackIcon className={classes.rightIcon} />}
                />
              </Grid>
            </Fragment>
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(RegistradosRetorno)
