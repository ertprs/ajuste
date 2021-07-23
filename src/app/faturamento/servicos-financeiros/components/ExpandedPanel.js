import React from 'react'
import { withStyles, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { ContainerHistorico, Column } from './Styled'

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
    fontSize: theme.typography.pxToRem(16),
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
    fontSize: theme.typography.pxToRem(14),
    color: '#000',
    fontWeight: 'bold'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
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
  },
  titleMargin: {
    marginTop: '20px'
  }
})

function ContentPanel ({ classes, data }) {
  return data.map((service, index) => (
    <ExpansionPanelDetails key={`${service.id}`} className={classes.details}>
      <Column>
        <Typography className={classes.secondaryHeading}>{service.name}</Typography>
      </Column>
      <Column>
        <Typography className={classes.secondaryHeading}>{service.extratados}</Typography>
      </Column>
      <Column>
        <Typography className={classes.secondaryHeading}>{service.previstos}</Typography>
      </Column>
      <Column>
        <Typography className={classes.secondaryHeading}>{service.precisao}</Typography>
      </Column>
      <Column>
        <Typography className={classes.secondaryHeading}>{service.erro}</Typography>
      </Column>
    </ExpansionPanelDetails>
  ))
}

function Title ({ classes, titles }) {
  return (
    <ContainerHistorico className={classes.titleMargin}>
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

function Panel ({ classes, titles, values }) {
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
                {item}
              </Typography>
            </Column>
          ))}
        </ExpansionPanelSummary>
        {values && <ContentPanel data={values} classes={classes} />}
      </ExpansionPanel>
    </ContainerHistorico>
  )
}

const PanelTitle = withStyles(styles)(Title)
const ExpandedPanel = withStyles(styles)(Panel)

export { PanelTitle, ExpandedPanel }
