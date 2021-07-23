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
import Swal from 'sweetalert2'
import Loading from '../../../../components/loading'
import Snackbar from '../../../../components/snackbar'
import Api from '../../../../services/Api'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

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
        this.props.onChangeInputDisable('cpf')
      } else if (this.state.optionSelected === '2') {
        this.props.onChangeInputDisable('cpf')
      } else if (this.state.optionSelected === '4') {
        this.props.onChangeInputDisable('data', 'cpf')
      } else if (this.state.optionSelected === '5') {
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
      this.requestPagamento()
    }
    if (optionSelected === '4') {
      this.requestSeguros()
    }
    if (optionSelected === '5') {
      this.requestRestricao()
    }
  }

  requestFaturas = async () => {
    const { filter, idConta } = this.props
    if (idConta === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'ID obrigatório'
        }
      })
      return
    }
    this.setState({ innerLoading: true })

    try {
      const response = await Api.get(`juridico/gerar_arquivos_faturas/?data_inicial=${filter.dataInicial}&data_final=${filter.dataFinal}&id_conta=${idConta}`)
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Nenhuma fatura encontrada'
          },
          innerLoading: false
        })
        return
      }

      if (filter.dataInicial === '' && filter.dataFinal === '') {
        const zip = new JSZip()
        const pasta = zip.folder('faturas_' + idConta)
        response.data.forEach(element => {
          pasta.file(element.name + '.pdf', `${element.file}`, { base64: true })
        })
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          FileSaver.saveAs(content, `faturas_${idConta}.zip`)
        })
      } else {
        response.data.forEach(element => {
          const linkSource = `data:application/pdf;base64,${element.file}`
          const downloadLink = document.createElement('a')
          const fileName = element.name + '.pdf'

          downloadLink.href = linkSource
          downloadLink.download = fileName
          downloadLink.click()
        })
      }
      this.setState({ innerLoading: false })
    } catch (error) {
      console.log(error)
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

  requestPagamento = async () => {
    const { idConta } = this.props
    if (idConta === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'ID obrigatório'
        }
      })
      return
    }

    this.setState({ innerLoading: true })
    try {
      const response = await Api.get(`juridico/get_fatura/?id_conta=${idConta}`)
      this.props.updateData(response.data)
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Nenhuma fatura encontrada'
          },
          innerLoading: false
        })
        return
      }
      this.setState({ innerLoading: false })
      this.props.openCloseModalDetalhamento()
    } catch (error) {
      console.log(error)
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

  requestSeguros = async () => {
    const { idConta } = this.props
    if (idConta === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'ID obrigatório'
        }
      })
      return
    }
    this.setState({ innerLoading: true })
    try {
      const response = await Api.get(`juridico/get_seguro/?id_conta=${idConta}`)
      this.props.updateData(response.data)
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Nenhum produto financeiro encontrado'
          },
          innerLoading: false
        })
        return
      }
      this.setState({ innerLoading: false })
      this.props.openCloseModalDetalhamento(true)
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

  requestRestricao = async () => {
    const { cpf } = this.props
    if (cpf === '') {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'CPF obrigatório'
        }
      })
      return
    }
    this.setState({ innerLoading: true })
    try {
      const response = await Api.get(`juridico/get_restricao/?cpf=${this.formatOnlyNumbers(cpf)}`)
      this.props.updateData(response.data)
      // console.log(response.data)
      if (response.data.length === 0) {
        this.setState({
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'CPF não encontrado'
          },
          innerLoading: false
        })
        return
      }
      this.setState({ innerLoading: false })
      Swal.fire({
        text: response.data.msg
      })
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
                    label={<span className={classes.labelContent}>DETALHAMENTO PAGAMENTOS</span>} />
                  {/* <FormControlLabel
                    value='3'
                    className={classes.controlLabel}
                    disabled
                    control={<Radio color='primary'/>}
                    label={<span className={classes.labelContent}>DOCUMENTAÇÃO</span>} /> */}
                  <FormControlLabel
                    value='4'
                    className={classes.controlLabel}
                    control={<Radio color='primary'/>}
                    label={<span className={classes.labelContent}>PRODUTOS FINANCEIRO</span>} />
                  <FormControlLabel
                    value='5'
                    className={classes.controlLabel}
                    control={<Radio color='primary'/>}
                    label={<span className={classes.labelContent}>CONSULTA RESTRIÇÕES</span>} />
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
