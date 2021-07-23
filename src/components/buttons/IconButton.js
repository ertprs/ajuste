import React, { Fragment } from 'react'
import green from '@material-ui/core/colors/green'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

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

function IconButton (props) {
  return (
    <Fragment>
      <MuiThemeProvider theme={theme}>
        <Button
          color='primary'
          onClick={props.onClick}
          variant='contained'
          className={props.className}
        >
          {props.icon}
          {props.text}
        </Button>
      </MuiThemeProvider>
    </Fragment>
  )
}

export default IconButton
