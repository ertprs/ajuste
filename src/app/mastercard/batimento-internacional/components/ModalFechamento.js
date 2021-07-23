import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
// import DataTableTransacoes from './table-transacoes-base-unica'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Api from '../../../../services/Api'
// import Loading from '../../../../components/loading'
// import FilterData from './FilterData'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
import FechamentoData from './FechamentoData'
// import FechamentoDataCompleto from './FechamentoDataCompleto'
import FechamentoForm from './FechamentoForm'
// import classes from '*.module.css'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    width: '100%'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  subContent: {
    width: '70%'
  },
  dialogContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    paddingBottom: 15
  }
})

const theme = createMuiTheme({
  palette: {
    primary: green
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: 'white'
      }
    }
  }
})

class ModalFechamento extends React.Component {
  componentWillReceiveProps ({ open }) {
    this.setState({ ...this.props, open })
  }

  state = {
    data: [],
    snackbar: {
      open: false,
      variant: '',
      message: ''
    },
    filter: {
      dataInicial: '',
      dataFinal: ''
    },
    cotacaoForm: false
  }

  componentWillMount () {
    // this.requestService()
  }

  async requestService () {
    try {
      const response = await Api.get(`transacoes-mastercard-base-unica?data_agenda=${this.props.dataAgenda}`)
      this.setState({ data: response.data })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
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
    exportCSVFile(this.state.data, `relatorio_mastercard_agrupado_transacoes`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  render () {
    const { open, onClickCancel, onClose, title, classes } = this.props
    // const { data } = this.state
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Snackbar
            onClose={this.onClose}
            open={this.state.snackbar.open}
            variant={this.state.snackbar.variant}
            message={this.state.snackbar.message}
          />
          <Dialog
            fullWidth={'sm'}
            maxWidth={'sm'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              {title}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <div className={classes.buttonContent}>
                <Button
                  onClick={onClickCancel}
                  type='submit'
                  // fullWidth
                  size={'small'}
                  variant='contained'
                  color='primary'
                >Período</Button>
                <Button
                  onClick={() => this.setState({ cotacaoForm: !this.state.cotacaoForm })}
                  type='submit'
                  // fullWdth
                  size={'small'}
                  variant='contained'
                  color='primary'
                >Informar Cotação</Button>
              </div>
              <div className={classes.subContent}>
                {!this.state.cotacaoForm ? <FechamentoData /> : null}
                {this.state.cotacaoForm ? <FechamentoForm filter={this.state.filter}/> : null}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickCancel}>Fechar</Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withStyles(styles)(ModalFechamento)
