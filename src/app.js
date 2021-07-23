import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import MainApp from './app/index'
import Login from 'login'
import { AuthConsumer, AuthProvider } from './contexts/auth'

import './styles.css'

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuth, permission }) => (
      <Route
        render={props => (isAuth ? <Component {...props} permission={permission} /> : <Redirect to='/login' />)}
        {...rest}
      />
    )}
  </AuthConsumer>
)

class App extends Component {
  componentDidMount () {
    const { location } = this.props.history

    if (location.pathname === '/') {
      this.props.history.push('/login')
    }
  }
  render () {
    return (
      <AuthProvider history={this.props.history}>
        <Switch>
          <ProtectedRoute path='/app' component={MainApp} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </AuthProvider>
    )
  }
}

export default App
