import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as PropTypes from 'prop-types'
import { Overlay, Image, Popover, FormControl, FormControlProps, FormGroup, Row, Col, ImageProps } from 'react-bootstrap'
import moment = require('moment')
import DayPicker = require('react-day-picker')
const calanderIcon = require('../../imgs/calanderIcon.svg')

// ////////////////////////////////////////////////////////////////////////////
// DatePicker
// based on REACT-DAY-PICKER (http://react-day-picker.js.org/)
// exmples page: http://react-day-picker.js.org/examples/
//
// to modify styles - change: /styles/day-picker.scss
// ////////////////////////////////////////////////////////////////////////////
const DEFAULT_DATE_DISPLAY_FORMAT = 'DD/MM/YYYY'
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const localeUtils = {
  ...DayPicker.LocaleUtils,
  formatWeekdayShort: (weekday: number, locale: string) => WEEKDAYS_SHORT[weekday],
}

interface IDayPickerOverlayProps {
  id: string,
  dateFormat?: string,
  enabledDates?: Date[],
  onBeforeOpen?: () => void
}
interface IDayPickerOverlayState {
  showOverlay?: boolean,
  value?: string,
  selectedDay?: Date
}

export default class DayPickerOverlay extends React.Component<IDayPickerOverlayProps, IDayPickerOverlayState> {
  refInputField: any = null
  refCalendarIconDiv: any = null
  refCalendarIcon: any = null
  refContainerDiv: any = null

  dateDisplayFormat = this.props.dateFormat || DEFAULT_DATE_DISPLAY_FORMAT

  constructor(props) {
    super(props)
    this.handleInputClick = this.handleInputClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.togglePopUp = this.togglePopUp.bind(this)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.disabledDays = this.disabledDays.bind(this)

    this.state = {
      showOverlay: false,
      value: '',
      selectedDay: null
    }
  }

  // form validation context to manually trigger validation
  static contextTypes = {
    validForm: PropTypes.isRequired
  }

  // //////////////////////////////////////////////////////////////////////////
  // public APIs
  public reset = () => {
    this.setState({value: ''})
    if (this.context.validForm)
      this.context.validForm.validateField(this.props.id, '', this.refInputField)
  }
  // APIs - end

  disabledDays = (day: Date): boolean => {
    if (!this.props.enabledDates)
      return false

    let inList = this.props.enabledDates.find((value, i, arr) => {
      return moment(day).isSame(value, 'day')
    })
    return !inList
  }

  openDayPicker = () => {
    if (this.props.onBeforeOpen) {
      this.props.onBeforeOpen()
    }
    this.setState({ showOverlay: true })
  }

  closeDayPicker = () => {
    this.setState({ showOverlay: false })
  }

  togglePopUp = () => {
    if (this.state.showOverlay) {
      this.closeDayPicker()
    }
    else {
      this.openDayPicker()
    }
  }

  handleDayClick = (day: Date, modifiers: any, e: React.MouseEvent<HTMLDivElement>) => {
    // first cancel blur event timer to keep the date picker open...
    if (modifiers.disabled) {
      return
    }
    this.setState({
      value: moment(day).format(this.dateDisplayFormat),
      selectedDay: day,
      showOverlay: false,
    })

    if (this.context.validForm)
      this.context.validForm.validateField(this.props.id, day, this.refInputField)
  }

  handleInputClick: React.EventHandler<React.MouseEvent<React.ClassicComponent<ImageProps, {}>>> = (e: React.MouseEvent<React.ClassicComponent<ImageProps, {}>>) => {
    this.togglePopUp()
  }

  handleInputFocus: React.EventHandler<React.FocusEvent<React.Component<FormControlProps, {}>>> = (e: React.FocusEvent<React.Component<FormControlProps, {}>>) => {
    this.openDayPicker()
  }

  handleInputChange: React.EventHandler<React.FormEvent<React.Component<FormControlProps, {}>>> = (e: React.FormEvent<React.Component<FormControlProps, {}>>) => {
    // uncomment the following to enable field editing
    // this.setState({
    //   value: e.target['value']
    // })
  }

  componentWillUnmount() {
  }

  render() {
    return <div style={{ position: 'relative' }} ref={(el) => { this.refContainerDiv = el } }>
        <Row>
          <Col xs={10}>
            <FormControl
              type='text'
              id={this.props.id}
              ref={(el: React.Component<FormControlProps, {}>) => { this.refInputField = el } }
              placeholder={this.dateDisplayFormat}
              value={this.state.value}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
              />
          </Col>
          <Col xs={2} style={{ paddingLeft: '0', width: '0' }} ref={(el: React.Component<FormControlProps, {}>) => { this.refCalendarIconDiv = el } }>
            <Image src={calanderIcon} onClick={this.handleInputClick} ref={(el: React.Component<FormControlProps, {}>) => { this.refCalendarIcon = el } } />
          </Col>
        </Row>
      <Overlay  show={this.state.showOverlay} placement='bottom' container={this.refCalendarIconDiv} target={this.refCalendarIcon} animation={false} rootClose={true} onHide={this.closeDayPicker} >
        <div style={{ position: 'absolute' }} >
          <div className='DayPicker-arrow' id={this.props.id + '_arrow'}></div>
          <DayPicker
            onDayClick={this.handleDayClick}
            localeUtils={localeUtils}
            disabledDays={this.disabledDays}
            />
        </div>
      </Overlay>
    </div>
  }
}