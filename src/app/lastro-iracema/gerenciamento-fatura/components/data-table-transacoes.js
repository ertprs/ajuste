import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PropTypes from 'prop-types'
import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Loading from '../../../../components/loading'
import Snackbar from '../../../../components/snackbar'
import Api from '../../../../services/Api'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  paper: {
    width: '60%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px'
  },
  labelContent: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 17,
    marginLeft: 10
  },
  controlLabel: {
    padding: 10
  },
  buttonGroup: {
    alignItems: 'flex-start',
    width: '60%',
    marginTop: 20
  },
  submit: {
    width: '18%'
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    primary: green
  },
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
        webkitScrollbarThumb: 'active'
      }
    },
    MuiTableCell: {
      root: {
        padding: '0px 0px 0px 0px',
        // whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#fff',
        borderBottom: 0
      }
    },
    MuiTableRow: {
      footer: {
        height: 40
      }
    },
    select: {
      paddingRight: '50px',
      width: 200
    },
    MuiIconButton: {
      root: {
        // override no root do componente
        padding: 6,
        borderRadius: 10
      }
    },
    MuiToolbar: {
      root: {
        // override no root do componente
        paddingleft: 0
      },
      gutters: {
        paddingleft: 0
      }
    },
    MuiButton: {
      raisedPrimary: {
        color: 'white'
      }
    }
  }
})

class DataTableHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: [],
    openDialog: false,
    openModalRemessaAnalitico: false,
    optionSelected: -1,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  formatOnlyNumbers (value) {
    // eslint-disable-next-line no-useless-escape
    return value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\a-z\A-z]/g, '')
  }

  handleChange = event => {
    this.setState({ optionSelected: event.target.value }, () => {
      if (this.state.optionSelected === '1') {
        this.props.onChangeInputDisable('nsu')
      } else if (this.state.optionSelected === '2') {
        this.props.onChangeInputDisable('data', 'idConta')
      }
    })
  }

  handleClick = () => {
    const { optionSelected } = this.state

    if (optionSelected === '1') {
      this.requestFaturas()
    }
    if (optionSelected === '2') {
      this.requestNsu()
    }
  }

  requestNsu = async () => {
    const { nsu } = this.props
    if (nsu === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'NSU obrigatório'
        }
      })
      return
    }
    this.setState({ innerLoading: true })
    try {
      const response = await Api.post(`lastro_iracema/pesquisa_transacao/`, { nsu: this.formatOnlyNumbers(nsu) })
      this.props.updateData(response.data)
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'NSU não encontrado'
          },
          innerLoading: false
        })
        return
      }
      this.props.openCloseModalDetalhamento()
      this.setState({ innerLoading: false })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Ocorreu um erro no servidor'
        },
        innerLoading: false
      })
    }
  }

  requestFaturas = async () => {
    const { filter, idConta } = this.props
    if (idConta === '' || filter.dataInicial === '' || filter.dataFinal === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Campos obrigatórios'
        }
      })
      return
    }
    this.setState({ innerLoading: true })
    try {
      const response = await Api.post(`lastro_iracema/pesquisa_faturas/`, { idConta, filter })
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Faturas não encontradas'
          },
          innerLoading: false
        })
        return
      }
      this.props.updateData(response.data)
      this.props.openCloseModalFaturas()
      this.setState({ innerLoading: false })
    } catch (error) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Ocorreu um erro no servidor'
        },
        innerLoading: false
      })
    }
  }

  closeAlertSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  render () {
    const { classes } = this.props

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <div className={classes.root}>
          <Snackbar
            onClose={this.closeAlertSnack}
            open={this.state.snackbar.open}
            variant={this.state.snackbar.variant}
            message={this.state.snackbar.message}
          />
          {this.state.innerLoading ? <Loading />
            : <> <Paper className={classes.paper}>
              <FormControl component='fieldset' className={classes.formControl}>
                <RadioGroup aria-label='info' name='info' value={this.state.optionSelected} onChange={this.handleChange}>
                  <FormControlLabel
                    value='1'
                    className={classes.controlLabel}
                    control={<Radio color='primary'/>}
                    label={<span className={classes.labelContent}>EMISSÃO DE FATURAS</span>} />
                  <FormControlLabel
                    value='2'
                    className={classes.controlLabel}
                    control={<Radio color='primary'/>}
                    label={<span className={classes.labelContent}>DETALHAMENTO NSU</span>} />
                </RadioGroup>
              </FormControl>
            </Paper>
            <div className={classes.buttonGroup}>
              <Button
                variant='contained'
                color='primary'
                className={classes.submit}
                onClick={this.handleClick}
              >
                  Executar
              </Button>
            </div></>}
        </div>
      </MuiThemeProvider>
    )
  }
}

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)
