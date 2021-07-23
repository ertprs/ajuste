import React from 'react'
import { withStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { prettyNumber } from '../utils/utils'
import { ContainerHistorico, Column } from './Styled'
// MuiPaper-elevation1-175
const styles = theme => ({
  panel: {
    padding: 0,
    boxShadow: 'none'
  },
  title: {
    alignItems: 'center',
    backgroundColor: '#00703b',
    borderRadius: 8
  },
  headingTitle: {
    fontSize: theme.typography.pxToRem(14),
    color: '#FFF',
    fontWeight: 'bold'
  },
  group: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    margin: '1px 0px',
    boxShadow: '2px 2px 10px 1px rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 8,
    border: 'solid'
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    color: '#7A7A7A'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: '#7A7A7A',
    padding: '10px 0px 0px 0px'
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
    color: '#00703b'
  },
  details: {
    alignItems: 'center'
  }
})
function ContentPanel ({ classes, data }) {
  return data.map((bloco, index) => (
    <ExpansionPanelDetails key={`${index}-${bloco.ds_transacao}`} className={classes.details}>
      {
        [bloco.ds_transacao, ...bloco.total, bloco.previsao, bloco.diferenca_abs, bloco.diferenca.toFixed(3)].map((transacao, index) => (
          <Column key={`${index}-${transacao}`}>
            <Typography className={classes.secondaryHeading}>{prettyNumber(transacao)}</Typography>
          </Column>
        ))
      }
    </ExpansionPanelDetails>
  ))
}

function HistoricoPanelTitle ({ classes, titles }) {
  return (
    <ContainerHistorico>
      <ExpansionPanel defaultExpanded={true} >
        <ExpansionPanelSummary
          className={classes.title}
          expandIcon={null}>
          {titles.map((item, index) => (
            <Column key={`${index}${item}`}>
              <Typography
                className={classes.headingTitle}>
                {item}
              </Typography>
            </Column>
          ))}
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </ContainerHistorico>
  )
}

function HistoricoPanelBlocos ({ classes, titles, values }) {
  return (
    <ContainerHistorico>
      <ExpansionPanel defaultExpanded={false} className={classes.panel} >
        <ExpansionPanelSummary
          className={classes.group}
          expandIcon={<ExpandMoreIcon className={classes.icon} />}>
          {titles.map((item, index) => (
            <Column key={`${index}${item}`}>
              <Typography
                className={classes.heading}>
                {prettyNumber(item)}
              </Typography>
            </Column>
          ))}
        </ExpansionPanelSummary>
        {values && <ContentPanel data={values} classes={classes} />}
      </ExpansionPanel>
    </ContainerHistorico>
  )
}

const HistoricoTitle = withStyles(styles)(HistoricoPanelTitle)
const HistoricoBlocos = withStyles(styles)(HistoricoPanelBlocos)

export { HistoricoBlocos, HistoricoTitle }
