import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
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
              label='Data Corte Inicial'
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
              label='Data Corte Final'
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
          <Grid align='right' item xs={3} sm={3}>
            <Button
              onClick={() => props.gerarRelatorioSyspag()}
              variant='contained'
              color='primary'
              className={classes.submit}
              style={{ marginLeft: 5 }}
            >
              <DescriptionIcon />
              Relatório Syspag
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
