import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

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

function FechamentoForm (props) {
  const { classes } = props
  return (
    <div className={classes.container}>
      <div className={classes.subContent}>
        <TextField
          color='primary'
          name='dataPeriodo'
          label='Data Agenda'
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
          value={props.dataPeriodo}
          onChange={props.onChangeInputValue}
        />
        <FormControl margin='normal' fullWidth>
          <InputLabel htmlFor='taxaCambio'>Taxa de Câmbio</InputLabel>
          <Input
            id='taxaCambio'
            name='taxaCambio'
            type='number'
            value={props.taxaCambio}
            onChange={props.onChangeInputValue}
          />
        </FormControl>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          onClick={props.onClick}
          disabled={props.dataPeriodo === '' || props.taxaCambio === ''}
        >
          Incluir
        </Button>
      </div>
    </div>
  )
}
export default withStyles(styles)(FechamentoForm)
