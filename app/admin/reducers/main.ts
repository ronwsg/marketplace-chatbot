import { Action, Reducer } from 'redux'
import * as r from './Authentication'
import { getUserFromCookie, getTokenFromCookie, isSessionCookieValid, getRolesFromCookie } from './common'

export * from './common'

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  displayName: string,
  gender: string,
  emails: [string],
  picture: string,
}

export const emptyUser: User = {
  id: null,
  firstName: '',
  lastName: '',
  displayName: '',
  gender: '',
  emails: null,
  picture: '',
}

export interface AuthState {
  open: boolean,
  loggingIn: boolean,
  loggingOut: boolean,
  loginError: string,
  token: string,
  roles: [string],
  isAuthenticated: boolean,
  user: User
}

let initialState: AuthState = {
  open: false,
  loggingIn: false,
  loggingOut: false,
  loginError: null,
  token: null,
  roles: null,
  isAuthenticated: false,
  user: emptyUser
}
// session still active?
if (isSessionCookieValid()) {
  initialState.isAuthenticated = true
  initialState.token = getTokenFromCookie()
  initialState.user = getUserFromCookie()
  initialState.roles = getRolesFromCookie()
}

const reducers = {
  [r.OPEN_LOGIN_DIALOG]: r.openLoginDialogReducer,
  [r.CLOSE_LOGIN_DIALOG]: r.closeLoginDialogReducer,
  [r.LOGIN_REQUESTED]: r.loginRequestedReducer,
  [r.LOGIN_SUCCESS]: r.loginSuccessReducer,
  [r.LOGIN_FAILURE]: r.loginFailureReducer,
  [r.LOGOUT_REQUESTED]: r.logoutRequestedReducer,
  [r.LOGOUT_SUCCESS]: r.logoutSuccessReducer
}

export const actions = {
  openLoginDialog: r.openLoginDialogAction,
  closeLoginDialog: r.closeLoginDialogAction,
  loginRequested: r.loginRequestedAction,
  loginSuccess: r.loginSuccessAction,
  loginFailure: r.loginFailureAction,
  logoutRequested: r.logoutRequestedAction,
  logoutSuccess: r.logoutSuccessAction,
}

export const adminReducer: Reducer<AuthState> = (state: AuthState = initialState, action: Action): AuthState => {
  let reducer = reducers[action.type]
  if (reducer) {
    return reducer(state, action)
  }

  return state
}
