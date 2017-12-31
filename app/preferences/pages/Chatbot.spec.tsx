import * as React from 'react'
import { Store } from 'redux'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as sinon from 'sinon'
import * as t from '../../common/testUtils.spec'
import { appStore, AppState } from '../../store/AppStore'
import Chatbot, { Chatbot as HomeView} from './Chatbot'

Enzyme.configure({ adapter: new Adapter() })

describe('<Home> tests', () => {

  beforeEach(() => {
  })

  afterEach(() => {
    t.resetStore()
  })

  it('renders <Home /> component', () => {
    const wrapper = t.mountWithMockStore(<HomeView  />)
    expect(wrapper.find(HomeView)).to.have.length(1)
  })

  it('performs action in <Home /> component', () => {
    // const wrapper = t.mountWithMockStore(<Home  />)
    // let sayBtn = wrapper.find('button#sayBtn')
    // expect(sayBtn).to.have.length(1)
    // sayBtn.simulate('click')

    // let toggleBtn = wrapper.find('button#toggleBtn')
    // expect(toggleBtn).to.have.length(1)
    // // toggleBtn.simulate('click')
    // expect(appStore.getState().preferences.clockColor, 'clock initial color is green').to.equal('green')
    // expect(appStore.getState().preferences.titleColor, 'title initial color is red').to.equal('red')
    // toggleBtn.simulate('click')
    // expect(appStore.getState().preferences.clockColor, 'clock color after first click').to.equal('blue')
    // expect(appStore.getState().preferences.titleColor, 'title color after first click').to.equal('blue')
    // toggleBtn.simulate('click')
    // expect(appStore.getState().preferences.clockColor, 'clock color after second click').to.equal('red')
    // expect(appStore.getState().preferences.titleColor, 'title color after second click').to.equal('red')
  })
})
