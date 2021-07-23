import React from 'react'

import { SintenticoContainer, SinteticoContent, Line } from './Styled'
import { Typography, withStyles } from '@material-ui/core'

const styles = {
  desc: {
    fontWeight: 'bold'
  }
}

function PanelSinteticoItem ({ value, desc, classes }) {
  return (
    <SinteticoContent>
      <Typography className={classes.desc} variant='subtitle1'>{desc}</Typography>
      <Line />
      <Typography variant='subtitle2'>{value}</Typography>
    </SinteticoContent>
  )
}

function PanelSintetico ({ corte, vencimento, vlFaturado, extratado, classes }) {
  return (
    <SintenticoContainer>
      <PanelSinteticoItem desc="DT Corte" value={corte} classes={classes} />
      <PanelSinteticoItem desc="DT Vencimento" value={vencimento} classes={classes}/>
      <PanelSinteticoItem desc="QT Faturamento" value={extratado} classes={classes}/>
      <PanelSinteticoItem desc="VL Faturado" value={vlFaturado} classes={classes}/>
    </SintenticoContainer>
  )
}

export default withStyles(styles)(PanelSintetico)
