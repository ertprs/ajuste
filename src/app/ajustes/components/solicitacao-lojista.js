import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import green from '@material-ui/core/colors/green'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import Api from '../../../services/Api'
import Loading from '../../../components/loading'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import { MdDone } from 'react-icons/md'
import styles from './styles'
import Swal from 'sweetalert2'
import LinearProgress from '@material-ui/core/LinearProgress'
import AutoComplete from './autocomplete'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import CurrencyInput from 'react-currency-input'

const theme = createMuiTheme({
  palette: {
    primary: green,
    marginLeft: 10,
    borderBottomColor: green
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: 'white'
      }
    }
  }
})

export default function SolicitacaoLojista (props) {
  const [inputs, setInputs] = useState({})
  const [tiposAjustes, setTiposAjustes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingInput, setLoadingInput] = useState(false)
  const [loadingInputStore, setLoadingInputStore] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [disableButton, setDisableButton] = useState(false)
  const [adjustmentError, setAdjustmentError] = useState(false)
  const [errorEstablishment, setErrorEstablishment] = useState(false)

  useEffect(() => {
    const getAjustes = async () => {
      try {
        const result = await Api.get('ajustes/tipos_ajustes_lojista/')
        const user = JSON.parse(window.localStorage.getItem('user'))
        setInputs({ ...inputs, email: user.mail, departamento: user.departamento })
        setTiposAjustes(result.data)
      } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
          window.localStorage.clear()
          window.location.reload()
          return null
        }
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel buscar os tipos de ajustes'
        })
      }
    }

    getAjustes()
  }, [])

  function errorHandler () {
    if (inputs.establishmentId === undefined || inputs.establishmentId === null) {
      setErrorEstablishment(true)
      return false
    }

    if (inputs.adjustmentId === undefined || inputs.adjustmentId === null) {
      setAdjustmentError(true)
      return false
    }
    return true
  }

  function adjustmentRequest (e) {
    e.preventDefault()

    if (!errorHandler()) return false

    setAdjustmentError(false)
    setErrorEstablishment(false)
    setAdjustmentError(false)

    Swal.fire({
      title: 'Confirma a ação?',
      text: 'Você não conseguirá reverter essa ação!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, realizar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      try {
        if (result.value) {
          setLoading(true)
          setDisableButton(true)
          const result = await Api.post('ajustes/solicitar_ajuste_lojista/', { ...inputs })
          setLoading(false)
          console.log(result.data)
          Swal.fire({
            title: 'Realizado',
            type: 'success',
            text: 'Operação realizada com sucesso'
          }).then(result => {
            window.location.reload()
          })
        }
      } catch (error) {
        setLoading(false)
        setDisableButton(false)
        console.log(error)
        if (error.response.status === 401) {
          window.localStorage.clear()
          window.location.reload()
          return null
        }
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel realizar o ajuste, verifique os campos preenchidos'
        })
      }
    })
  }

  const getCardStatus = async () => {
    if (inputs.accountId) {
      setLoadingInput(true)
      try {
        const result = await Api.get(`ajustes/status_conta?idConta=${inputs.accountId}`)
        setLoadingInput(false)
        setInputs({ ...inputs, status: result.data.statusConta })
      } catch (error) {
        setLoadingInput(false)
        setInputs({ ...inputs, status: '' })
        return null
      }
      return null
    }
    setInputs({ ...inputs, status: '' })
  }

  const getEstablishmentId = async () => {
    try {
      if (inputs.establishment) {
        setLoadingInputStore(true)
        const result = await Api.get(`ajustes/estabelecimento/${inputs.establishment}`)
        console.log(establishments)
        setEstablishments(result.data)
        setLoadingInputStore(false)
      }
    } catch (error) {
      console.log(error)
      setLoadingInputStore(false)
      setEstablishments([])
      Swal.fire({
        title: 'Error',
        type: 'error',
        text: "Não foi possivel encontrar os ID's Estabelecimentos desse CNPJ, favor verificar·"
      })
    }
  }

  const changeAjuste = e => {
    if (e !== null && e.value !== null) {
      setInputs({ ...inputs, adjustmentId: e.value })
      setAdjustmentError(false)
      return null
    }
    setInputs({ ...inputs, adjustmentId: null })
    setAdjustmentError(true)
  }

  const classes = styles()

  return (
    <>
      { tiposAjustes ? (
        <form onSubmit={e => adjustmentRequest(e)} autoComplete="off">
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
              { loading ? <LinearProgress /> : null }
              <Grid container spacing={24} justify="center">
                <Grid item xs={4}>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='accountId'>ID Conta</InputLabel>
                    <Input
                      id='accountId'
                      type='accountId'
                      name='accountId'
                      value={inputs.accountId}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      onBlur={() => getCardStatus()}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth error={adjustmentError}>
                    <AutoComplete
                      options={tiposAjustes}
                      onChangeInput={e => changeAjuste(e)}
                      idAjuste={inputs.idAjuste}
                    />
                    {adjustmentError && <FormHelperText>Campo obrigatório</FormHelperText>}
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='establishment'>CNPJ</InputLabel>
                    <Input
                      id='establishment'
                      type='number'
                      name='establishment'
                      value={inputs.establishment}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      onBlur={() => getEstablishmentId()}
                    />
                  </FormControl>
                  { loadingInputStore ? <LinearProgress /> : null }
                  {establishments.length > 0 && (
                    <FormControl margin='normal' required fullWidth error={errorEstablishment}>
                      <InputLabel shrink htmlFor='establishmentId'>ID Estabelecimento</InputLabel>
                      <Select
                        id='establishmentId'
                        name='establishmentId'
                        value={inputs.establishmentId}
                        onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      >
                        {establishments.map(item => (
                          <MenuItem active value={item.id}>{item.id}</MenuItem>
                        ))}
                      </Select>
                      {errorEstablishment && <FormHelperText>Campo obrigatório</FormHelperText>}
                    </FormControl>)}
                  <FormControl margin='normal' required>
                    <InputLabel htmlFor="valor">Valor</InputLabel>
                    <Input
                      id="valor"
                      className={classes.textField}
                      name="valor"
                      value={inputs.valor}
                      onChange={e => setInputs({ ...inputs, valor: e })}
                      startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                      inputComponent={CurrencyInput}
                      required={true}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='status'>Status do cartão</InputLabel>
                    <Input
                      id='status'
                      name='status'
                      value={inputs.status ? inputs.status : '' }
                      disabled={true}
                    />
                  </FormControl>
                  { loadingInput ? <LinearProgress /> : null }
                  <FormControl margin='normal' required>
                    <Button disabled={disableButton} variant="contained" type="submit" color="primary" className={classes.button}>
                      <MdDone style={{ marginRight: '5px', fontSize: '20px' }} />
                      Finalizar
                    </Button>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel shrink htmlFor='date'>Data</InputLabel>
                    <Input
                      id="date"
                      label="Data"
                      type="date"
                      name="date"
                      value={inputs.date}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='solicitante'>Solicitante</InputLabel>
                    <Input
                      name='solicitante'
                      id='solicitante'
                      disabled
                      value={inputs.email}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='setor'>Setor</InputLabel>
                    <Input
                      id='setor'
                      required={true}
                      name='setor'
                      placeholder="Digite o setor"
                      value={inputs.departamento}
                      disabled={true}
                    />
                  </FormControl>
                  <FormControl margin='normal' fullWidth>
                    <InputLabel htmlFor='establishment'>Motivo</InputLabel>
                    <Input
                      id='motivo'
                      type='text'
                      name='motivo'
                      value={inputs.motivo}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </Paper>
        </form>
      ) : (
        <Loading />
      )}
    </>
  )
}
