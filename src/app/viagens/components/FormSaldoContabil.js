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

export default function FormSaldoContabil (props) {
  const [inputs, setInputs] = useState({})
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({})

  async function getReport () {
    try {
      setLoading(true)
      const response = await Api.get(`viagens/accounting_beat/?initial_date=${inputs.initDate}&end_date=${inputs.endDate}`)

      if (response.data.length === 0) {
        setSnackbar({ ...snackbar, open: true, variant: 'warning', message: 'Nenhum dado encontrado' })
        setLoading(false)
        return null
      }

      setLoading(false)
      setInputs({ ...inputs, ...response.data })
    } catch (error) {
      console.log(error)
      setLoading(false)
      setSnackbar({ ...snackbar, open: true, variant: 'error', message: 'Erro interno' })
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
              value={inputs.initDate}
              onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
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
              value={inputs.endDate}
              onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
            />
          </FormControl>
        </Grid>
        <Grid item justify='center' alignItems='center' xs={6}>
          <FormControl fullWidth margin='normal'>
            <TextField
              color='primary'
              label='Adiantamentos Realizados'
              value={inputs.adiantamentos}
              InputLabelProps={{
                shrink: true
              }}
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    R$
                  </InputAdornment>
                )
              }}
              disabled
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <TextField
              color='primary'
              label='Prestação de contas'
              value={inputs.despesas}
              InputLabelProps={{
                shrink: true
              }}
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    R$
                  </InputAdornment>
                )
              }}
              disabled
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <TextField
              color='primary'
              label='Saldo'
              type='input'
              value={inputs.adiantamentos !== undefined && inputs.despesas !== undefined
                ? parseFloat(inputs.adiantamentos) - parseFloat(inputs.despesas) : 0}
              InputLabelProps={{
                shrink: true
              }}
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    R$
                  </InputAdornment>
                )
              }}
              disabled
            />
          </FormControl>
        </Grid>
        <Button
          type='button'
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => getReport()}
          disabled={inputs.initDate === undefined ||
           inputs.initDate === '' ||
           inputs.endDate === undefined ||
           inputs.endDate === '' || loading === true}
        >
          Pesquisar
        </Button>
      </div>
    </div>
    </>
  )
}
