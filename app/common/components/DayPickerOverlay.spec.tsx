import * as React from 'react'
import { Provider } from 'react-redux'
import { appStore } from '../../store/AppStore'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { mountWithMockStore, createTestStore } from '../testUtils.spec'
import DayPickerOverlay from './DayPickerOverlay'
import ValidForm from './ValidForm'
import * as sinon from 'sinon'
import * as ReactTestUtils from 'react-dom/test-utils'
import * as ReactDOM from 'react-dom'
import { Overlay } from 'react-bootstrap'
import DayPicker = require('react-day-picker')

Enzyme.configure({ adapter: new Adapter() })

describe('DayPickerOverlay tests', () => {
  let wrapper, refDayPicker

  beforeEach(() => {
    wrapper = Enzyme.mount(<ValidForm id='testForm' validationSchema={{properties: {}}} onValidSubmit={(e) => { }} >
                      <DayPickerOverlay id='datepicker_1' dateFormat='YYYY/MM/DD' ref={(el) => {refDayPicker = el}} />
                    </ValidForm>, { attachTo: document.body })
  })

  it('component should mount as standalone', () => {
    expect(wrapper.find('input#datepicker_1')).to.have.length(1)
    expect(wrapper.find('input#datepicker_1').instance().value).to.be.empty
  })

  it('component placeholder should show date format', () => {
    expect(wrapper.find('input#datepicker_1')).to.have.length(1)
    expect(wrapper.find('input#datepicker_1').instance().placeholder).to.equal('YYYY/MM/DD')
  })

  it('should be able to select a day', () => {
    let spy = sinon.spy(wrapper.find(DayPickerOverlay).instance(), 'openDayPicker')
    expect(wrapper.find('input#datepicker_1')).to.have.length(1)
    expect(wrapper.find('input#datepicker_1').instance().placeholder).to.equal('YYYY/MM/DD')
    expect(wrapper.find('img')).to.have.length(1)
    wrapper.find('img').simulate('click')
    expect(spy.calledOnce).to.equal(true)
    expect(wrapper.find(Overlay), 'Overlay exists...').to.have.length(1)
    // using document querySelector since the overlay is not rendered regularly at the dom tree
    expect(document.querySelector('#datepicker_1_arrow'), 'should show an arrow').to.not.be.null
    expect(document.querySelector('.DayPicker-Day'), 'should show day columns').to.not.be.null
    // dayElements[0].simulate('click')
  })

  it('Should show after click trigger', () => {
    const icon = ReactDOM.findDOMNode(refDayPicker.refCalendarIcon)
    ReactTestUtils.Simulate.click(icon)

    refDayPicker.state.showOverlay.should.be.true
  })

})
