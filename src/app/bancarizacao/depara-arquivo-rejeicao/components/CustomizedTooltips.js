import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
// import Typography from '@material-ui/core/Typography'
import Zoom from '@material-ui/core/Zoom'
import InfoIcon from '@material-ui/icons/Info'

const TooltipCustom = withStyles(theme => ({
  tooltip: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    backgroundColor: '#c1cdcd',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    maxWidth: 600
  }
}))(Tooltip)

export default function CustomizedTooltips (props) {
  return (
    <div>
      <TooltipCustom
        // color='error'
        TransitionComponent={Zoom}
        placement='top'
        title={props.item}
      >
        <InfoIcon />
      </TooltipCustom>
    </div>
  )
}
