import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Api from '../../../../services/Api'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
import FechamentoForm from './FechamentoForm'

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

class ModalCotacao extends React.Component {
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
    dataPeriodo: '',
    cotacaoForm: false,
    taxaCambio: ''
  }

  onChangeInputValue = e => {
    this.setState({
      [e.target.name]: e.target.value === 'undefined' ? '' : e.target.value
    })
  }

  componentWillMount () {

  }

  async requestService () {
    if (this.props.data === null) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Data inicial e data final não selecionados'
        }
      })
      return
    }
    let params = {
      totalDolar: this.totalDolar(this.props.data),
      totalReal: this.totalReal(this.props.data),
      taxaCambio: this.state.taxaCambio,
      dataPeriodo: this.state.dataPeriodo
    }
    try {
      const resultado = await Api.post(`mastercard-internacional/get_fechamento_cotacao/`, params)
      this.props.changeIsComplete({ variacao: resultado.data['variacao'], taxaCambio: this.state.taxaCambio })
      this.props.onClickCancel()
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
    // fetch(
    //   `${process.env.REACT_APP_API_URL}/api/mastercard-internacional/get_fechamento_cotacao/`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(params),
    //     headers: { 'Content-Type': 'application/json' }
    //   }
    // )
    //   .then(data => data.json())
    //   .then(data => {
    //     this.props.changeIsComplete({ variacao: data['variacao'], taxaCambio: this.state.taxaCambio })
    //     this.props.onClickCancel()
    //   })
    //   .catch(() => {
    //     this.setState({
    //       snackbar: {
    //         open: true,
    //         variant: 'error',
    //         message: 'Erro no servidor'
    //       }
    //     })
    //   })
  }

  handleClick = () => {
    this.setState({ 'data': [] })
    this.requestService()
    this.getSaldoAcumulado()
    this.getProjecaoPorMes()
  }

  gerarRelatorio = () => {
    exportCSVFile(this.state.table ? this.state.dataMonth : this.state.data, `relatorio_mastercard`, [])
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

  totalDolar = (data) => {
    return data['liquidacao_dolar'] + data['deposito_dolar'] + data['anterior_dolar'] + data['credito_dolar']
  }

  totalReal = (data) => {
    return data['liquidacao_real'] + data['deposito_real'] + data['anterior_real'] + data['credito_real']
  }

  render () {
    const { open, onClickCancel, onClose, title, classes } = this.props
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
              <div className={classes.subContent}>
                <FechamentoForm
                  dataPeriodo={this.state.dataPeriodo}
                  taxaCambio={this.state.taxaCambio}
                  onClick={ () => this.requestService() }
                  onChangeInputValue={this.onChangeInputValue}/>
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

export default withStyles(styles)(ModalCotacao)
