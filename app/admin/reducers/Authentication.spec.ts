import * as sinon from 'sinon'
import axios from 'axios'
import { AuthState, User, emptyUser } from './main'
import * as r from './Authentication'
import { createTestStore } from '../../common/testUtils.spec'

const HTTP_AUTH_HEADER_PREFIX = 'Bearer '

const testUser: User = {
  id: '111',
  firstName: 'John',
  lastName: 'Smith',
  displayName: 'John Smith',
  gender: 'Male',
  emails: ['john@example.com'],
  picture: 'http://mypic.html',
}

const testToken = 'jkghjkhgfjhgfhjgfhjgfjhgfhjf'
const testRoles: [string] = ['ROLE1', 'ROLE2']
const loginErrorTestMessage = 'Login Error!!'

describe('Authentication REDUCERS tests', () => {
  describe('*** test Login Dialog actions', () => {
    it('should have the correct login dialog status on open/close actions', () => {
      let store = createTestStore()
      console.log('################################################### STATE: ', JSON.stringify(store.getState()))
      expect(store.getState()).to.have.nested.property('auth.open')
      expect(store.getState()).to.have.nested.property('auth.open', false)
      store.dispatch(r.openLoginDialogAction())
      expect(store.getState()).to.have.nested.property('auth.open')
      expect(store.getState()).to.have.nested.property('auth.open', true)
      store.dispatch(r.closeLoginDialogAction())
      expect(store.getState()).to.have.nested.property('auth.open')
      expect(store.getState()).to.have.nested.property('auth.open', false)
    })
  })

  describe('*** test Login actions', () => {
    it('should have the correct login/logout request status', () => {
      let store = createTestStore()
      expect(store.getState()).to.have.nested.property('auth.loggingIn')
      expect(store.getState()).to.have.nested.property('auth.loginError')
      expect(store.getState()).to.have.nested.property('auth.loggingIn', false)
      expect(store.getState()).to.have.nested.property('auth.loginError', null)
      store.dispatch(r.loginRequestedAction())
      expect(store.getState()).to.have.nested.property('auth.loggingIn', true)
      expect(store.getState()).to.have.nested.property('auth.loginError', null)
      store.dispatch(r.loginSuccessAction(testUser, testToken, testRoles))
      expect(store.getState()).to.have.nested.property('auth.loggingIn', false)
      expect(store.getState()).to.have.nested.property('auth.loginError', null)
      expect(store.getState()).to.have.nested.property('auth.isAuthenticated', true)
      expect(store.getState()).to.have.nested.property('auth.token', testToken)
      expect(store.getState()).to.have.nested.property('auth.user')
      expect(store.getState().auth.user).to.deep.equal(testUser)
      store.dispatch(r.logoutRequestedAction())
      expect(store.getState()).to.have.nested.property('auth.loggingOut', true)
      store.dispatch(r.logoutSuccessAction())
      expect(store.getState()).to.have.nested.property('auth.loggingOut', false)
      expect(store.getState()).to.have.nested.property('auth.user')
      expect(store.getState().auth.user).to.deep.equal(emptyUser)
      expect(store.getState()).to.have.nested.property('auth.isAuthenticated', false)
      expect(store.getState()).to.have.nested.property('auth.token', null)
    })

    it('should have the correct login request status (RAINY DAY)', () => {
      let store = createTestStore()
      store.dispatch(r.loginRequestedAction())
      store.dispatch(r.loginFailureAction(loginErrorTestMessage))
      expect(store.getState()).to.have.nested.property('auth.loggingIn', false)
      expect(store.getState()).to.have.nested.property('auth.loginError', loginErrorTestMessage)
    })
  })

  describe('*** test Authorization HTTP Header interceptor', () => {
    let server

    beforeEach(() => {
      server = sinon.fakeServer.create()
      server.respondImmediately = true
      server.respondWith('GET', '/foo',
        [200, { 'Content-Type': 'application/json' },
          '{"message":"foo"}'])
    })

    afterEach(function () {
      server.restore()
    })

    it('should have auth token in HTTP header', (done) => {
      let store = createTestStore()
      store.dispatch(r.loginRequestedAction())
      store.dispatch(r.loginSuccessAction(testUser, testToken, testRoles))

      axios.interceptors.request.use((config) => {
        let HTTP_AUTH_HEADER_PREFIX = 'Bearer '
        let authToken = store.getState().auth.token
        if (authToken) {
          config.headers.common['Authorization'] = HTTP_AUTH_HEADER_PREFIX + authToken
        }
        return config
      }, (error) => {
        return Promise.reject(error)
      })

      axios.get('/foo')

      setTimeout(() => {
        let authorizationHeader = server.requests[0].requestHeaders.Authorization
        expect(authorizationHeader).to.equal(HTTP_AUTH_HEADER_PREFIX + testToken)
        done()
      }, 0)
    })
  })
})