import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import SearchIcon from '@material-ui/icons/Search'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import DescriptionIcon from '@material-ui/icons/Description'
import React from 'react'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: '80%'
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

function FilterData (props) {
  const { classes } = props

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Grid container className={classes.grid}>
          <Grid container item xs={3} sm={3}>
            <TextField
              color='primary'
              name='dataInicial'
              label='Data Inicial'
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
              onChange={props.onChangeInputValue}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              color='primary'
              name='dataFinal'
              label='Data Final'
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
              onChange={props.onChangeInputValue}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControl margin='normal' required fullWidth>
              <InputLabel shrink htmlFor='banco'>Banco</InputLabel>
              <Select
                id='banco'
                name='banco'
                value={props.banco}
                onChange={props.onChangeInputBanco}
              >
                <MenuItem value={'033'}>Santander</MenuItem>
                <MenuItem value={'399'}>Bradesco</MenuItem>
                <MenuItem value={'001'}>Banco do Brasil</MenuItem>
                <MenuItem value={'341'}>Itaú</MenuItem>
                <MenuItem value={'COP'}>Bradesco Complementar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid className={classes.grid} container item xs={12} sm={12} spacing={8}>
          <Grid item xs={3} sm={3}>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.handleClick}
            >
              <SearchIcon />
              Pesquisar
            </Button>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.cleanFilters}
            >
              Limpar
            </Button>
          </Grid>
          <Grid align='right' item xs={3} sm={3}>
            <Button
              onClick={() => props.gerarRelatorio()}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              <DescriptionIcon />
              Gerar Relatório
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
