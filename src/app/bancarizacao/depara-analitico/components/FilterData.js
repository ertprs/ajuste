import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import PropTypes from 'prop-types'
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
              label='Data Arquivo Inicial'
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
              label='Data Arquivo Final'
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
        </Grid>
        <Grid container className={classes.grid}>
          <Grid container item xs={3} sm={3}>
            <TextField
              color='primary'
              name='idConta'
              label='Id conta'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.idConta}
              onChange={props.onChangeInputValueFilters}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              color='primary'
              name='cpf'
              label='CPF'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.cpf}
              onChange={props.onChangeInputValueFilters}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              color='primary'
              name='ccb'
              label='CCB'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.ccb}
              onChange={props.onChangeInputValueFilters}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              color='primary'
              name='nomeArquivo'
              label='Nome Arquivo'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.nomeArquivo}
              onChange={props.onChangeInputValueFilters}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.grid}>
          <Grid container item xs={3} sm={3}>
            <TextField
              color='primary'
              name='nomeCliente'
              label='Nome Cliente'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.nomeCliente}
              onChange={props.onChangeInputValueFilters}
            />
          </Grid>
          <Grid container item xs={3} sm={3}>
            <TextField
              color='primary'
              name='titularidade'
              label='Titularidade'
              type='name'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              value={props.titularidade}
              onChange={props.onChangeInputValueFilters}
            />
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
              Gerar arquivo
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
        </Grid>
      </MuiThemeProvider>
    </div>
  )
}

FilterData.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilterData)
