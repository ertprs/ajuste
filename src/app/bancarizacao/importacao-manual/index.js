import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import FormData from 'form-data'
import React, { Component, Fragment } from 'react'
import Swal from 'sweetalert2'

import TitlePage from '../../../components/title'
import { FilePond } from 'react-filepond'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import CalendarIcon from '@material-ui/icons/CalendarToday'
// import TextField from '@material-ui/core/TextField'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import green from '@material-ui/core/colors/green'
import Snackbar from '../../../components/snackbar'
// import { Grid } from '@material-ui/core'
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

class ImportacaoManualBancarizacao extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      date: '',
      snackbar: {
        open: false,
        variant: '',
        message: ''
      },
      checked: false,
      enviando: false,
      checkedComplementar: false

    }
  }

  sendFilesServer = async (e) => {
    Swal.fire({
      title: 'Continuar?',
      text: 'Deseja realmente importar um novo arquivo ? (Se já existir o antigo será sobreposto)',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar!',
      cancelButtonText: 'Voltar'
    }).then(async (result) => {
      if (result.value) {
        this.setState({ enviando: true })
        e.preventDefault()

        var data = new FormData()
        this.state.files.map(file => data.append(file.name, file))

        try {
          const resultado = await Api.post(`bancarizacao/manual_import/`, data, { headers: {
            'Content-Type': 'multipart/form-data'
          } })

          this.setState({ enviando: false })

          Swal.fire({
            title: resultado.data.title,
            type: resultado.data.type,
            text: resultado.data.message
          })
          this.setState({ files: [], date: '' })
        } catch (error) {
          this.setState({ enviando: false })
          Swal.fire({
            title: 'Aconteu um erro!',
            type: 'error',
            text: 'Erro interno no servidor'
          })
        }
      }
    })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  handleChange () {
    this.setState({
      checked: !this.state.checked
    })
  }

  handleChangeComplementar () {
    this.setState({
      checkedComplementar: !this.state.checkedComplementar
    })
  }

  onChangeInputValue = e => {
    this.setState({ ...this.state.date, date: e.target.value })
  }

  render () {
    const types = ['text/plain']
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Bancarização - Importação Manual'} />
        <main className={classes.layout}>
          <Paper className={classes.paper} elevation={1}>
            {/* <Grid container item xs={3} sm={3}>
              <TextField
                color='primary'
                name='dataVencimento'
                label='Data Vencimento'
                type='date'
                className={classes.textField}
                style={{ marginBottom: '12px' }}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                    </InputAdornment>
                  )
                }}
                value={this.state.date}
                onChange={this.onChangeInputValue}
              />
            </Grid> */}
            <FilePond
              acceptedFileTypes={types}
              labelFileTypeNotAllowed="Esse formato de arquivo não é válido."
              fileValidateTypeLabelExpectedTypes='Esperamos: {allTypes}'
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
            </MuiThemeProvider>
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(styles)(ImportacaoManualBancarizacao)
