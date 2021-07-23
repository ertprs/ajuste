import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import DescriptionIcon from '@material-ui/icons/Description'
import React from 'react'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2,
    marginRight: 10
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
        <Grid className={classes.grid} container item xs={6} sm={12} spacing={12}>
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
      </MuiThemeProvider>
    </div>
  )
}

FilterData.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilterData)
