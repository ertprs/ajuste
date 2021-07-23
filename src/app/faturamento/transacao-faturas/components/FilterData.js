import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import React from 'react'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: '80%'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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

function FilterData (props) {
  const { classes } = props

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Grid className={classes.grid} container item xs={12} sm={12} spacing={8}>
          <Grid item xs={3} sm={3}>
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
              onChange={props.onChangeInputValueDates}
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
              onChange={props.onChangeInputValueDates}
            />
          </Grid>
        </Grid>
        <div className={classes.container}>
          <div>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.handleClick}
            >
              <SearchIcon />
              Pesquisar
            </Button>
          </div>
          <div>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.cleanFilters}
            >
              Limpar
            </Button>
          </div>
          {/* <div>
            <Button
              onClick={() => props.openCloseModalBatimento()}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Batimento
            </Button>
          </div> */}
        </div>
      </MuiThemeProvider>
    </div>
  )
}

FilterData.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilterData)
