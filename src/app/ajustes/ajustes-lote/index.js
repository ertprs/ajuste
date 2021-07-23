import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import FormData from 'form-data'
import React, { Fragment, useState } from 'react'
import TitlePage from '../../../components/title'
import { FilePond, registerPlugin } from 'react-filepond'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import 'filepond/dist/filepond.min.css'
import green from '@material-ui/core/colors/green'
import Snackbar from '../../../components/snackbar'
import Api from '../../../services/Api'
import exportCSVFile from '../../../util/exportCSVFile'
// import Grid from '@material-ui/core/Grid'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import './styles.css'

registerPlugin(FilePondPluginFileValidateType)

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

export default function AjustesLote () {
  const [files, setFiles] = useState([])
  const [snackbar, setSnackbar] = useState({})
  const [sending, setSending] = useState(false)

  const sendFilesServer = async e => {
    setSending(true)
    var data = new FormData()
    const user = JSON.parse(window.localStorage.getItem('user'))
    data.append('departamento', user.departamento)

    files.map(file => data.append('fileUser', file))
    try {
      const result = await Api.post('ajustes/lote/', data)

      if (result.status === 200) {
        setSnackbar({ ...snackbar, open: true, variant: 'success', message: result.data.message })
      }

      if (result.status === 206) {
        setSnackbar({ ...snackbar, open: true, variant: 'warning', message: result.data.message })
        exportCSVFile(result.data.erros, 'Ajustes_com_erro')
      }
      setSending(false)
      setFiles([])
      return result
    } catch (error) {
      console.log(error)
      setSnackbar({ ...snackbar, open: true, variant: 'error', message: error.response.data.message })
      setSending(false)
    }
  }

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      setSnackbar({ ...snackbar, open: false })
    }
    setSnackbar({ ...snackbar, open: false })
  }

  const types = ['text/csv', 'application/vnd.ms-excel']

  return (
    <Fragment>
      <Snackbar
        onClose={onClose}
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
      />
      <TitlePage text={'Ajustes em lote'} />
      <main>
        <div className='fileUser'>
          <Paper className='paperUser' elevation={1}>
            <FilePond
              acceptedFileTypes={types}
              labelFileTypeNotAllowed='Esse formato de arquivo não é válido.'
              fileValidateTypeLabelExpectedTypes='Esperamos: {allTypes}'
              {...FilePondLanguage}
              files={files}
              // allowMultiple
              maxFiles={1}
              onremovefile={() => {
                setFiles([])
              }}
              onupdatefiles={fileItems => {
                // eslint-disable-next-line array-callback-return
                fileItems.map(fileItem => {
                  if (types.includes(fileItem.file.type)) {
                    setFiles(
                      fileItems.map(fileItem => fileItem.file)
                    )
                  }
                })
              }}
            />
            <MuiThemeProvider theme={theme}>
              <Button
                disabled={files.length <= 0}
                variant='contained'
                color='primary'
                style={{ width: '70px', height: '40px' }}
                onClick={() => sendFilesServer()}
              >
                {sending ? <CircularProgress size={25} color='gray' /> : 'Enviar'}
              </Button>
            </MuiThemeProvider>
          </Paper>
        </div>
      </main>
    </Fragment>
  )
}
