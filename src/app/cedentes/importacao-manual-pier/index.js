import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import FormData from 'form-data'
import React, { Component, Fragment } from 'react'
import Swal from 'sweetalert2'
import TitlePage from '../../../components/title'
import { FilePond } from 'react-filepond'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import green from '@material-ui/core/colors/green'
import Snackbar from '../../../components/snackbar'

import exportCSVFile from '../../../util/exportCSVFile'
import Api from '../../../services/Api'

const styles = theme => ({
  layout: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      width: 960,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 10
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 12,
    marginBottom: theme.spacing.unit * 10,

    padding: theme.spacing.unit * 1,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 8,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 2
    }
  }
})

export const FilePondLanguage = {
  labelIdle: `Arraste e solte o arquivo aqui ou
      <span class="filepond--label-action">Escolha Arquivo</span>.`
}

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

class ImportacaoManualCedente extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      snackbar: {
        open: false,
        variant: '',
        message: ''
      },
      checked: false,
      enviando: false,
      checkedComplementar: false,
      dataRetorno: []
    }
  }

  sendFilesServer = async (e) => {
    this.setState({ enviando: true })
    e.preventDefault()

    var data = new FormData()

    this.state.files.map(file => data.append(file.name, file))

    try {
      const resultado = await Api.post(`cedente/update_file/`, data, { headers: {
        'Content-Type': 'multipart/form-data'
      } })
      exportCSVFile(resultado.data, `linhas_nao_enviadas`, [])
      // this.gerarRelatorio(resultado.data['nome_arquivo'].replace('.csv', ''), resultado.data['data'])
      this.setState({
        dataRetorno: resultado.data,
        enviando: false
      })
      if ('arquivos_rm' in resultado.data) {
        Swal.fire({
          title: 'Arquivo importado com sucesso',
          type: 'success',
          text: resultado.data.arquivos_rm
        })
      } else {
        Swal.fire({
          title: 'Arquivo importado com sucesso',
          type: 'success',
          text: resultado.data.arquivo
        })
      }
    } catch (error) {
      if ('arquivos_rm' in error.response.data) {
        Swal.fire({
          title: error.response.data.message,
          type: 'error',
          text: 'Arquivos passados: ' + error.response.data.arquivos_rm + ' | Arquivo com erro: ' + error.response.data.arquivo
        })
      } else {
        Swal.fire({
          title: error.response.data.message,
          type: 'error',
          text: error.response.data.arquivo
        })
      }
      this.setState({ enviando: false })
    }
  }

  gerarRelatorio = (nomeArquivo, data) => {
    exportCSVFile(data, nomeArquivo, [])
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Importação Manual'} />
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            <FilePond
              {...FilePondLanguage}
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple
              maxFiles={5}
              onupdatefiles={fileItems => {
                this.setState({
                  files: fileItems.map(fileItem => fileItem.file),
                  options: {
                    type: 'local'
                  }
                })
              }}
            />

            <MuiThemeProvider theme={theme}>
              <Button
                disabled={this.state.files.length <= 0}
                variant='contained'
                color='primary'
                style={{ width: '70px', height: '40px' }}
                onClick={!this.state.enviando && this.sendFilesServer}
              >
                {this.state.enviando ? <CircularProgress size={25} color='gray' /> : 'Enviar'}
              </Button>
            </MuiThemeProvider>
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(styles)(ImportacaoManualCedente)
