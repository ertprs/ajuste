import Drawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import logoDrawerSimbolo from '../../assets/images/logo-drawer-simbolo.svg'
import logoDrawer from '../../assets/images/logo-drawer.svg'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { AuthConsumer } from '../../contexts/auth'

import Modulos from './modulos'

const drawerWidth = 260

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  listTextItemMenu: {
    marginLeft: '-10px'
  },
  menuButtonHeader: {
    marginLeft: 12,
    color: '#EEEEEE'
  },
  menuButton: {
    marginLeft: 12,
    color: '#EEEEEE',
    fontFamily: 'sans-serif'
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#008B45',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    backgroundColor: '#008B45',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  toolbar: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  listTextItem: {
    color: '#fff',
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: 'normal'
  },
  imageDrawer: {
    marginLeft: 30,
    width: '100%',
    height: '100%'
  },
  logoDrawerSimboloContainer: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  expandMenu: {
    color: '#fff'
  }
})

class MainDrawer extends React.Component {
  state = {
    open: false,
    open_list: false,
    menuValue: '',
    vold: ''
  }

  componentDidMount = () => {

  }

  handleDrawerOpen = () => {
    this.setState({ open: !this.state.open })
  }

  // Lógica do menu
  handleListOptions = e => {
    e.preventDefault()
    const v = e.currentTarget.id
    if (v === this.state.vold || this.state.vold === '') {
      this.setState(
        state => ({ open_list: !state.open_list }),
        state => this.setState({ right: true }, state => this.setState({ menuValue: v, vold: v }))
      )
    } else if ((v !== this.state.vold) && (this.state.open_list === false)) {
      this.setState(
        state => ({ open_list: !state.open_list }),
        state => this.setState({ right: true }, state => this.setState({ menuValue: v, vold: v }))
      )
    } else {
      this.setState(
        {
          open_list: !this.state.open_list
        },
        () =>
          this.setState({ right: true }, () =>
            this.setState({ menuValue: v, vold: v }, () =>
              this.setState({ open_list: !this.state.open_list })
            )
          )
      )
    }
  }

  render () {
    const { classes } = this.props

    return (
      <Fragment>
        <Drawer
          variant='permanent'
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
            })
          }}
          open={this.state.open}
        >
          {!this.state.open && (
            <div className={classes.logoDrawerSimboloContainer}>
              <img src={logoDrawerSimbolo} alt='' onClick={() => this.props.drawer.history.push('/app')}/>
            </div>
          )}
          <div className={classes.toolbar}>
            {this.state.open && (
              <div>
                <img src={logoDrawer} alt='' className={classes.imageDrawer} onClick={() => this.props.drawer.history.push('/app')}/>
              </div>
            )}
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.handleDrawerOpen}
              style={{ marginLeft: this.state.open && 30 }}
              className={classNames(classes.menuButtonHeader)}
            >
              <MenuIcon />
            </IconButton>
          </div>

          <AuthConsumer>
            {({ isAuth, login, logout, user, permission }) => (
              <>
                <Modulos
                  permissoes={permission}
                  classes={classes}
                  state={this.state}
                  handleListOptions={this.handleListOptions}
                />
              </>
            )}
          </AuthConsumer>
        </Drawer>
      </Fragment>
    )
  }
}

MainDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MainDrawer)
