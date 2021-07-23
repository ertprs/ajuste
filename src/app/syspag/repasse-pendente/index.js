import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
import Snackbar from '../../../components/snackbar'
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
  data: [],
  innerLoading: false
}

class RepassePendenteSyspag extends Component {
  constructor (props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.cleanFilters = this.cleanFilters.bind(this)
  }

  componentDidMount = () => {
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
      },
      banco: ''
    })
  }

  requestService = async (e) => {
    this.setState({ innerLoading: true })
    let obj = {
      dt_arquivo: this.props.location.state.dt_arquivo
    }

    try {
      const resultado = await Api.post(`syspag/pegar_repasse_pendente/`, obj)
      this.setState({ data: resultado.data, innerLoading: false })
    } catch (error) {
      this.setState({
        innerLoading: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }
  handleClick = () => {
    this.setState({ data: [] })
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
        <TitlePage text={'Repasse Pendente'} />
        <div className={classes.dataTableContainer}>
          {this.state.data ? (
            <DataTableHistorico
              filter={this.state.filter}
              handleClick={this.handleClick}
              cleanFilters={this.cleanFilters}
              onChangeInputValue={this.onChangeInputValue}
              onChangeInputBanco={this.onChangeInputBanco}
              requestService={this.requestService}
              data={this.state.data}
              history={this.props.history}
              innerLoading={innerLoading}
            />
          ) : (
            <Loading />
          )}
          <Grid container direction='column' justify='space-around' alignItems='flex-end' style={{ marginTop: 10 }}>
            <IconButton
              onClick={() => this.props.history.goBack()}
              className={classes.button}
              text={'Voltar'}
              icon={<ArrowBackIcon className={classes.rightIcon} />}
            />
          </Grid>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(RepassePendenteSyspag)
