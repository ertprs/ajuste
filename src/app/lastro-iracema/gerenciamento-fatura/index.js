import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import ModalDetalhamento from './components/modal-detalhamento'
import ModalFaturas from './components/modal-faturas'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'

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
  isComplete: false,
  data: [],
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  csv: [],
  report: '',
  labelChecked: false,
  table: false,
  innerLoading: false,
  openModalDetalhamento: false,
  openModalFaturas: false,
  openAlert: false,
  idConta: '',
  nsu: '',
  fieldsToDisable: {
    data: false,
    idConta: false,
    nsu: false
  }
}

class GerenciamentoFatura extends Component {
  componentWillMount () {

  }

  onChangeInputValue = e => {
    this.setState({
      [e.target.name]: e.target.value === 'undefined' ? '' : e.target.value
    })
  }

  onChangeInputDisable = (field1 = '', field2 = '', field3 = '', field4 = '') => {
    this.setState({
      fieldsToDisable: {
        [field1]: field1 !== '',
        [field2]: field2 !== '',
        [field3]: field3 !== '',
        [field4]: field4 !== ''
      }
    })
  }

  onChangeInputValueDates = e => {
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
      },
      idConta: ''
    })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  closeAlertSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  openCloseModalDetalhamento = (isProduto = false) => {
    this.setState({ openModalDetalhamento: !this.state.openModalDetalhamento, isProduto })
  }

  openCloseModalFaturas = () => {
    this.setState({ openModalFaturas: !this.state.openModalFaturas })
  }

  updateData = (data) => {
    this.setState({ data })
  }

  state = { ...INITIAL_STATE }
  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.closeAlertSnack}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Faturas'} />
        {this.state.openModalDetalhamento && (
          <ModalDetalhamento
            title={'Detalhamento'}
            data={this.state.data}
            open={this.state.openModalDetalhamento}
            onClose={() => this.openCloseModalDetalhamento()}
            onClickCancel={() => this.openCloseModalDetalhamento()}
            onClickConfirm={() => this.openCloseModalDetalhamento()}
          />
        )}
        {this.state.openModalFaturas && (
          <ModalFaturas
            title={'Faturas'}
            data={this.state.data}
            open={this.state.openModalFaturas}
            onClose={() => this.openCloseModalFaturas()}
            onClickCancel={() => this.openCloseModalFaturas()}
            onClickConfirm={() => this.openCloseModalFaturas()}
          />
        )}
        <div className={classes.filterContainer}>
          <FilterData
            fieldsToDisable={this.state.fieldsToDisable}
            idConta={this.state.idConta}
            nsu={this.state.nsu}
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            onChangeInputValueDates={this.onChangeInputValueDates}
            history={this.props.history}
          />
        </div>
        <div className={classes.DataTableHistorico}>
          <Fragment>
            <DataTableHistorico
              onChangeInputDisable={this.onChangeInputDisable}
              fieldsToDisable={this.state.fieldsToDisable}
              updateData={this.updateData}
              openCloseModalDetalhamento={this.openCloseModalDetalhamento}
              openCloseModalFaturas={this.openCloseModalFaturas}
              filter={this.state.filter}
              idConta={this.state.idConta}
              nsu={this.state.nsu}
              innerLoading={this.state.innerLoading}
              onChangeInputValue={this.onChangeInputValue}
              data={this.state.data}
              history={this.props.history}
              handleClick={this.handleClick}
              isComplete={this.state.isComplete}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(GerenciamentoFatura)
