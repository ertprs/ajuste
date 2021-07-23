import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import DescriptionIcon from '@material-ui/icons/Description'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import green from '@material-ui/core/colors/green'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    // marginTop: 40,
    marginBottom: 10
  },
  grid: {
    paddingTop: theme.spacing.unit * 2,
    display: 'flex'
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

class GerarRelatorio extends Component {
  state = {
    snackbar: {
      open: false,
      variant: '',
      message: ''
    }
  }

  requestServiceRelatorioAnalitico = () => {
    if (this.props.dataCsv.length <= 0) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'info',
          message: 'Selecione a contas que deseja gerar relatório'
        }
      })
    } else {
      const data = {
        id_portador_import: this.props.idPortadorImport,
        contas: this.props.dataCsv
      }

      fetch(
        `${process.env.REACT_APP_API_URL}/emissao-registro/load-grid-remessa-retorno-analitico`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
        .then(data => data.json())
        .then(data => {
          if (data.length > 0) {
            exportCSVFile(data, `relatorio_analitico`)
            this.setState({
              snackbar: {
                open: true,
                variant: 'success',
                message: 'Relatório Gerado'
              }
            })
          } else {
            this.setState({
              snackbar: {
                open: true,
                variant: 'info',
                message: 'Não há registros para gerar relatório'
              }
            })
          }
        })
        .catch(() =>
          this.setState({
            snackbar: {
              open: true,
              variant: 'error',
              message: 'Erro no servidor'
            }
          })
        )
    }
  }

  requestServiceRelatorioSintetico = () => {
    exportCSVFile(this.props.dataSintetico, `relatorio_sintetico`)
    this.setState({
      snackbar: {
        open: true,
        variant: 'success',
        message: 'Relatório Gerado'
      }
    })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.grid}>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <MuiThemeProvider theme={theme}>
          <Grid item xs={4} sm={4}>
            <Button
              onClick={() => this.requestServiceRelatorioAnalitico()}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              <DescriptionIcon />
              Relatório Analítico
            </Button>
          </Grid>
          <Grid item xs={4} sm={4}>
            <Button
              onClick={() => this.requestServiceRelatorioSintetico()}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              <DescriptionIcon />
              Relatório Sintético
            </Button>
          </Grid>
        </MuiThemeProvider>
      </div>
    )
  }
}

GerarRelatorio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GerarRelatorio)
