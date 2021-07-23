import React from 'react'
import { Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { AuthConsumer } from '../../contexts/auth'
import PersonIcon from '@material-ui/icons/Person'

const styles = theme => ({
  titleContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 5,
      marginRight: theme.spacing.unit * 5,
      marginTop: theme.spacing.unit * 2
    }
  },
  divider: {
    width: '410px',
    height: '2px',
    backgroundColor: '#008B45',
    marginLeft: -40
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'flex-end'
  },
  out: {
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right',
    color: '#7A7A7A'
  }
})

function TitlePage (props) {
  const { classes, text } = props

  return (
    <AuthConsumer>
      {({ isAuth, login, logout, user }) => (
        <>
          <div className={classes.titleContainer}>
            <div className={classes.content}>
              <Typography variant='h5' component='h3'>
                {text}
                <Divider className={classes.divider} />
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <h4 className={classes.out}>
                  <PersonIcon style={{ color: '#3BB01E' }} />
                  Bem-Vindo, {user.login_user}
                </h4>
                <div
                  className={classes.out}
                  style={{
                    border: '1px solid #43DE1C',
                    height: 30,
                    marginTop: 15,
                    marginLeft: 8,
                    marginRight: 8
                  }}
                />
                <h4 className={classes.out} style={{ cursor: 'pointer' }} onClick={() => logout()}>
                  SAIR
                </h4>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthConsumer>
  )
}

TitlePage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TitlePage)
