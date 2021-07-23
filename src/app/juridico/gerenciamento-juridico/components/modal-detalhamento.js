import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DataTableDetalhamento from './table-detalhamento'
import DataTableProduto from './table-produto'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
// import Api from '../../../../services/Api'
// import Loading from '../../../../components/loading'
import DescriptionIcon from '@material-ui/icons/Description'
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
  },
  grid: {
    paddingTop: theme.spacing.unit * 2,
    marginRight: 10
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

class ModalDetalhamento extends React.Component {
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
      // const response = await Api.get(``)
      this.setState({ data: [] })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Ocorreu um erro no servidor'
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
    exportCSVFile(this.props.data, `relatorio`, [])
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  render () {
    const { open, onClickCancel, onClose, title, classes, data } = this.props

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
            maxWidth={'md'}
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
              <Fragment>
                <Grid container direction='row' justify='flex-end' alignItems='baseline'>
                  <Grid className={classes.grid} container item xs={6} sm={12} spacing={16}>
                    <Button
                      onClick={() => this.gerarRelatorio()}
                      variant='contained'
                      disabled={data.length === 0}
                      color='primary'
                      className={classes.submit}
                    >
                      <DescriptionIcon />
                      Gerar Relatório
                    </Button>
                  </Grid>
                </Grid>
                {this.props.isProduto ? (
                  <DataTableProduto
                    data={data}
                  />)
                  : <DataTableDetalhamento
                    data={data}
                  />}
              </Fragment>
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

export default withStyles(styles)(ModalDetalhamento)
