import { Action, Reducer } from 'redux'
import { AuthState, User, emptyUser } from './main'
export const OPEN_LOGIN_DIALOG = 'OPEN_LOGIN_DIALOG'
export const CLOSE_LOGIN_DIALOG = 'CLOSE_LOGIN_DIALOG'
export const LOGIN_REQUESTED = 'LOGIN_REQUESTED'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

interface OpenLoginDialog extends Action  {
  type: string
}

interface CloseLoginDialog extends Action  {
  type: string
}

interface LoginRequested extends Action  {
  type: string
}

interface LoginSuccess extends Action  {
  type: string,
  user: User,
  token: string,
  roles: [string]
}

interface LoginFailure extends Action  {
  type: string,
  err: string
}

interface LogoutRequested extends Action  {
  type: string
}

interface LogoutSuccess extends Action  {
  type: string
}

export function openLoginDialogAction() {
  return <OpenLoginDialog>{
    type: OPEN_LOGIN_DIALOG,
  }
}

export function closeLoginDialogAction() {
  return <CloseLoginDialog>{
    type: CLOSE_LOGIN_DIALOG,
  }
}

export function loginRequestedAction() {
  return <LoginRequested>{
    type: LOGIN_REQUESTED,
  }
}

export function loginSuccessAction(loggedInUser: User, newToken: string, newRoles: [string]) {
  return <LoginSuccess>{
    type: LOGIN_SUCCESS,
    user: loggedInUser,
    token: newToken,
    roles: newRoles
  }
}

export function loginFailureAction(error: string) {
  return <LoginFailure>{
    type: LOGIN_FAILURE,
    err: error
  }
}

export function logoutRequestedAction() {
  return <LogoutRequested>{
    type: LOGOUT_REQUESTED,
  }
}

export function logoutSuccessAction() {
  return <LogoutSuccess>{
    type: LOGOUT_SUCCESS,
  }
}

export const openLoginDialogReducer: Reducer<AuthState> = (state: AuthState, action: OpenLoginDialog): AuthState => {
  let newState = Object.assign({}, state)
  newState.open = true
  return newState
}

export const closeLoginDialogReducer: Reducer<AuthState> = (state: AuthState, action: CloseLoginDialog): AuthState => {
  let newState = Object.assign({}, state)
  newState.open = false
  return newState
}

export const loginRequestedReducer: Reducer<AuthState> = (state: AuthState, action: LoginRequested): AuthState => {
  let newState = Object.assign({}, state)
  newState.loggingIn = true
  newState.loginError = null
  return newState
}

export const loginSuccessReducer: Reducer<AuthState> = (state: AuthState, action: LoginSuccess): AuthState => {
  let newState = Object.assign({}, state)
  newState.loggingIn = false
  newState.loginError = null
  newState.user = Object.assign({}, action.user)
  newState.open = false
  newState.isAuthenticated = true
  newState.token = action.token,
  newState.roles = action.roles
  return newState
}

export const loginFailureReducer: Reducer<AuthState> = (state: AuthState, action: LoginFailure): AuthState => {
  let newState = Object.assign({}, state)
  newState.loggingIn = false
  newState.loginError = action.err
  newState.isAuthenticated = false
  return newState
}

export const logoutRequestedReducer: Reducer<AuthState> = (state: AuthState, action: LogoutRequested): AuthState => {
  let newState = Object.assign({}, state)
  newState.loggingOut = true
  return newState
}

export const logoutSuccessReducer: Reducer<AuthState> = (state: AuthState, action: LogoutSuccess): AuthState => {
  let newState = Object.assign({}, state)
  newState.loggingOut = false
  newState.user = Object.assign({}, emptyUser)
  newState.isAuthenticated = false
  newState.token = null
  return newState
}
