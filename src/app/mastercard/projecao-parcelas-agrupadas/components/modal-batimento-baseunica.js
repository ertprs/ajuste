import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DataTableTransacoes from './table-transacoes-base-unica'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Api from '../../../../services/Api'
import Loading from '../../../../components/loading'
import FilterData from './FilterData'
import Grid from '@material-ui/core/Grid'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'

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

class ModalBatimentoBaseUnica extends React.Component {
  componentWillReceiveProps ({ open }) {
    this.setState({ ...this.props, open })
  }

  state = {
    data: [],
    snackbar: {
      open: false,
      variant: '',
      message: ''
    }
  }

  componentWillMount () {
    this.requestService()
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
    const { open, onClickCancel, onClose, title } = this.props

    const { data } = this.state
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
            fullWidth={'md'}
            maxWidth={'md'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
              { data.length > 0 ? (
                <Fragment>
                  <Grid container direction='row' justify='flex-end' alignItems='baseline'>
                    <FilterData gerarRelatorio={() => this.gerarRelatorio()} />
                  </Grid>
                  <DataTableTransacoes
                    dataHead={Object.keys(this.state.data[0])}
                    data={data}
                  />
                </Fragment>
              ) : (
                <Loading />
              )}
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

export default withStyles(styles)(ModalBatimentoBaseUnica)
