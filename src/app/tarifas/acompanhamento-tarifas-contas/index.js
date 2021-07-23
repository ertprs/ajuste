import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DataTableHistoricoAnalitico from './components/data-table-tarifas-analitico'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import Snackbar from '../../../components/snackbar'
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
  data: []
}

class AcompanhamentoTarifasContas extends Component {
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

  componentWillReceiveProps ({ data }) {
    var dataContas = []

    // eslint-disable-next-line array-callback-return
    data.map(item => {
      dataContas.append(this.requestService(item.conta, item.dt_ocorrencia))
    })

    this.setState({ data: { ...dataContas } })
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
      var dataContas = []
      // eslint-disable-next-line array-callback-return
      await Promise.all(this.props.location.state.dataContas.map(async (item) => {
        let resultado = await Api.get(`consulta-tarifa-por-conta-ocorrencia?conta=${item.conta}&data_ocorrencia=${this.FormatdateApi(item.dt_ocorrencia)}`)
        // eslint-disable-next-line array-callback-return
        resultado.data.map(item => {
          dataContas.push({ ...item })
        })
      }))
      this.setState({ data: dataContas })
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

  requestLastFilter = async (filter) => {
    try {
      const resultado = await Api.get(`tarifas-agrupadas-por-conta?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
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

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  FormatdateApi = dateStr => {
    let dateList = dateStr.match(/\d+/g)
    return `${dateList[2]}-${dateList[1]}-${dateList[0]}`
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
        <TitlePage text={'Tarifas - Por Conta'} />
        <div className={classes.DataTableHistorico}>
          { this.state.data && this.state.data.length > 0 ? (
            <Fragment>
              <DataTableHistoricoAnalitico
                dataHead={Object.keys(this.state.data[0])}
                data={this.state.data}
                history={this.props.history}
                saldoAcumulado={this.state.saldoAcumulado}
                filter={{ ...this.state.filter }}
              />
              <Grid container direction='column' justify='space-around' alignItems='flex-end' style={{ marginTop: '10px' }}>
                <IconButton
                  onClick={() => this.props.history.push(
                    '/app/tarifas/acompanhamento-tarifas',
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

export default withStyles(styles)(AcompanhamentoTarifasContas)
