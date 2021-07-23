import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import CalendarIcon from '@material-ui/icons/CalendarToday'
// import DataTableTransacoes from './table-transacoes-base-unica'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
// import Loading from '../../../../components/loading'
// import FilterData from './FilterData'
// import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
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
  formContent: {
    width: '50%'
  },
  dialogContent: {
    display: 'flex',
    justifyContent: 'center'
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

class ModalTransacao extends React.Component {
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
    dataPeriodo: '',
    tipoTransacao: 1,
    valorReal: '',
    valorDolar: ''
  }

  componentWillMount () {
    // this.requestService()
  }

  onChangeInputValue = e => {
    this.setState({ [e.target.name]: e.target.value === 'undefined' ? '' : e.target.value })
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

  enviarTransacao = () => {
    const { dataPeriodo, valorDolar, valorReal } = this.state
    fetch(
      `${process.env.REACT_APP_API_URL}/api/deposito-mastercard/`,
      {
        method: 'POST',
        body: JSON.stringify({
          'data': dataPeriodo,
          'vl_dolar': valorDolar,
          'vl_real': valorReal
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(data => data.json())
      .then(data => {
        this.setState({
          open: false,
          snackbar: {
            open: true,
            variant: 'success',
            message: 'Transação salva com sucesso'
          },
          dataPeriodo: '',
          valorDolar: '',
          valorReal: ''
        })
      })
      .catch(() => {
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro no servidor'
          }
        })
      })
  }

  verifyForm = () => {
    const { dataPeriodo, valorDolar, valorReal } = this.state
    if (dataPeriodo === '' || valorDolar === '' || valorReal === '') {
      return true
    }
    return false
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
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <div className={classes.formContent}>
                <TextField
                  color='primary'
                  name='dataPeriodo'
                  label='Data Agenda'
                  type='date'
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                      </InputAdornment>
                    )
                  }}
                  value={this.state.dataPeriodo}
                  onChange={this.onChangeInputValue}
                />
                <TextField
                  id="tipoTranscao"
                  name='tipoTranscao'
                  select
                  label="Tipo de Transação"
                  className={classes.textField}
                  value={this.state.tipoTransacao}
                  onChange={this.onChangeInputValue}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  <MenuItem value={1}>
                    DEPÓSITO
                  </MenuItem>
                </TextField>
                <FormControl margin='normal' fullWidth>
                  <InputLabel htmlFor='valorDolar'>Valor Dólar</InputLabel>
                  <Input
                    name='valorDolar'
                    type='number'
                    id='valorDolar'
                    value={this.state.valorDolar}
                    onChange={this.onChangeInputValue}
                  />
                </FormControl>
                <FormControl margin='normal' fullWidth>
                  <InputLabel htmlFor='valorReal'>Valor Real</InputLabel>
                  <Input
                    name='valorReal'
                    type='number'
                    id='valorReal'
                    value={this.state.valorReal}
                    onChange={this.onChangeInputValue}
                  />
                </FormControl>
                <span
                  style={{
                    color: 'red',
                    display: 'flex',
                    alignContent: 'center'
                  }}
                >
                  {/* {status} */}
                </span>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={this.enviarTransacao}
                  disabled={this.verifyForm()}
                >
                  Incluir
                </Button>
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

export default withStyles(styles)(ModalTransacao)
