import {actions, User, emptyUser} from './main'
import axios, {AxiosResponse} from 'axios'
import { Cookies } from 'react-cookie'
import * as jwt from 'jsonwebtoken'
import config from '../../../config/client'

const USER_COOKIE = 'user'

export interface IToken {
  sub: string
  scopes: string[]
  iss: string
  exp: number
  givenName: string
  familyName: string
  displayName: string
  email: string
}

export const isValidToken = (token: string): boolean => {
  let base64Secret = new Buffer(config.jwt.signature.secret, 'base64')
  try {
    let decodedToken = jwt.verify(token, base64Secret, { algorithms: [config.jwt.signature.algorithm] })
  }
  catch (e) {
    return false
  }
  return true
}

const validateResponse = (response: AxiosResponse) => {
  return new Promise<any>((resolve, reject) => {
    let responseToken = response.data['token']
    let responseUser = response.data['user']
    let base64Secret = new Buffer(config.jwt.signature.secret, 'base64')
    try {
      let decodedToken = jwt.verify(responseToken, base64Secret, { algorithms: [config.jwt.signature.algorithm] }) as IToken
      // assuming that expired JWT will not reach here...
      resolve({user: responseUser, token: responseToken, expires: decodedToken.exp, roles: decodedToken.scopes})
    }
    catch (e) {
      reject(e)
    }
  })
}

export const loginUser = (dispatch: any, iusername: string, ipassword: string) => {
  // login api call and dispatch
  dispatch(actions.loginRequested())
  axios.get('/api/login', { params: { username: iusername, password: ipassword}})
  .then(validateResponse)
  .then((authRecord: any) => {
    // use JWT expiration as cookie expiration
    let timeToExpire = authRecord.expires - Math.floor(Date.now() / 1000)
    let cookies = new Cookies()
    cookies.set(USER_COOKIE, authRecord, {maxAge: timeToExpire})
    dispatch(actions.loginSuccess(authRecord.user, authRecord.token, authRecord.roles))
  })
  .catch((err) => {
    // login API error
    dispatch(actions.loginFailure(err.message))
  })
}

export const logoutUser = (dispatch) => {
  dispatch(actions.logoutRequested())
  // clear user cookie
  let cookies = new Cookies()
  cookies.remove(USER_COOKIE)
  dispatch(actions.logoutSuccess())
}

export const isSessionCookieValid = (): boolean => {
  let cookies = new Cookies()
  let userCookie = cookies.get(USER_COOKIE)
  if (userCookie !== undefined && isValidToken(userCookie['token'])) {
    return true
  }
  return false
}

export const getTokenFromCookie = (): string => {
  let cookies = new Cookies()
  return cookies.get(USER_COOKIE)['token']
}

export const getRolesFromCookie = (): [string] => {
  let cookies = new Cookies()
  return cookies.get(USER_COOKIE)['roles']
}

export const getUserFromCookie = (): User => {
  let cookies = new Cookies()
  let userCookie = cookies.get(USER_COOKIE)['user']
  let userData: User = Object.assign({}, emptyUser)
  if (userCookie !== undefined) {
    userData.id = userCookie['id']
    if (userCookie['name']) {
      userData.firstName = userCookie['name']['givenName']
      userData.lastName = userCookie['name']['familyName']
    }
    userData.displayName = userCookie['displayName']
    userData.gender = userCookie['gender']
    userData.emails = userCookie['emails']
    if (userCookie['photos'] && userCookie['photos'].length > 0) {
      userData.picture = userCookie['photos'][0].value
    }
  }
  return userData
}