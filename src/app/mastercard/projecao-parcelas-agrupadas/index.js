import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import Snackbar from '../../../components/snackbar'
import FilterData from './components/FilterData'
import Grid from '@material-ui/core/Grid'
import ModalBatimentoBaseUnica from './components/modal-batimento-baseunica'
import green from '@material-ui/core/colors/green'
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck'
import Button from '@material-ui/core/Button'
import exportCSVFile from '../../../util/exportCSVFile'
import IconButton from '../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
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
  button: {
    [theme.breakpoints.up(10 + theme.spacing.unit * 2 * 2)]: {
      marginTop: theme.spacing.unit * 2
    }
  }
})

const theme = createMuiTheme({
  palette: {
    primary: green,
    marginLeft: 10
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: 'white'
      }
    }
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
  openModalEstornoTarifas: false,
  openModalBatimentoBaseUnica: false,
  existeTarifa: false,
  tarifa: 0,
  existeEstorno: false,
  estorno: 0
}

class BatimentoParcelasMasterAgrupadas extends Component {
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

  cleanFilters = () => {
    this.setState({
      dt_arquivo_t140: '',
      filter: {
        dataInicial: '',
        dataFinal: ''
      }
    })
  }

  async requestService () {
    const data = {
      dt_agenda: this.props.location.state.dt_agenda
    }

    try {
      const resultado = await Api.get(`projecao-parcelas-agrupadas-mastercard?data_agenda=${data.dt_agenda}`)
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

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.data, `relatorio_mastercard_agrupado`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  openModalEstornoTarifas = () => {
    this.setState({ openModalEstornoTarifas: !this.state.openModalEstornoTarifas })
  }

  openCloseModalBatimentoBaseUnica = () => {
    this.setState({ openModalBatimentoBaseUnica: !this.state.openModalBatimentoBaseUnica })
  }

  openCloseModalEstornoTarifas = () => {
    this.setState({ openModalEstornoTarifas: !this.state.openModalEstornoTarifas })
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
        <TitlePage text={'Mastercard - Agrupada'} />
        <div className={classes.DataTableHistorico}>
          { this.state.data && this.state.data.length > 0 ? (
            <Fragment>
              <Grid container direction='row' justify='flex-end' alignItems='baseline'>
                <FilterData gerarRelatorio={() => this.gerarRelatorio()} />
                <MuiThemeProvider theme={theme}>
                  <Button
                    onClick={() => this.openCloseModalBatimentoBaseUnica()}
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                  >
                    <PlaylistAddCheck />
                    Transações Base Unica
                  </Button>
                </MuiThemeProvider>
              </Grid>
              {this.state.openModalBatimentoBaseUnica && (
                <ModalBatimentoBaseUnica
                  title={'Batimento transações Mastercard - Base Unica'}
                  dataAgenda={this.props.location.state.dt_agenda}
                  open={this.state.openModalBatimentoBaseUnica}
                  onClose={() => this.openCloseModalBatimentoBaseUnica()}
                  onClickCancel={() => this.openCloseModalBatimentoBaseUnica()}
                  onClickConfirm={() => this.openCloseModalBatimentoBaseUnica()}
                />
              )}
              <DataTableHistorico
                dataHead={Object.keys(this.state.data[0])}
                data={this.state.data}
                history={this.props.history}
              />
              <Grid container direction='column' justify='space-around' alignItems='flex-end'>
                <IconButton
                  onClick={() => this.props.history.push(
                    '/app/mastercard/batimento-parcelas-master',
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

export default withStyles(styles)(BatimentoParcelasMasterAgrupadas)
