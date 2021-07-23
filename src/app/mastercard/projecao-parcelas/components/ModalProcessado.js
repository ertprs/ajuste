import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
// import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
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
    width: '200px'
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

  state = {
    data: null
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

  render () {
    const { open, onClose, classes } = this.props

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Dialog
            fullWidth={'xs'}
            maxWidth={'xs'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Detalhamento do Processamento</DialogTitle>
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
                  onClick={() =>
                    this.props.history.push('/app/processamento-pagamento/conferir-processamento', {
                      dataProcessamento: this.props.dataProcessamento,
                      dataPagamento: this.props.dataPagamento
                    })
                  }
                >
                  Por Conta
                </Button>

                <Button
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    this.props.history.push(
                      '/app/processamento-pagamento/conferir-processamento/carteira',
                      {
                        dataProcessamento: this.props.dataProcessamento,
                        dataPagamento: this.props.dataPagamento
                      }
                    )
                  }
                >
                  Por Carteira
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
