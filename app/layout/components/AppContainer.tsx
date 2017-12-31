import * as React from 'react'
import {Router, browserHistory} from 'react-router'
import {Provider, connect} from 'react-redux'
import {appStore, AppState} from '../../store/AppStore'
import NotFound from './NotFound'
// page routes -
import chatbotRoutes from '../../preferences/routes'
import Chatbot from '../../preferences/pages/Chatbot'
// import adminRoutes from '../../admin/routes'
// import locationRoutes from '../../example/routes'

import AppDesktop from './AppDesktop'

interface AppContainerProps {}

interface AppContainerState {}

export default class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
  //
  //  Must hold the same reference for routes collection through render invocations, else, react-router
  //  think we want to change the routes collection and raises a warning
  //
  routes: Object

  constructor(props) {
    super(props)
    this.routes = this.buildRoutes()
  }

  private buildRoutes(): Object {
    let routes: any[] = []

    routes = routes
      .concat({path: '/', name: 'AppDesktop', component: AppDesktop})
      .concat(chatbotRoutes)
    //   .concat(locationRoutes)

    // fallback to 404 not found page
    routes.push({ path: '*', component: NotFound })
    return routes
  }

  render() {
    return <Router history={browserHistory} routes={this.routes}>
           </Router>
  }
}
