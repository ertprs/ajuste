import React, { Fragment } from 'react'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const theme = createMuiTheme({
  palette: {
    primary: green
  }
})

function Loading (props) {
  const { marginLeft } = props
  return (
    <Fragment>
      <MuiThemeProvider theme={theme}>
        <Grid container justify='center' style={{ paddingTop: '15%', marginLeft: marginLeft || 0 }}>
          <CircularProgress color='primary' />
        </Grid>
      </MuiThemeProvider>
    </Fragment>
  )
}

export default Loading
