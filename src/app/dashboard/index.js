import React, { Component, Fragment } from 'react'
import TitlePage from '../../components/title/index'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
// import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import mainModules from './modulos'
import { MenuList } from '@material-ui/core'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  MenuItem: {
    color: 'gray'
  },
  paper: {
    cursor: 'pointer',
    padding: 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '15vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  paperMenu: {
    cursor: 'pointer',
    padding: 10,
    position: 'absolute',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  customTable: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  row: {
    width: '20%',
    margin: 10
  },
  column: {
    margin: 10,
    width: '17%',
    // flexGrow: 1,
    flexBasis: '22%'
    // flexShrink: 2
  }
})

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.itemMenuRef = React.createRef()
    this.state = { openMenu: -1, widthPaperOver: 203 }
  }

  redirectRoute = (path) => {
    this.props.history.push(path)
  }

  openMenuList = (index) => {
    this.setState({ openMenu: index, widthPaperOver: this.itemMenuRef.current.offsetWidth })
  }

  handleClose = () => {
    this.setState({ openMenu: -1 })
  };

  renderFormRow (item, index) {
    const { classes, permission } = this.props
    const { openMenu } = this.state
    return (
      <div className={classes.column} key={index}>
        <div ref={this.itemMenuRef}>
          <Paper className={classes.paper} onMouseOver={ () => this.openMenuList(index)}>
            <div>{item.icon}</div>
            {item.label}
          </Paper>
        </div>
        {openMenu === index && item.sub.length > 0
          ? <ClickAwayListener onClickAway={this.handleClose}>
            <Paper className={classes.paperMenu} style={{ width: this.state.widthPaperOver }}>
              <MenuList>
                {item.sub.map((value, index) => {
                  if (permission.includes(value.id)) {
                    return <MenuItem key={index} onClick={() => this.redirectRoute(value.path)} className={classes.MenuItem}>{value.name}</MenuItem>
                  } else return null
                })}
              </MenuList>
            </Paper>
          </ClickAwayListener> : null}
      </div>
    )
  }

  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <TitlePage text={'SIG'} />
        <div className={classes.customTable}>
          { mainModules.map((value, index) => {
            if (!this.props.permission.includes(value.id)) {
              return null
            } else {
              return this.renderFormRow(value, index)
            }
          })}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(Dashboard)
