import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import img from 'assets/images/logo.svg'
import bg from 'assets/images/bg.svg'
import efeito from 'assets/images/efeito.svg'
import Divider from '@material-ui/core/Divider'
import green from '@material-ui/core/colors/green'
import { AuthConsumer } from '../contexts/auth'
// import Loading from '../components/loading'
import LinearProgress from '@material-ui/core/LinearProgress'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    alignItems: 'center',
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    width: '604px',
    height: '410px'
  },
  logoContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  divider: {
    marginTop: theme.spacing.unit,
    width: '100%',
    height: '2px'
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '70%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    width: '50%',
    backgroundColor: '#3C8C33'
  },
  title: {
    marginTop: theme.spacing.unit,
    fontFamily: 'sans-serif',
    fontSize: '24px',
    color: '#7A7A7A'
  },
  sigla: {
    fontFamily: 'sans-serif',
    fontSize: '24px',
    color: '#008B45',
    fontWeight: 'bold'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  bg: {
    position: 'fixed',
    top: 0,
    left: 0,
    minWidth: '100%',
    minHeight: '100%',
    zIndex: -1
  },
  efeito: {
    position: 'fixed',
    top: 0,
    left: 0,
    minWidth: '100%',
    minHeight: '100%',
    zIndex: -2
  },
  link: {
    marginTop: theme.spacing.unit,
    color: '#7A7A7A',
    textDecoration: 'none'
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

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      isUserLoggedIn: false,
      objAuthUser: null,
      loading: false
    }
  }

  render () {
    const { classes } = this.props
    const { email, password } = this.state
    return (
      <AuthConsumer>
        {({ login, status, loading }) => (
          <>
            { loading ? (
              <MuiThemeProvider theme={theme}>
                <LinearProgress />
              </MuiThemeProvider>
            ) : null }
            <main className={classes.main}>
              <img className={classes.bg} src={bg} alt='' />
              <img className={classes.efeito} src={efeito} alt='' />
              <Paper className={classes.paper}>
                <div className={classes.Loading}>
                </div>
                <div className={classes.logoContainer}>
                  <img src={img} alt='' />
                  <Divider className={classes.divider} />
                  <div className={classes.title}>
                    <span className={classes.sigla}>SIG</span> Sistema Integrado
                    de Gestão
                  </div>
                </div>
                <form
                  className={classes.form}
                  onSubmit={e => login(email, password, e)}
                >
                  <MuiThemeProvider theme={theme}>
                    <FormControl margin='normal' required fullWidth>
                      <InputLabel htmlFor='email'>Usuário</InputLabel>
                      <Input
                        id='email'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        onChange={e =>
                          this.setState({
                            email: e.target.value
                          })
                        }
                      />
                    </FormControl>
                    <FormControl margin='normal' required fullWidth>
                      <InputLabel htmlFor='password'>Senha</InputLabel>
                      <Input
                        name='password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={e =>
                          this.setState({
                            password: e.target.value
                          })
                        }
                      />
                    </FormControl>
                    <span
                      style={{
                        color: 'red',
                        display: 'flex',
                        alignContent: 'center'
                      }}
                    >
                      {status}
                    </span>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                      disabled={loading}
                    >
                      Entrar
                    </Button>
                  </MuiThemeProvider>
                  <a className={classes.link} href='www.forbrasil.com.br'>
                    Esqueceu sua senha?
                  </a>
                </form>
              </Paper>
            </main>
          </>
        )}
      </AuthConsumer>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)
