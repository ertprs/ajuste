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
import Api from '../../../../services/Api'
// import Loading from '../../../../components/loading'
// import FilterData from './FilterData'
// import Grid from '@material-ui/core/Grid'
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
    }
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
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <div className={classes.formContent}>
                <TextField
                  color='primary'
                  name='dataInicial'
                  label='Data Agenda Inicial'
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
                  value={this.state.filter.dataInicial}
                  onChange={this.props.onChangeInputValue}
                />
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='email'>Tipo de Transação</InputLabel>
                  <Input
                    id='email'
                    name='email'
                    autoComplete='email'
                    autoFocus
                    onChange={e =>
                      this.setState({
                        email: e.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='password'>Valor Dólar</InputLabel>
                  <Input
                    name='password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    onChange={e =>
                      this.setState({
                        password: e.target.value
                      })
                    }
                  />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='password'>Valor Real</InputLabel>
                  <Input
                    name='password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    onChange={e =>
                      this.setState({
                        password: e.target.value
                      })
                    }
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
                  // className={classes.submit}
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
