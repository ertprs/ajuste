import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import DescriptionIcon from '@material-ui/icons/Description'

import React from 'react'

const styles = theme => ({
  grid: {
    paddingTop: theme.spacing.unit * 2
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: '80%'
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

function FilterData (props) {
  const { classes } = props

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Grid container className={classes.grid}>
          <Grid container item xs={3} sm={2}>
            <TextField
              color='primary'
              name='dataInicial'
              label='Data Arquivo Inicial'
              type='date'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                  </InputAdornment>
                )
              }}
              value={props.filter.dataInicial}
              onChange={props.onChangeInputValue}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <TextField
              color='primary'
              name='dataFinal'
              label='Data Arquivo Final'
              type='date'
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <CalendarIcon style={{ color: 'rgb(0, 139, 69)' }} />
                  </InputAdornment>
                )
              }}
              value={props.filter.dataFinal}
              onChange={props.onChangeInputValue}
            />
          </Grid>

          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='searchId'>ID Conta do Cliente</InputLabel>
              <Input
                color='primary'
                id='searchId'
                name='searchId'
                value={props.filter.searchId}
                onChange={props.onChangeInputValue}
              />
            </FormControl>
          </Grid>

          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='cpf_cliente'>CPF</InputLabel>
              <Input
                id='cpf_cliente'
                name='cpf_cliente'
                value={props.filter.searchCpf}
                onChange={props.onChangeInputValue}
              />
            </FormControl>
          </Grid>{/*  */}
          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='tipo_ccb'>Nº da CCB</InputLabel>
              <Input
                id='tipo_ccb'
                name='tipo_ccb'
                onChange={props.onChangeInputValue}
                value={props.filter.searchTipoCcb}
              />
            </FormControl>
          </Grid>{/*  */}
          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='nome_arquivo'>Nome do Arquivo</InputLabel>
              <Input
                id='nome_arquivo'
                name='nome_arquivo'
                onChange={props.onChangeInputValue}
                value={props.filter.searchNomeArquivo}
              />
            </FormControl>
          </Grid>{/*  */}
          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='nomeCliente'>Nome do Cliente</InputLabel>
              <Input
                id='nomeCliente'
                name='nomeCliente'
                onChange={props.onChangeInputValue}
                value={props.filter.searchNomeCliente}
              />
            </FormControl>
          </Grid>{/*  */}

          <Grid item xs={3} sm={2}>
            <FormControl className={classes.inputTop}>
              <InputLabel htmlFor='titularidade'>Titularidade</InputLabel>
              <Input
                id='titularidade'
                name='titularidade'
                onChange={props.onChangeInputValue}
                value={props.filter.searchTitularidade}
              />
            </FormControl>
          </Grid>{/*  */}
        </Grid>
        <Grid className={classes.grid} container item xs={12} sm={12} spacing={8}>
          <Grid item xs={3} sm={3}>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.handleClick}
            >
              <SearchIcon />
              Pesquisar
            </Button>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Button
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={props.cleanFilters}
            >
              Limpar
            </Button>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Button
              onClick={() => props.gerarRelatorio()}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              <DescriptionIcon />
              Gerar Relatório
            </Button>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    </div>
  )
}

FilterData.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilterData)
