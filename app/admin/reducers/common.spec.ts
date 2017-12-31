import * as sinon from 'sinon'
import * as jwt from 'jsonwebtoken'
import * as c from './common'
import { User } from './main'
import { createTestStore } from '../../common/testUtils.spec'

let dummyJWTPayload = {
  sub: 'Test',
  scopes: ['ROLE1', 'ROLE2'],
  iss: 'SI&O R&D Digital',
  givenName: 'firstName',
  familyName: 'lastName',
  displayName: 'displayName',
  email: 'email@example.com'
}

let testUser = {
  id: '12345',
  name: {
    givenName: 'test',
    familyName: 'test'
  },
  displayName: 'test test',
  gender: 'Male',
  emails: ['test@email.com'],
  photos: ['test']
}

describe('admin/reducers/common tests', () => {
  describe('isValidToken() tests', () => {
    it('should return the correct ststau for invalid token', () => {
      expect(c.isValidToken('invalid_token')).to.be.false
    })
  })

  describe('loginUser() tests', () => {
    let server

    beforeEach(() => {
      server = sinon.fakeServer.create()
      server.respondImmediately = true
    })

    afterEach(function () {
      server.restore()
    })

    it('function loginUser() is available', () => {
      expect(c.loginUser).to.be.a('function')
    })

    it('function loginUser() is successful', (done) => {
      const signatureAlgorithm = 'HS512'
      const signatureSecret = 'dummyKey'
      let signedToken = jwt.sign(dummyJWTPayload, new Buffer(signatureSecret, 'base64'),
        { algorithm: signatureAlgorithm, expiresIn: '1h' })

      const okResponse = [
        200,
        { 'Content-type': 'application/json' },
        JSON.stringify({
          token: signedToken,
          user: testUser
        })
      ]
      server.respondWith('GET', '/api/login?username=username&password=password', okResponse)

      let testStore = createTestStore()
      let dispatchSpy = sinon.spy(testStore, 'dispatch')

      c.loginUser(testStore.dispatch, 'username', 'password')

      setTimeout(() => {
        expect(testStore.getState().auth.isAuthenticated).to.be.true
        expect(dispatchSpy.callCount).to.equal(2)

        let userFromCookie = c.getUserFromCookie()
        expect(userFromCookie.id).to.equal(testUser.id)
        expect(userFromCookie.firstName).to.equal(testUser.name.givenName)
        expect(userFromCookie.lastName).to.equal(testUser.name.familyName)

        // Logout user
        dispatchSpy.reset()
        c.logoutUser(testStore.dispatch)
        expect(dispatchSpy.callCount).to.equal(2)
        expect(testStore.getState().auth.isAuthenticated).to.be.false

        done()
      }, 0)
    })
  })
})
