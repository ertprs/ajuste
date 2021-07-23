import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import DescriptionIcon from '@material-ui/icons/Description'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import exportCSVFile from '../../../../util/exportCSVFile'
import Snackbar from '../../../../components/snackbar'
import IconButton from '../../../../components/buttons/IconButton'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2,
    display: 'flex'
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
        `${process.env.REACT_APP_API_URL}/emissao-registro/load-grid-remessa-faturamento-analitico`,
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
        <Grid item xs={4} sm={4}>
          <IconButton
            onClick={() => this.requestServiceRelatorioAnalitico()}
            text={'Relatório Analítico'}
            icon={<DescriptionIcon />}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <IconButton
            onClick={() => this.requestServiceRelatorioSintetico()}
            text={'Relatório Sintético'}
            icon={<DescriptionIcon />}
          />
        </Grid>
      </div>
    )
  }
}

GerarRelatorio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GerarRelatorio)
