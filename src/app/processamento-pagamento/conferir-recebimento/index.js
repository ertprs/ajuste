import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableRecebimentoSintetico from './components/data-table-recebimento-sintetico'
import GerarRelatorio from './components/GerarRelatorio'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import Snackbar from '../../../components/snackbar'
import IconButton from '../../../components/buttons/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Grid from '@material-ui/core/Grid'
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
  },
  button: {
    [theme.breakpoints.up(10 + theme.spacing.unit * 2 * 2)]: {
      marginTop: theme.spacing.unit * 2
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
  cedentesCsv: [],
  contasCsv: []
}

class ConferirRemessa extends Component {
  constructor (props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentWillMount () {
    this.requestService()
  }

  updateCedentesContasCsv = (cedentesCsv, contasCsv) => {
    this.setState({ cedentesCsv, contasCsv })
  }

  async requestService () {
    const data = {
      dt_pagamento: this.props.location.state.dt_pagamento
    }

    try {
      const resultado = await Api.get(`recebimento-sintetico?dt_ocorrencia=${data.dt_pagamento}`)

      this.setState({ dataTable: resultado.data })
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
        <TitlePage text={'Conferir Recebimento'} />
        <div className={classes.filterContainer}>
          <GerarRelatorio
            cedentesCsv={this.state.cedentesCsv}
            contasCsv={this.state.contasCsv}
            onChangeInputValue={this.onChangeInputValue}
            dataSintetico={this.state.dataTable}
            dataOcorrencia={this.props.location.state.dt_pagamento}
          />
        </div>
        <div className={classes.dataTableContainer}>
          {this.state.dataTable ? (
            <Fragment>
              <DataTableRecebimentoSintetico
                data={this.state.dataTable}
                idPortadorImport={this.props.location.state.id}
                updateCedentesContasCsv={(cedentes, contas) =>
                  this.updateCedentesContasCsv(cedentes, contas)
                }
              />
              <Grid container direction='column' justify='space-around' alignItems='flex-end'>
                <IconButton
                  onClick={() => this.props.history.goBack()}
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

export default withStyles(styles)(ConferirRemessa)
