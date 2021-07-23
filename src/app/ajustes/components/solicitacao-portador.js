import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
import Moment from 'moment'
import SimpleTable from './simple-table'
import { IoMdAddCircleOutline } from 'react-icons/io'
import ModalRequestError from './modal-retorno-informacoes'

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

export default function SolicitacaoPortador (props) {
  const [inputs, setInputs] = useState({})
  const [idAjusteValido] = useState([5, 9, 4, 28, 8])
  const [tiposAjustes, setTiposAjustes] = useState([])
  const [motivos, setMotivos] = useState([])
  const [setores, setSetores] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingInput, setLoadingInput] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  const [adjustmentError, setAdjustmentError] = useState(false)
  const [motivesErros, setMotivesErros] = useState(false)
  const [setoresErros, setSetoresErros] = useState(false)
  const [addAjuste, setAddAjuste] = useState(false)
  const [ajustes, setAjustes] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [disableInput, setDisableInput] = useState(false)
  const [autocomplete, setAutocomplete] = useState(false)
  const [modalError, setModalError] = useState({ status: false, data: [{ nome: 'felipe' }] })

  useEffect(() => {
    const getAjustes = async () => {
      try {
        const result = await Api.get('ajustes/tipos_ajustes/')
        const user = JSON.parse(window.localStorage.getItem('user'))
        setInputs({ ...inputs, email: user.mail, departamento: user.departamento, date: Moment().format('YYYY-MM-DD') })
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

    const getSetores = async () => {
      const result = await Api.get('ajustes/setores/')
      setSetores(result.data)
    }

    getAjustes()
    getSetores()
  }, [])

  useEffect(() => {
    if (Object.values(inputs).length >= 7) {
      setAddAjuste(true)
    }
  }, [inputs])

  useEffect(() => { setDataTable(ajustes) }, [ajustes])

  const adicionarAjuste = useCallback(() => {
    if (inputs.setor === undefined || inputs.setor === null) {
      setSetoresErros(true)
      return false
    }
    setSetoresErros(false)
    if (!Object.values(inputs).includes(undefined)) {
      setAjustes([...ajustes, { idAjuste: inputs.idAjuste, descAjuste: inputs.descAjuste, valor: inputs.valor, date: inputs.date, idconta: inputs.idconta, motivo: inputs.motivo, setor: inputs.setor }])
      setInputs({ ...inputs, idAjuste: null, valor: null, date: null })
    }
    setDisableInput(true)
    setInputs({ ...inputs, valor: '0.00', date: Moment().format('YYYY-MM-DD'), motivo: '' })
  }, [inputs, ajustes])

  function adjustmentRequest (e) {
    e.preventDefault()

    if (inputs.idAjuste === undefined || inputs.idAjuste === null) {
      setAdjustmentError(true)
      return false
    }
    setAdjustmentError(false)
    if (idAjusteValido.includes(inputs.idAjuste)) {
      if (inputs.motivo === undefined || inputs.motivo === null) {
        setMotivesErros(true)
        return false
      }
      setMotivesErros(false)
    }
    setMotivesErros(false)
    setAdjustmentError(false)

    if (inputs.setor === undefined || inputs.setor === null) {
      setSetoresErros(true)
      return false
    }

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
          setInputs({ ...inputs, ajustes: ajustes })
          const result = await Api.post('ajustes/solicitar_ajuste/', { ...inputs, ajustes: ajustes })
          setLoading(false)
          if (result.status === 206) {
            setDisableButton(false)
            Swal.fire({
              title: 'Erro',
              type: 'error',
              text: 'Alguns ajustes não foram realizados, verificar.'
            }).then(next => {
              setModalError({ ...modalError, status: true, data: result.data.array_error })
            })
            return null
          }
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
    if (inputs.idconta) {
      setLoadingInput(true)
      try {
        const result = await Api.get(`ajustes/status_conta?idConta=${inputs.idconta}`)
        setLoadingInput(false)
        setAutocomplete(true)
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

  const changeAjuste = async (e) => {
    if (e !== null && e.value !== null) {
      if (!idAjusteValido.includes(e.value)) {
        setInputs({ ...inputs, idAjuste: e.value, descAjuste: e.label })
        setAdjustmentError(false)
        return null
      }
      try {
        const result = await Api.get(`ajustes/search_motivos?id_tipo_ajuste=${e.value}`)
        setMotivos(result.data)
        setInputs({ ...inputs, idAjuste: e.value, descAjuste: e.label })
        setAdjustmentError(false)
        return null
      } catch (error) {
        return null
      }
    }
    setInputs({ ...inputs, idAjuste: null })
    setAdjustmentError(true)
  }

  const excluirItem = index => {
    const temp = [...ajustes]
    temp.splice(index, 1)
    setAjustes(temp)
  }

  const classes = styles()

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      setModalError({ ...modalError, status: false })
    }
    setModalError({ ...modalError, status: false })
  }

  const totalAjustes = useMemo(() => ajustes.length, [ajustes])

  return (
    <>
      { tiposAjustes.length > 0 ? (
        <form onSubmit={e => adjustmentRequest(e)} autoComplete="off">
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
              { loading ? <LinearProgress /> : null }
              <ModalRequestError title={'Ajustes com erro'} exclude={false} data={modalError.data} onClose={onClose} open={modalError.status} />
              <Grid container spacing={24} justify="center" style={{ marginLeft: '10px' }}>
                <Grid item xs={4}>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='idconta'>ID Conta</InputLabel>
                    <Input
                      id='idconta'
                      type='number'
                      name='idconta'
                      disabled={disableInput}
                      value={inputs.idConta}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      onBlur={() => getCardStatus()}
                    />
                  </FormControl>
                  {autocomplete ? (
                    <>
                      <FormControl margin='normal' required fullWidth error={adjustmentError}>
                        <AutoComplete
                          options={tiposAjustes}
                          onChangeInput={e => changeAjuste(e)}
                          idAjuste={inputs.idAjuste}
                        />
                        {adjustmentError && <FormHelperText>Campo obrigatório</FormHelperText>}
                      </FormControl>
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
                    </>
                  ) : null}
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='status'>Status do cartão</InputLabel>
                    <Input
                      id='status'
                      name='status'
                      value={inputs.status ? inputs.status : '' }
                      disabled={true}
                    />
                    { loadingInput ? <LinearProgress /> : null }
                  </FormControl>
                  {idAjusteValido.includes(inputs.idAjuste) ? (
                    <FormControl margin='normal' required fullWidth error={motivesErros}>
                      <InputLabel shrink htmlFor='motivo'>Motivo</InputLabel>
                      <Select
                        id='motivo'
                        name='motivo'
                        value={inputs.motivo}
                        onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      >
                        {motivos.map(item => (
                          <MenuItem value={item.motivo}>{item.motivo}</MenuItem>
                        ))}
                      </Select>
                      {motivesErros && <FormHelperText>Campo obrigatório</FormHelperText>}
                    </FormControl>
                  ) : null }
                  <FormControl margin='normal' fullWidth required>
                    <Grid item>
                      <Button disabled={disableButton} variant="contained" type="submit" color="primary" className={classes.button}>
                        <MdDone style={{ marginRight: '5px', fontSize: '20px' }} />
                        Finalizar
                      </Button>
                      {addAjuste ? <IoMdAddCircleOutline onClick={() => adicionarAjuste()} style={classes.addAdjusment}/> : null}
                    </Grid>
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
                      defaultValue={inputs.date}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel shrink htmlFor='solicitante'>Solicitante</InputLabel>
                    <Input
                      name='solicitante'
                      id='solicitante'
                      value={inputs.email}
                      disabled={true}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth error={setoresErros}>
                    <InputLabel shrink htmlFor='motivo'>Setor solicitante</InputLabel>
                    <Select
                      id='setor'
                      name='setor'
                      disabled={disableInput}
                      value={inputs.setor}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    >
                      {setores.map(item => (
                        <MenuItem key={item.setor} value={item.setor}>{item.setor}</MenuItem>
                      ))}
                    </Select>
                    {setoresErros && <FormHelperText>Campo obrigatório</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </Paper>
          { dataTable.length >= 1 ? (
            <Grid item spacing={24} justify="center" style={{ marginTop: '30px' }}>
              <SimpleTable
                textHeader={totalAjustes === 1 ? `Você tem ${totalAjustes} ajuste a ser realizado` : `Você tem ${totalAjustes} ajuste(s) a serem realizados`}
                exclude={true}
                data={dataTable}
                excluirItem={indice => excluirItem(indice)}
              />
            </Grid>
          ) : null}
        </form>
      ) : (
        <Loading />
      )}
    </>
  )
}
