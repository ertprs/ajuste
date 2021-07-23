import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
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
  button: {
    [theme.breakpoints.up(10 + theme.spacing.unit * 2 * 2)]: {
      marginTop: theme.spacing.unit * 2
    }
  }
})

const INITIAL_STATE = {
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  csv: []
}

class BatimentoParcelasMasterT140 extends Component {
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
            <DataTableHistorico
              dataHead={Object.keys(this.state.data[0])}
              data={this.state.data}
              history={this.props.history}
              dtArquivoT140={this.props.location.state.dt_arquivo_t140}
            />
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(BatimentoParcelasMasterT140)
