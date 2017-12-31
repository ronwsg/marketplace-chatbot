import * as React from 'react'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as sinon from 'sinon'
import { LoginButton } from './LoginButton'

Enzyme.configure({ adapter: new Adapter() })

describe('<LoginButton> tests', () => {
  it('renders <LoginButton /> component', () => {
    let clickHandler = sinon.spy()
    const wrapper = Enzyme.mount(<LoginButton handleOpen={clickHandler}/>)
    expect(wrapper.find(LoginButton)).to.have.length(1)

    wrapper.find(LoginButton).simulate('click')
    expect(clickHandler.calledOnce).to.be.true
  })
})
