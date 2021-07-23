import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Grid from '@material-ui/core/Grid'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import SearchIcon from '@material-ui/icons/Search'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
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
        <Grid container className={classes.grid} spacing={8}>
          <Grid item xs={3} sm={3}>
            <FormControl required fullWidth>
              <InputLabel shrink htmlFor='banco'>Banco</InputLabel>
              <Select
                id='banco'
                name='banco'
                value={props.banco}
                onChange={props.onChangeInputBanco}
              >
                <MenuItem value={'033'}>Santander</MenuItem>
                <MenuItem value={'399'}>Bradesco</MenuItem>
                <MenuItem value={'001'}>Banco do Brasil</MenuItem>
                <MenuItem value={'341'}>Itaú</MenuItem>
                <MenuItem value={'COP'}>Bradesco Complementar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={4}>
            <FormControl required fullWidth>
              <InputLabel shrink htmlFor='cnpj'>CNPJ</InputLabel>
              <Input
                style={{ marginRight: 10 }}
                id='cnpj'
                name='cnpj'
                type='number'
                value={props.cnpj}
                onChange={props.onChangeInputCnpj}
              />
            </FormControl>
          </Grid>
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
          <Grid align='right' item xs={2} sm={2}>
            <Button
              onClick={() => props.gerarRelatorio()}
              variant='contained'
              color='primary'
              disabled={!props.data.length}
              className={classes.submit}
            >
              <DescriptionIcon />
              Gerar Relatório
            </Button>
          </Grid>
          <Grid align='right' item xs={2} sm={2}>
            <Button
              onClick={() => props.openCloseModalRegularizacaoLote()}
              variant='contained'
              color='primary'
              disabled={!props.selected.length}
              className={classes.submit}
            >
              <DescriptionIcon />
              Reg. em Lote
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
