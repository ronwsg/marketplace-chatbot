import * as React from 'react'
import { Provider } from 'react-redux'
import { appStore, appReducers } from '../../store/AppStore'
import * as sinon from 'sinon'
import { expect } from 'chai'
import authorized, { RBA } from './RoleAwareComponent'
import { actions, emptyUser } from '../../admin/reducers/main'
import { mountWithMockStore, createTestStore, resetStore } from '../testUtils.spec'

class DummyComponent extends React.Component<{}, {}> {
  render() {
    return <div id={'authorized_div'}></div>
  }
}

let testStore

describe('<RoleAwareComponent> tests', () => {
  describe('*** inner function tests()', () => {
    it('function authorized is available', () => {
      expect(authorized).to.be.a('function')
    })

    it('getGrantedRoles() should return the correct authorized roles...', () => {
      let mocked = sinon.mock(RBA)
      mocked.expects('retrieveRoleDefinition').returns({})
      expect(RBA.retrieveRoleDefinition()).to.deep.equal({})

      mocked.expects('retrieveRoleDefinition').returns({})
      expect(RBA.getGrantedRoles(['ROLE1'], 'func1')).to.be.empty

      mocked.expects('retrieveRoleDefinition').returns({})
      expect(RBA.getGrantedRoles([], 'func1')).to.be.empty

      mocked.expects('retrieveRoleDefinition').returns({ 'ROLE1': ['func1'] })
      let grantedRoles = RBA.getGrantedRoles(['ROLE1'], 'func1')
      expect(grantedRoles).to.have.length(1)
      expect(grantedRoles[0]).to.equal('ROLE1')

      mocked.expects('retrieveRoleDefinition').returns({ 'ROLE1': ['func1'], 'ROLE2': ['func1'], 'ROLE3': ['func1'] })
      grantedRoles = RBA.getGrantedRoles(['ROLE1', 'ROLE2'], 'func1')
      expect(grantedRoles).to.have.length(2)
      expect(grantedRoles).to.deep.equal(['ROLE1', 'ROLE2'])

      mocked.expects('retrieveRoleDefinition').returns({ 'ROLE1': ['func2'], 'ROLE2': ['func1'], 'ROLE3': ['func1'] })
      grantedRoles = RBA.getGrantedRoles(['ROLE1', 'ROLE2'], 'func1')
      expect(grantedRoles).to.have.length(1)
      expect(grantedRoles).to.deep.equal(['ROLE2'])

      mocked.restore()
    })
  })

  describe('*** authorized()', () => {
    beforeEach(() => {
      testStore = createTestStore()
    })

    afterEach(() => {
     resetStore()
    })

    it('RoleAwareComponent should be rendered only for authorized role...', () => {
      let AuthComponent = authorized('homepage-button', DummyComponent)
      // let wrapper = mount(<Provider store={appStore}><AuthComponent /></Provider>)
      let wrapper = mountWithMockStore(<AuthComponent />, testStore)

      expect(wrapper.find(AuthComponent)).to.have.length(1)
      // not yet authorized...
      expect(wrapper.find({ id: 'authorized_div' })).to.have.length(0)
      testStore.dispatch(actions.loginSuccess(emptyUser, '***dummy-token***', ['ROLE_CUSTOMER']))
      // authorizd now...
      expect(wrapper.update().find({ id: 'authorized_div' })).to.have.length(1)
    })

  })
})