import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableHistorico from './components/data-table-transacoes'
import ModalDetalhamento from './components/modal-detalhamento'
import TitlePage from '../../../components/title'
import FilterData from './components/FilterData'
import Snackbar from '../../../components/snackbar'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

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
  isProduto: false,
  openAlert: false,
  idConta: '',
  cpf: '',
  fieldsToDisable: {
    data: false,
    idConta: false,
    cpf: false
  }
}

class GerenciamentoJuridico extends Component {
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

  closeAlert = () => {
    this.setState({ openAlert: !this.state.openAlert })
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
        <TitlePage text={'Documentos'} />
        <Dialog
          open={this.state.openAlert}
          onClose={this.closeAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Deseja editar a cotação?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Alterando o valor da cotação o saldo final também será alterado
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeAlert}>
              Cancelar
            </Button>
            <Button color="primary" autoFocus onClick={() => this.setState({ openAlert: false, openModalCotacao: true }) }>
              Aceitar
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.openModalDetalhamento && (
          <ModalDetalhamento
            title={'Detalhamento'}
            data={this.state.data}
            isProduto={this.state.isProduto}
            open={this.state.openModalDetalhamento}
            onClose={() => this.openCloseModalDetalhamento()}
            onClickCancel={() => this.openCloseModalDetalhamento()}
            onClickConfirm={() => this.openCloseModalDetalhamento()}
          />
        )}
        <div className={classes.filterContainer}>
          <FilterData
            fieldsToDisable={this.state.fieldsToDisable}
            editarCotacao={this.state.editarCotacao}
            idConta={this.state.idConta}
            cpf={this.state.cpf}
            filter={this.state.filter}
            handleClick={this.handleClick}
            cleanFilters={this.cleanFilters}
            onChangeInputValue={this.onChangeInputValue}
            onChangeInputValueDates={this.onChangeInputValueDates}
            gerarRelatorio={() => this.gerarRelatorio()}
            openCloseModalCotacao={() => this.openCloseModalCotacao()}
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
              openModalDetalhamentoProdutoFinanceiro={this.openModalDetalhamentoProdutoFinanceiro}
              filter={this.state.filter}
              idConta={this.state.idConta}
              cpf={this.state.cpf}
              innerLoading={this.state.innerLoading}
              onChangeInputValue={this.onChangeInputValue}
              data={this.state.data}
              variacao={this.state.variacao}
              history={this.props.history}
              handleClick={this.handleClick}
              taxaCambio={this.state.taxaCambio}
              isComplete={this.state.isComplete}
            />
          </Fragment>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(GerenciamentoJuridico)
