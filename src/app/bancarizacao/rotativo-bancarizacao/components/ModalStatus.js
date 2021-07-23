import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import { IoIosCheckmarkCircleOutline, IoIosWarning } from 'react-icons/io'
import Api from '../../../../services/Api'
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
  }
})

// const customIcon = {
//   'marginLeft': '10px'
// }

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
    loading: false,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    }
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
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

  salvarValidacao = async validacao => {
    try {
      this.setState({ loading: true })

      await Api.put('bancarizacao/alterar_status_parcelado/', {
        'nome_arquivo': this.props.arquivoBatimento,
        'status': validacao
      })
      this.setState({
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Operação realizada'
        },
        loading: false
      })
      this.props.requestService({ ...this.props.date })
      return
    } catch (error) {
      console.log(error)
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro ao realizar a operação'
        },
        loading: false
      })
    }
  }

  render () {
    const { open, onClose, classes } = this.props

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Dialog
            fullWidth={'sm'}
            maxWidth={'sm'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            {this.state.loading && <LinearProgress />}
            <DialogTitle id='alert-dialog-title'>{this.props.title}</DialogTitle>
            <DialogContent>
              <Grid
                className={classes.grid}
                container
                direction='row'
                justify='space-around'
                alignItems='center'
              >
                <Snackbar
                  onClose={this.onClose}
                  open={this.state.snackbar.open}
                  variant={this.state.snackbar.variant}
                  message={this.state.snackbar.message}
                />
                <Button
                  variant='contained'
                  color='primary'
                  style={ { 'backgroundColor': '#ffc107' } }
                  onClick={() => this.salvarValidacao(1)}
                >
                  <IoIosWarning size={25} />
                  Em Bancarização
                </Button>
                <Button
                  className={classes.cellRowStyle}
                  align='left'
                  variant='contained'
                  color='primary'
                  onClick={() => this.salvarValidacao(2)}
                >
                  <IoIosCheckmarkCircleOutline size={25} />
                  Bancarizado
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
