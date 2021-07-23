import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import green from '@material-ui/core/colors/green'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import SelectReact from 'react-select'
import Api from '../../../../services/Api'
import Loading from '../../../../components/loading'
import Button from '@material-ui/core/Button'
import { MdDone } from 'react-icons/md'
import styles from './styles'
import Swal from 'sweetalert2'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import CurrencyInput from 'react-currency-input'
import InputAdornment from '@material-ui/core/InputAdornment'
// import Autocomplete from '../Autocomple'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import './style.css'
import moment from 'moment'

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

export default function SolicitacaoAdiantamento (props) {
  const [inputs, setInputs] = useState({})
  const [errorAdvance, setErrorAdvance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorLocation, setErroLocation] = useState(false)
  const [errorResult, setErrorResult] = useState(false)
  const [date, setDate] = useState([ new Date(), new Date() ])
  const [locations, setLocations] = useState([])

  const includeTravel = async e => {
    e.preventDefault()

    if (inputs.location === undefined) {
      setErroLocation(true)
      return null
    }

    if (inputs.result === undefined) {
      setErrorResult(true)
      return null
    }

    if (inputs.advance === undefined) {
      setErrorAdvance(true)
      return null
    }

    setErroLocation(false)
    setErrorResult(false)

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
          const user = JSON.parse(localStorage.getItem('user'))
          setLoading(true)
          const response = await Api.post('viagens/save_request/', { ...inputs,
            date: [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')],
            user: user.mail })
          if (response.status === 200) {
            setLoading(false)
            Swal.fire({
              title: 'Incluido',
              type: 'success',
              text: 'Opção incluida com sucesso'
            }).then(action => {
              window.location.reload()
            })
          }
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel incluir adiantamento, verificar campos preenchidos'
        })
      }
    })
  }

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await Api.get('viagens/locations/')
        setLocations(response.data)
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Error',
          type: 'error',
          text: 'Não foi possivel buscar as locações'
        })
      }
    }
    getLocations()
  }, [])

  const classes = styles()

  return (
    <>
      <form onSubmit={e => includeTravel(e)} autoComplete="off">
        { locations.length ? (
          <Paper className={classes.paper}>
            <MuiThemeProvider theme={theme}>
              { loading ? <LinearProgress /> : null }
              <Grid container spacing={24} justify="center" >
                <Grid item xs={3}>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='name'>Nome</InputLabel>
                    <Input
                      id='name'
                      type='name'
                      name='name'
                      value={inputs.name}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    />
                  </FormControl>
                  <FormControl margin='normal' required fullWidth error={errorAdvance}>
                    <InputLabel shrink htmlFor='advance'>Adiantamento ?</InputLabel>
                    <Select
                      id='advance'
                      name='advance'
                      value={inputs.advance}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={true}>Sim</MenuItem>
                      <MenuItem value={false}>Não</MenuItem>
                    </Select>
                    {errorAdvance && <FormHelperText>Campo obrigatório</FormHelperText>}
                  </FormControl>
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='origin'>Origem</InputLabel>
                    <Input
                      id='origin'
                      name='origin'
                      value={inputs.origin}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    />
                  </FormControl>
                </Grid>
                <Grid container item xs={3} direction='column' justify='space-between' alignItems='center' >
                  <FormControl margin='normal' required fullWidth error={errorLocation}>
                    <SelectReact
                      options={locations}
                      name='location'
                      placeholder='Selecione a lotação'
                      // value={inputs.location}
                      onChange={e => setInputs({ ...inputs, location: e.value })}
                      noOptionsMessage={() => 'Opção não encontrada'}
                    />
                    {/* <Select
                      id='location'
                      name='location'
                      value={inputs.location}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    >
                      {locations.map(itemLocation => (
                        <MenuItem key={itemLocation.id} value={itemLocation.codigo}>{itemLocation.descricao}</MenuItem>
                      ))}
                    </Select> */}
                    {errorLocation && <FormHelperText>Campo obrigatório</FormHelperText>}
                  </FormControl>
                  {inputs.advance ? (
                    <FormControl margin='normal' required fullWidth>
                      <InputLabel shrink htmlFor='dateAdvance'>Data adiantamento</InputLabel>
                      <Input
                        id='dateAdvance'
                        name='dateAdvance'
                        type="date"
                        value={inputs.dateAdvance}
                        onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                      />
                    </FormControl>
                  ) : null}
                  <FormControl margin='normal' required fullWidth>
                    <InputLabel htmlFor='destiny'>Destino</InputLabel>
                    <Input
                      id='destiny'
                      name='destiny'
                      value={inputs.destiny}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    />
                  </FormControl>
                </Grid>
                <Grid container item xs={3} direction='column' justify='space-between' alignItems='center'>
                  <FormControl margin='normal' required fullWidth error={errorResult}>
                    <InputLabel shrink htmlFor='result'>Resultado</InputLabel>
                    <Select
                      id='result'
                      name='result'
                      value={inputs.result}
                      onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                    >
                      <MenuItem value={'CUSTOS'}>Custos</MenuItem>
                      <MenuItem value={'DESPESAS'}>Despesas</MenuItem>
                    </Select>
                    {errorResult && <FormHelperText>Campo obrigatório</FormHelperText>}
                  </FormControl>
                  {inputs.advance ? (
                    <FormControl margin='normal' required fullWidth error={errorLocation}>
                      <InputLabel shrink htmlFor='advanceValue'>Valor adiantamento</InputLabel>
                      <Input
                        id='advanceValue'
                        name='advanceValue'
                        value={inputs.advanceValue}
                        inputComponent={CurrencyInput}
                        startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                        onChange={e => setInputs({ ...inputs, advanceValue: e })}
                      />
                    </FormControl>
                  ) : null}
                  <FormControl margin='normal' required fullWidth>
                    <p style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '14px', marginBottom: '4px' }} >Periodo</p>
                    <DateRangePicker
                      id='period'
                      placeholder="dd"
                      monthPlaceholder="mm"
                      dayPlaceholder="dd"
                      yearPlaceholder="yyyy"
                      required
                      locale="pt-BR"
                      name='period'
                      value={date}
                      format='dd-MM-y'
                      // onChange={date => setInputs({ ...inputs, date: date })}
                      onChange={date => setDate(date)}
                    />
                  </FormControl>
                </Grid>
                <Grid container justify="center" alignItems="center">
                  <FormControl margin='normal' required>
                    <Button disabled={loading} variant="contained" type="submit" color="primary" className={classes.button}>
                      <MdDone style={{ marginRight: '5px', fontSize: '20px' }} />
                      Incluir
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>
            </MuiThemeProvider>
          </Paper>
        ) : (
          <Loading />
        ) }
      </form>
    </>
  )
}
