import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import Loading from '../../../components/loading'
import TitlePage from '../../../components/title'
import DataTableHistorico from './components/data-table-historico'
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
  data: null,
  innerLoading: false
}

class PagamentoRav extends Component {
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

  requestService = async (e) => {
    const { filter } = this.state
    this.setState({ innerLoading: true })
    try {
      const resultado = await Api.get(`fidc/pegar_pagamento_rav?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}`)
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
        <TitlePage text={'Pagamento Rav'} />
        <div className={classes.dataTableContainer}>
          {this.state.data ? (
            <DataTableHistorico
              filter={this.state.filter}
              handleClick={this.handleClick}
              cleanFilters={this.cleanFilters}
              onChangeInputValue={this.onChangeInputValue}
              data={this.state.data}
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

export default withStyles(styles)(PagamentoRav)
