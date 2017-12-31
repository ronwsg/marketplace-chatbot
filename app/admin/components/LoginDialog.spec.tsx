import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as sinon from 'sinon'
import { appStore } from '../../store/AppStore'
import { createTestStore, mountWithMockStore } from '../../common/testUtils.spec'
import LoginDialog, { LoginDialog as LoginDialogView } from './LoginDialog'
import { actions } from '../reducers/main'

Enzyme.configure({ adapter: new Adapter() })

describe('<LoginDialog> tests', () => {
  it('renders <LoginDialog /> component', () => {
    const wrapper = Enzyme.mount(<LoginDialogView open={true} form={{valid: true}} handleClose={() => {}} handleLogin={(u, p) => {}} />)
    expect(wrapper.find(LoginDialogView)).to.have.length(1)
    // using document querySelector since the overlay is not rendered regularly at the dom tree
    expect(document.querySelector('#username'), 'username field').to.not.be.null
    expect(document.querySelector('#password'), 'password field').to.not.be.null
    expect(document.querySelector('#loginButton'), 'login button').to.not.be.null
  })

  it('renders connected <LoginDialog /> component', () => {
    const wrapper = mountWithMockStore(<LoginDialog />)
    expect(wrapper.find(LoginDialog)).to.have.length(1)
    // using document querySelector since the overlay is not rendered regularly at the dom tree
    expect(document.querySelector('#username'), 'username field').to.not.be.null
    expect(document.querySelector('#password'), 'password field').to.not.be.null
    expect(document.querySelector('#loginButton'), 'login button').to.not.be.null
  })

  it('should show LoginDialog modal', () => {
    let callback = sinon.spy()
    let mountPoint = document.createElement('div')
    document.body.appendChild(mountPoint)
    let instance = ReactDOM.render(<LoginDialogView open={true} form={{valid: true}} handleClose={() => {}} handleLogin={callback}/>, mountPoint) as LoginDialogView

    instance.loginInvoker()
    expect(callback.called, 'login invoked').to.be.false

    instance.handleUsernameChange({target: {value: 'user'}})
    expect(instance.state.username, 'username value').to.equal('user')
    instance.handlePasswordChange({target: {value: 'pass'}})
    expect(instance.state.password, 'password value').to.equal('pass')

    instance.loginInvoker()
    expect(callback.called, 'login invoked').to.be.true
  })
})
