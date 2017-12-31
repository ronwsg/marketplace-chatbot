import * as React from 'react'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as sinon from 'sinon'
import { LogoutButton } from './LogoutButton'

Enzyme.configure({ adapter: new Adapter() })

describe('<LoginButton> tests', () => {
  it('renders <LoginButton /> component', () => {
    let clickHandler = sinon.spy()
    const wrapper = Enzyme.mount(<LogoutButton handleLogout={clickHandler}/>)
    expect(wrapper.find(LogoutButton)).to.have.length(1)

    wrapper.find(LogoutButton).simulate('click')
    expect(clickHandler.calledOnce).to.be.true
  })
})
