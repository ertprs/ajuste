import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
// import DataTableTransacoes from './table-transacoes-base-unica'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Api from '../../../../services/Api'
// import Loading from '../../../../components/loading'
// import FilterData from './FilterData'
// import Grid from '@material-ui/core/Grid'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
// import classes from '*.module.css'
import DataTableHistorico from './data-table-transacoes'

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
    innerLoading: false,
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

  componentDidMount () {
    this.requestService()
  }

  async requestService () {
    this.setState({ innerLoading: true })
    try {
      const response = await Api.get(`mastercard-garantias/get_sum_liquidacoes`)
      if (response.data) {
        this.setState({ data: response.data, innerLoading: false })
      }
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
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
    const { open, onClickCancel, onClose, classes } = this.props
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
            fullWidth={'lg'}
            maxWidth={'lg'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>Batimento conta garantida</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <DataTableHistorico
                innerLoading={this.state.innerLoading}
                data={this.state.data}
                history={this.props.history}
                isComplete={this.state.isComplete}
              />
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
