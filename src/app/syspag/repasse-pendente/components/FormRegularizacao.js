import React, { } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import CurrencyInput from 'react-currency-input'

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

export default function FormRegularizacao (props) {
  return (
    <>
      { props.loadingRegularizacao ? <LinearProgress /> : null }
      <div className={classes.container}>
        <div className={classes.subContent}>
          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor='despesa'>Valor Regl</InputLabel>
            <Input
              required
              id='vlRegl'
              name='vlRegl'
              value={props.vlRegl}
              onChange={props.onChangeInputVlRegl}
              startAdornment={<InputAdornment position="start">R$</InputAdornment>}
              inputComponent={CurrencyInput}
            />
          </FormControl>
          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor="tipo-rgl">Tipo Regl</InputLabel>
            <Select
              required
              className={classes.cellRowStyle}
              value={props.tipoRegl}
              onChange={props.onChangeInputValue}
              inputProps={{
                name: 'tipoRegl',
                id: 'tipo-regl'
              }}
            >
              <MenuItem value={'TED/DOC'}>TED/DOC</MenuItem>
              <MenuItem value={'RECEITA - 6 MESES EM ABERTO'}>RECEITA - 6 MESES EM ABERTO</MenuItem>
              <MenuItem value={'TRANSFERENCIA'}>TRANSFERENCIA</MenuItem>
              <MenuItem value={'VALORES MENOR DE R$ 1'}>VALORES MENOR DE R$ 1</MenuItem>
              <MenuItem value={'REPASSE INDEVIDO'}>REPASSE INDEVIDO</MenuItem>
            </Select>
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            disabled={props.loadingRegularizacao || props.tipoRegl === ''}
            onClick={props.onClickConfirm}
          >
            Salvar
          </Button>
        </div>
      </div>
    </>
  )
}
