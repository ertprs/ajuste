import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import Snackbar from '../../../components/snackbar'
import FormSaldoContabil from './FormSaldoContabil'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    width: '100%'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  subContent: {
    width: '70%'
  },
  dialogContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    paddingBottom: 15
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

const classes = styles()

export default function ModalSaldoContabil ({ filterData, open, title, onClickCancel, onChangeInputValue, idHistorico }) {
  const [snackbar, setSnackbar] = useState({})
  const [inputs, setInputs] = useState({})

  function onClose (event, reason) {
    if (reason === 'clickaway') {
      setSnackbar({ snackbar: { ...snackbar, open: false } })
    }
    setSnackbar({ snackbar: { ...snackbar, open: false } })
  }

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Snackbar
          onClose={onClose}
          open={snackbar.open}
          variant={snackbar.variant}
          message={snackbar.message}
        />
        <Dialog
          fullWidth={'sm'}
          maxWidth={'sm'}
          open={open}
          onClose={onClickCancel}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {title}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.subContent}>
              <FormSaldoContabil
                onChangeInputValue={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                endDate={inputs.endDate}
                initDate={inputs.initDate}
                filterData={filterData}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClickCancel()}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    </div>
  )
}
