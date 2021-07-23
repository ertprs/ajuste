import React from 'react'
import Grid from '@material-ui/core/Grid'

export default function FechamentoDataCompleto (props) {
  return (
    <div>
      <Grid container spacing={3} justify={'flex-end'} xs={12}>
        <Grid item sm={4}>
          <span>Dólar</span>
        </Grid>
        <Grid item sm={4} Grid>
          <span>Real</span>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <span>Saldo Anterior</span>
        </Grid>
        <Grid item sm={4}>
          <span>40</span>
        </Grid>
        <Grid item sm={4}>
          <span>120</span>
        </Grid>
        <Grid item sm={4}>
          <span>Depósito</span>
        </Grid>
        <Grid item sm={4}>
          <span>40</span>
        </Grid>
        <Grid item sm={4}>
          <span>90</span>
        </Grid>
        <Grid item sm={4}>
          <span>Valor Liquidado</span>
        </Grid>
        <Grid item sm={4}>
          <span>321</span>
        </Grid>
        <Grid item sm={4}>
          <span>321</span>
        </Grid>
        <Grid item sm={4}>
          <span>Saldo</span>
        </Grid>
        <Grid item sm={4}>
          <span>3212</span>
        </Grid>
        <Grid item sm={4}>
          <span>321</span>
        </Grid>
        <Grid item sm={4}>
          <span>Variação</span>
        </Grid>
        <Grid item sm={4}>
          <span>3212</span>
        </Grid>
        <Grid item sm={4}>
          <span>321</span>
        </Grid>
        <Grid item sm={4}>
          <span>Saldo Final</span>
        </Grid>
        <Grid item sm={4}>
          <span>3212</span>
        </Grid>
        <Grid item sm={4}>
          <span>321</span>
        </Grid>
      </Grid>
    </div>
  )
}
