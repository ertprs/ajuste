import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
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
    width: '500px'
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

class AlertDialog extends React.Component {
  componentWillReceiveProps ({ open }) {
    this.setState({ ...this.props, open })
  }

  render () {
    const { open, onClickConfirm, onClickCancel, onClose, classes, title } = this.props
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
              <TextField
                color='primary'
                id='outlined-multiline-flexible'
                label='Tratativa'
                multiline
                rows='5'
                rowsMax='5'
                // value={this.state.multiline}
                // onChange={this.handleChange('multiline')}
                className={classes.textField}
                margin='normal'
                variant='outlined'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickCancel}>Cancelar</Button>
              <Button onClick={onClickConfirm} color='primary' autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default withStyles(styles)(AlertDialog)
