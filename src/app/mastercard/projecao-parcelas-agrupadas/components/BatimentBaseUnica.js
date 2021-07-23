import Button from '@material-ui/core/Button'
import React, { Component, Fragment } from 'react'
import green from '@material-ui/core/colors/green'
// import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck'

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

class BatimentoBaseUnica extends Component {
  state = {
    openModalBatimentoBaseUnica: false
  }
  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <MuiThemeProvider theme={theme}>
          <Button
            onClick={() => this.props.openModal()}
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            <PlaylistAddCheck />
            Transações Base Unica
          </Button>
        </MuiThemeProvider>
      </Fragment>
    )
  }
}

BatimentoBaseUnica.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BatimentoBaseUnica)
