import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import React from 'react'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: '80%'
  },
  inputTop: {
    marginHorizontal: 100,
    width: '80%'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 10,
    marginTop: 15
  }
})

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

function formatOnlyNumbers (value) {
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\a-z\A-z]/g, '')
}

function FilterData (props) {
  const { classes } = props

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Grid className={classes.grid} container item xs={12} sm={12} spacing={8}>
          <Grid item xs={3} sm={3}>
            <TextField
              disabled={props.fieldsToDisable.data}
              color='primary'
              name='dataInicial'
              label='Data Vencimento Inicial'
              type='date'
              className={classes.textField}
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
              value={props.filter.dataInicial}
              onChange={props.onChangeInputValueDates}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              disabled={props.fieldsToDisable.data}
              color='primary'
              name='dataFinal'
              label='Data Vencimento Final'
              type='date'
              className={classes.textField}
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
              value={props.filter.dataFinal}
              onChange={props.onChangeInputValueDates}
            />
          </Grid>
          <Grid item xs={3} sm={1}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='idConta'>ID Conta</InputLabel>
              <Input
                disabled={props.fieldsToDisable.idConta}
                id='idConta'
                name='idConta'
                type='number'
                value={props.idConta}
                onChange={props.onChangeInputValue}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='nsu'>NSU</InputLabel>
              <Input
                disabled={props.fieldsToDisable.nsu}
                id='nsu'
                name='nsu'
                value={formatOnlyNumbers(props.nsu)}
                onChange={props.onChangeInputValue}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid className={classes.grid} container item xs={12} sm={12} spacing={8}>
          <Grid item xs={4} sm={4}>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.cleanFilters}
            >
              Limpar
            </Button>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </div>
  )
}

FilterData.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilterData)
