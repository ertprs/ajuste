import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
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

class ModalTratativa extends React.Component {
  state = {
    tratativa: null
  }

  componentWillReceiveProps ({ open }) {
    this.setState({ ...this.props, open })
  }

  componentWillMount () {
    this.loadTratativa()
  }

  loadTratativa () {
    const data = {
      id_portador_import: this.props.idPortadorImport,
      conta: this.props.conta
    }

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/emissao-registro/load-tratativa-remessa-faturamento-sintetico`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    )
      .then(data => data.json())
      .then(data => {
        this.setState({ tratativa: data.TRATATIVA })
      })
      .catch(() =>
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro no servidor'
          }
        })
      )
  }

  updateTratativa () {
    const data = {
      id_portador_import: this.props.idPortadorImport,
      conta: this.props.conta,
      tratativa: this.state.tratativa
    }

    fetch(
      `${
        process.env.REACT_APP_API_URL
      }/emissao-registro/update_tratativa_remessaxfaturamento_sintetico`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    )
      .then(data => data.json())
      .then(data => {
        this.setState({ tratativa: data.TRATATIVA })
      })
      .catch(() =>
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro no servidor'
          }
        })
      )
  }

  onClickConfirm () {
    this.updateTratativa()
    this.props.onClickConfirm()
  }

  render () {
    const { open, onClickCancel, onClose, classes } = this.props
    const { tratativa } = this.state
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Dialog
            fullWidth={'md'}
            maxWidth={'md'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <TextField
                color='primary'
                id='outlined-multiline-flexible'
                label='Tratativa'
                multiline
                rows='10'
                rowsMax='20'
                value={tratativa === null ? '' : tratativa}
                onChange={e =>
                  this.setState({
                    tratativa: e.target.value
                  })
                }
                className={classes.textField}
                margin='normal'
                variant='outlined'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickCancel}>Cancelar</Button>
              <Button onClick={() => this.onClickConfirm()} color='primary' autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withStyles(styles)(ModalTratativa)
