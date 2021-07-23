import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import FormData from 'form-data'
import React, { Component, Fragment } from 'react'
import TitlePage from '../../../components/title'
import { FilePond } from 'react-filepond'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import 'filepond/dist/filepond.min.css'
import green from '@material-ui/core/colors/green'
import Snackbar from '../../../components/snackbar'
import Api from '../../../services/Api'
import FileSaver from 'file-saver'

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
      <span class="filepond--label-action">Escolha Arquivos</span>.`
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

class Conversao4060 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      snackbar: {
        open: false,
        variant: '',
        message: ''
      },
      checkedXml: false,
      enviando: false,
      checkedExcel: false,
      modalOpen: false,
      data: [],
      download: false
    }
  }

  sendFilesServer = async e => {
    this.setState({ enviando: true })
    e.preventDefault()

    var data = new FormData()

    this.state.files.map(file => data.append(file.name, file))

    try {
      const resultado = await Api.post(`cadoc/conversor_cadoc_4060/`, data, { headers: {
        'Content-Type': 'multipart/form-data'
      } })
      let blob = new Blob([resultado.data['arquivo']], { type: 'application/xml' })
      FileSaver.saveAs(blob, resultado.data['nome_arquivo'])
      this.setState({ enviando: false, files: [] })
    } catch (error) {
      this.setState({
        enviando: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
  }

  download = async e => {
    this.setState({ download: true })
    e.preventDefault()

    try {
      const resultado = await Api.get(`cadoc/file_download/`, { responseType: 'blob' })
      this.setState({ download: false })
      let blob = new Blob([resultado.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      let data = new Date()
      FileSaver.saveAs(blob, `cadoc_${data}.xlsx`)
    } catch (error) {
      console.log(error)
      this.setState({
        enviando: false,
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

  handleChange () {
    this.setState({
      checkedXml: !this.state.checkedXml,
      checkedExcel: false
    })
  }

  handleChangeExcel () {
    this.setState({
      checkedExcel: !this.state.checkedExcel,
      checkedXml: false
    })
  }

  openCloseModal = () => {
    this.setState({ ...this.state, modalOpen: !this.state.modalOpen })
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
        <TitlePage text={'Conversão Cadoc 4060'} />
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            <FilePond
              {...FilePondLanguage}
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple={false}
              maxFiles={1}
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
                disabled={this.state.files.length <= 0 || this.state.enviando}
                variant='contained'
                color='primary'
                style={{ width: '70px', height: '40px' }}
                onClick={this.sendFilesServer}
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

export default withStyles(styles)(Conversao4060)
