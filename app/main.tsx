/// <reference path='../typings/all.d.ts' />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AppContainer from './layout/components/AppContainer'
const injectTapEventPlugin  = require('react-tap-event-plugin')
import { ConnectedIntlProvider } from './common/reducers/I18nReducer'
import axios from 'axios'
import config from '../config/client'

//
//  Inject store variable into each component context
//
import {Provider as ReduxProvider} from 'react-redux'
import {appStore} from './store/AppStore'

//
//  General look and theme styling of this application
//  You should rarely touch this file and instead update a component specific css
//
require('!style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap!./../styles/site.scss')

//
//  This React plugin is required by (???)
//  It should be removed once React support the touch event natively
//
injectTapEventPlugin()
// add have its type definition available to all HTML elements...
declare module 'react' {
    interface HTMLProps<T> {
        onTouchTap?: React.EventHandler<React.TouchEvent<T>>
    }
}

// setup global axios defaults
axios.defaults.timeout = config.axios.timeout

axios.interceptors.request.use((config) => {
    const HTTP_AUTH_HEADER_PREFIX = 'Bearer '
    let authToken = appStore.getState().auth.token
    if (authToken) {
      config.headers.common['Authorization'] = HTTP_AUTH_HEADER_PREFIX + authToken
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

ReactDOM.render(
    <ReduxProvider store={appStore}>
        <ConnectedIntlProvider>
            <AppContainer />
        </ConnectedIntlProvider>
    </ReduxProvider>,
    document.getElementById('app-container')
)
