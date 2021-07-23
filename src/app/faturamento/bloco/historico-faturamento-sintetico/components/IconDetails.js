import React, { Fragment } from 'react'
import green from '@material-ui/core/colors/green'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { ArrowForward } from '@material-ui/icons'

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

function IconDetails ({ onClick, className }) {
  return (
    <Fragment>
      <MuiThemeProvider theme={theme}>
        <Button
          color='primary'
          onClick={onClick}
          variant='contained'
          className={className}
        >
          <ArrowForward />
        </Button>
      </MuiThemeProvider>
    </Fragment>
  )
}

export default IconDetails
