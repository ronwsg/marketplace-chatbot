import * as React from 'react'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { createTestStore, mountWithMockStore } from '../../common/testUtils.spec'
import {AppDesktop} from './AppDesktop'
import LoginDialog from '../../admin/components/LoginDialog'

Enzyme.configure({ adapter: new Adapter() })

describe('<AppDesktop> component tests', () => {
  it('should render <AppDesktop> correctly...', () => {
    let wrapper = mountWithMockStore(<AppDesktop routes={['rout1']} userDisplayName='test' userId='test' userImage='test' isAuthenticated={false} />)
    expect(wrapper.find(LoginDialog)).to.have.length(1)
  })
})
