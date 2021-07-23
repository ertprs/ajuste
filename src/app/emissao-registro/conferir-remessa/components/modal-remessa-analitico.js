import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DataTableRemessaAnalitico from './data-table-remessa-analitico'
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

  state = {
    data: null
  }

  componentWillMount () {
    this.requestService()
  }

  requestService () {
    const data = {
      id_portador_import: this.props.idPortadorImport,
      contas: [this.props.conta]
    }

    fetch(`${process.env.REACT_APP_API_URL}/emissao-registro/load-grid-remessa-faturamento-analitico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(data => data.json())
      .then(data => {
        this.setState({ data })
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

  render () {
    const { open, onClickCancel, onClose, title } = this.props

    const { data } = this.state
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
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
              <DataTableRemessaAnalitico data={data} />
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

export default withStyles(styles)(AlertDialog)
