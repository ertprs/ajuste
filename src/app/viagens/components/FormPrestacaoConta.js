import React, { useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Api from '../../../services/Api'
import Snackbar from '../../../components/snackbar'

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

export default function FormPrestacaoConta (props) {
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({})

  async function incluirTratativa (e) {
    e.preventDefault()
    try {
      setLoading(true)
      const user = JSON.parse(window.localStorage.getItem('user'))
      const response = await Api.put(`viagens/update_request/${props.idHistorico}/`, {
        despesa: props.despesa,
        data_despesa: props.dataDespesa,
        tratativa: props.tratativa,
        data_tratativa: props.dataTratativa,
        atualizado_por: user.mail
      })
      if (response.status === 200) {
        setSnackbar({ ...snackbar, open: true, variant: 'success', message: 'Opção incluida' })
      }
      setLoading(false)
      props.requestData({ ...props.filterData })
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

  console.log(props)

  return (
    <>
    { loading ? <LinearProgress /> : null }
    <div className={classes.container}>
      <div className={classes.subContent}>
        <form onSubmit={e => incluirTratativa(e)}>

          <Snackbar
            onClose={onClose}
            open={snackbar.open}
            variant={snackbar.variant}
            message={snackbar.message}
          />
          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor='despesa'>Valor Despesa</InputLabel>
            <Input
              id='despesa'
              name='despesa'
              type='number'
              required
              value={props.despesa}
              onChange={props.onChangeInputValue}
              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            />
          </FormControl>
          <FormControl required={props.despesa !== '0' && props.despesa !== 0} margin='normal' fullWidth>
            <TextField
              color='primary'
              name='data_despesa'
              label='Data Despesa'
              type='date'
              required={props.despesa !== '0' && props.despesa !== 0}
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
          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor='tratativa'>Tratativa</InputLabel>
            <Input
              id='tratativa'
              name='tratativa'
              type='number'
              required
              value={props.tratativa}
              onChange={props.onChangeInputValue}
              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            />
          </FormControl>
          <FormControl required={props.tratativa !== '0' && props.tratativa !== 0}
            margin='normal' fullWidth>
            <TextField
              color='primary'
              name='data_tratativa'
              label='Data Tratativa'
              required={props.tratativa !== '0' && props.tratativa !== 0}
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
              value={props.dataTratativa}
              onChange={props.onChangeInputValue}
            />
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={props.dataDespesa === undefined || props.despesa === undefined || props.dataTratativa === undefined || props.tratativa === undefined || loading}
          >
            Incluir
          </Button>
        </form>
      </div>
    </div>
    </>
  )
}
