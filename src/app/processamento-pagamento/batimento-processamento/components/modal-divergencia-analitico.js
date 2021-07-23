import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DataTableRetornoAnalitico from './data-table-divergencia-analitico'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import dataHistoricoBatimento from './contributorsBatimento'

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

class ModalBatimentoAnalitico extends React.Component {
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
    this.setState({ dataTable: dataHistoricoBatimento, innerLoading: false })
  }

  render () {
    const { open, onClickCancel, onClose, title } = this.props

    const { dataTable } = this.state
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
              <DataTableRetornoAnalitico data={dataTable} />
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

export default withStyles(styles)(ModalBatimentoAnalitico)
