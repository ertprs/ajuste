import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Page403, loadingPermissions } from './others'
import { AuthConsumer } from '../contexts/auth'
import mainRoutes from './routes'
import Dashboard from './dashboard'
import MainDrawer from './drawer/drawer'

const MainApp = (props) => (
  <div style={{ display: 'flex', height: '100%' }}>
    {props.permission.length > 0 ? <MainDrawer drawer={props}/> : <Switch><Route path='/app' component={loadingPermissions}/></Switch>}
    <div style={{ flexGrow: 1, maxWidth: '100%', overflowX: 'hidden' }}>
      {props.permission.length > 0
        ? <Switch>
          {mainRoutes.map((prop, key) => {
            if (!props.permission.includes(prop.id) && prop.path === props.location.pathname) {
              return <Route key={key} path={props.location.pathname} component={Page403} />
            } else if (props.location.pathname === prop.path) {
              return <Route key={key} exact path={prop.path} component={prop.component} />
            } else return null
          })}
          <AuthConsumer>
            {({ permission }) => (
              <Route exact path='/app' render={(props) => <Dashboard permission={permission} location={props.location} history={props.history}/>} />
            )}
          </AuthConsumer>
        </Switch> : <Switch><Route path='/app' /></Switch>}
    </div>
  </div>
)

export default MainApp
