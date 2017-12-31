import * as React from 'react'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { createTestStore, mountWithMockStore } from '../../common/testUtils.spec'
import AppContainer from './AppContainer'

Enzyme.configure({ adapter: new Adapter() })

describe('<AppContainer> component tests', () => {
  it('should render <AppContainer> correctly...', () => {
    let wrapper = mountWithMockStore(<AppContainer />)
    expect(wrapper.find(AppContainer)).to.have.length(1)
  })
})
