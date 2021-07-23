import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
// import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Api from '../../../../services/Api'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '../../../../components/snackbar'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '200px'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  cellRowStyle: {
    padding: 8
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

class AlertDialog extends React.Component {
  componentWillReceiveProps ({ open }) {
    this.setState({ ...this.props, open })
  }

  state = {
    data: null,
    innerLoad: false,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    }
  }

  openCloseExpand (cedente) {
    let { open } = this.state
    if (open.includes(cedente)) {
      open = open.filter(row => row !== cedente)
    } else {
      open.push(cedente)
    }
    this.setState({ open })
  }

  gerarRemessa = async () => {
    this.setState({ innerLoadGerar: true })
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const resultado = await Api.post(`syspag/gerar_remessa_com_divergencia/`,
        { dt_arquivo: this.props.dtArquivoSelected, email: user.mail })
      if (resultado.data.error) {
        this.setState({
          innerLoadGerar: false,
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro ao gerar remessa'
          }
        })
        return null
      }
      this.setState({
        innerLoadGerar: false
      })
      this.props.showSnackBar(true, 'success', 'Remessa gerado')
      this.props.onClose()
    } catch (error) {
      console.log(error)
      this.setState({
        innerLoadGerar: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro ao gerar remessa'
        }
      })
    }
  }

  reprocessarRemessa = async () => {
    this.setState({ innerLoadRepro: true })
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const resultado = await Api.post(`syspag/reprocessar_remessa/`,
        { dt_arquivo: this.props.dtArquivoSelected, email: user.mail })
      if (resultado.data.error) {
        this.setState({
          innerLoadRepro: false,
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro ao reprocessar remessa'
          }
        })
        return null
      }
      this.setState({
        innerLoadRepro: false
      })
      this.props.showSnackBar(true, 'success', 'Remessa reprocessado')
      this.props.onClose()
    } catch (error) {
      console.log(error)
      this.setState({
        innerLoadRepro: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro ao reprocessar remessa'
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
    const { open, onClose, classes } = this.props

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
            fullWidth={'xs'}
            maxWidth={'xs'}
            open={open}
            onClose={onClose}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title' style={{ textAlign: 'center' }}>Ações para o Remessa</DialogTitle>
            <DialogContent>
              <Grid
                className={classes.grid}
                container
                direction='row'
                justify='space-around'
                alignItems='center'
              >
                <Button
                  className={classes.cellRowStyle}
                  align='left'
                  variant='contained'
                  color='primary'
                  onClick={this.gerarRemessa}
                  disabled={this.state.innerLoadGerar || this.state.innerLoadRepro}
                >
                  {this.state.innerLoadGerar && <CircularProgress size={24} color='primary' className={classes.buttonProgress}/>}
                  Gerar
                </Button>

                <Button
                  className={classes.cellRowStyle}
                  variant='contained'
                  color='primary'
                  onClick={this.reprocessarRemessa}
                  disabled={this.state.innerLoadGerar || this.state.innerLoadRepro}
                >
                  {this.state.innerLoadRepro && <CircularProgress size={24} color='primary' className={classes.buttonProgress}/>}
                  Reprocessar
                </Button>

                <Button
                  className={classes.cellRowStyle}
                  color='default'
                  onClick={this.props.onClose}
                  disabled={this.state.innerLoadGerar || this.state.innerLoadRepro}
                >
                  Fechar
                </Button>
              </Grid>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withStyles(styles)(AlertDialog)
