import React, { useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Api from '../../../services/Api'
import Snackbar from '../../../components/snackbar'
import { Grid } from '@material-ui/core'
import exportCSVFile from '../../../util/exportCSVFile'

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  subContent: {
    width: '100%'
  },
  textField: {
    width: '100%'
  }
})

const classes = styles()

export default function FormContabilizacao (props) {
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({})

  async function getReport () {
    try {
      setLoading(true)
      const response = await Api.get(`viagens/accounting_report/?initial_date=${props.initDate}&end_date=${props.endDate}`)
      if (response.data.length === 0) {
        setSnackbar({ ...snackbar, open: true, variant: 'warning', message: 'Nenhum dado encontrado' })
        setLoading(false)
        return
      }

      exportCSVFile(response.data, 'contabilizacao')
      setSnackbar({ ...snackbar, open: true, variant: 'success', message: 'Opção incluida' })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setSnackbar({ ...snackbar, open: true, variant: 'error', message: 'Não foi possivel alterar' })
    }
  }

  function onClose (event, reason) {
    if (reason === 'clickaway') {
      setSnackbar({ ...snackbar, open: false })
    }
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
    { loading ? <LinearProgress /> : null }
    <div className={classes.container}>
      <div className={classes.subContent}>
        <Grid container fullWidth justify='space-between'>
          <Snackbar
            onClose={onClose}
            open={snackbar.open}
            variant={snackbar.variant}
            message={snackbar.message}
          />
          <FormControl margin='normal'>
            <TextField
              color='primary'
              name='initDate'
              label='Data Inicial'
              type='date'
              InputLabelProps={{
                shrink: true
              }}
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                  </InputAdornment>
                )
              }}
              value={props.dataDespesa}
              onChange={props.onChangeInputValue}
            />
          </FormControl>
          <FormControl margin='normal'>
            <TextField
              color='primary'
              name='endDate'
              label='Data Final'
              type='date'
              InputLabelProps={{
                shrink: true
              }}
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                  </InputAdornment>
                )
              }}
              value={props.dataDespesa}
              onChange={props.onChangeInputValue}
            />
          </FormControl>
          <Button
            type='button'
            fullWidth
            variant='contained'
            color='primary'
            onClick={() => getReport()}
            disabled={props.initDate === undefined ||
           props.initDate === '' ||
           props.endDate === undefined ||
           props.endDate === '' || loading === true}
          >
            Gerar
          </Button>
        </Grid>
      </div>
    </div>
    </>
  )
}
