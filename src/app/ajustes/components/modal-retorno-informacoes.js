import React, { } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import SimpleTable from './simple-table'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Loading from '../../../components/loading'
// import Grid from '@material-ui/core/Grid'
// import Swal from 'sweetalert2'

// const styles = theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap'
//   },
//   textField: {
//     marginLeft: theme.spacing.unit,
//     marginRight: theme.spacing.unit,
//     width: '500px'
//   },
//   dense: {
//     marginTop: 16
//   },
//   menu: {
//     width: 200
//   }
// })

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

export default function ModalRequestError ({ title, exclude, onClose, open, data }) {
  return (
    <MuiThemeProvider theme={theme}>
      <Dialog
        fullWidth={'md'}
        maxWidth={'md'}
        open={open}
        onClose={onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          { data.length > 0 ? (
            <SimpleTable exclude={exclude} data={data} />
          ) : (
            <Loading />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  )
}
