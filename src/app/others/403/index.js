import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import TitlePage from '../../../components/title/index'

const styles = theme => ({
  root: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    color: 'gray'
  }
})

const INITIAL_STATE = {

}

class Page403 extends Component {
  state = { ...INITIAL_STATE }
  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <TitlePage text={'SIG'} />
        <div className={classes.root}>
          <h2 className={classes.title}>403</h2>
          <h3 className={classes.title}>SEM PERMISSÃO</h3>
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(Page403)
