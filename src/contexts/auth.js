import React from 'react'
import Api from '../services/Api'

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
  state = { isAuth: false, user: {}, status: null, permission: [], loading: false }

  login = (email, password, e) => {
    e.preventDefault()

    this.setState({ ...this.state, loading: true })

    const data = { email, password }

    fetch(`${process.env.REACT_APP_API_URL}/api/login/validate_user/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          user: response
        })
        if (this.state.user) {
          window.localStorage.setItem('user', JSON.stringify(response.user))
          window.localStorage.setItem('token', JSON.stringify(response.session.token))
          const user = JSON.parse(window.localStorage.getItem('user'))
          this.setState({ isAuth: true, status: null, user: user, permission: response.session.permissao, loading: false })
          this.props.history.push('/app')
        } else {
          this.setState({
            status: 'usuário ou senha inválido',
            loading: false
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false
        })
      })
  }

  logout = () => {
    this.setState({ isAuth: false })
    window.localStorage.removeItem('user')
    this.props.history.push('/login')
  }

  componentDidMount = async () => {
    const token = JSON.parse(window.localStorage.getItem('token'))
    try {
      const resultado = await Api.post(`login/validate_session/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
          }
        }
      )
      this.setState({ permission: resultado.data.permissoes })
    } catch (error) {
      if (token) {
        window.localStorage.clear()
        this.props.history.go('login')
      }
    }
  }

  componentWillMount () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      this.setState({
        user: user,
        isAuth: true
      })
    }
  }

  render () {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout,
          user: this.state.user,
          status: this.state.status,
          permission: this.state.permission,
          loading: this.state.loading
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
