import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import FormData from 'form-data'
import React, { Component, Fragment } from 'react'
import TitlePage from '../../../components/title'
import { FilePond } from 'react-filepond'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CircularProgress from '@material-ui/core/CircularProgress'
import ModalRetornoBC from '../components/ModalRetornoBC'
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
  labelIdle: `Arraste e solte arquivos aqui ou
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

class ImportFile extends Component {
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
    data.append('flagImportarXml', this.state.checkedXml)
    data.append('flagImportarExcel', this.state.checkedExcel)

    this.state.files.map(file => data.append(file.name, file))

    try {
      if (this.state.checkedExcel) {
        const resultado = await Api.post(`cadoc/processamento_cadoc_manual/`, data, { headers: {
          'Content-Type': 'multipart/form-data'
        } })
        this.setState({ enviando: false, files: [], checkedExcel: false, checkedXml: false, modalOpen: true, data: resultado.data })
      } else {
        const resultado = await Api.post(`cadoc/processamento_cadoc_manual_xml/`, data, { headers: {
          'Content-Type': 'multipart/form-data'
        } })
        this.setState({ enviando: false, files: [], checkedExcel: false, checkedXml: false, modalOpen: false, dataXml: resultado.data })
      }
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
        <TitlePage text={'Importação Manual do CADOC'} />
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checkedXml}
                  onChange={() => this.handleChange()}
                  value='checkedB'
                  color='secondary'
                />
              }
              label='Importar XML'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checkedExcel}
                  onChange={() => this.handleChangeExcel()}
                  value='checkedB'
                  color='secondary'
                />
              }
              label='Importar Excel'
            />
            <FilePond
              {...FilePondLanguage}
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple
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
                disabled={this.state.files.length <= 0}
                variant='contained'
                color='primary'
                style={{ width: '70px', height: '40px' }}
                onClick={!this.state.enviando && this.sendFilesServer}
              >
                {this.state.enviando ? <CircularProgress size={25} color='gray' /> : 'Enviar'}
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ marginLeft: 5, width: '250px', height: '40px' }}
                onClick={!this.state.download && this.download}
              >
                {this.state.download ? <CircularProgress size={25} color='gray' /> : 'Baixar cadoc em excel'}
              </Button>
              { (this.state.modalOpen && this.state.data) ? (
                <ModalRetornoBC
                  open={this.state.modalOpen}
                  title={'Arquivo BC'}
                  onClickCancel={() => this.openCloseModal()}
                  arquivoBC={this.state.data}
                />) : null}
            </MuiThemeProvider>
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(styles)(ImportFile)
