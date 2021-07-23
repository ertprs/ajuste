import React from 'react'
// import PageLoading from '../../../components/loadingSpinner'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import Typography from '@material-ui/core/Typography'

const theme = createMuiTheme({
  palette: {
    primary: green
  }
})

const style = {
  marginBottom: '10px',
  fontSize: '25px',
  color: '#0000008a'
}

export default function loadingPermissions () {
  return (
    <MuiThemeProvider theme={theme}>
      <Grid container alignItems='center' direction='column' justify='center'>
        <Typography style={style} >Carregando permissões</Typography>
        <CircularProgress size={60} />
      </Grid>
    </MuiThemeProvider>
  )
}
