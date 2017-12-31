import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppState, appStore } from '../../store/AppStore'
import { Form, FormProps, Overlay, Tooltip } from 'react-bootstrap'
import { actions } from '../reducers/validFormReducers'
import * as revalidator  from 'revalidator'
const css = require('./ValidForm.scss')

export const getFormFieldValue = (element): string | boolean | string[] => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].find((elm) => elm === element.tagName)) {
        switch (element.type) {
          case 'select-one':
            return element.value
          case 'select-multiple':
            return Array.prototype.map.call(element.selectedOptions, (elm) => {return elm.value})
          case 'checkbox':
           return element.checked
          case 'radio':
            if (element.checked) {
              return element.value
            }
            break
          default:
            return element.value
        }
      }
}

// ////////////////////////////////////////////////////////////////////////////
// FormForm - a form with validation enforcement
// using revalidator - https://github.com/flatiron/revalidator
//
// Mandatory to specify ID for each form field -
//   either <FormControl id='...' /> or
//   <FormGroup controlId='...' />
//
// customer components:
//  non native form elements can trigger the validation framework using shared
//  context:
//  this.context.validForm.validateField(id, value, target)
//
// props:
// - id (mandatory) - control unique ID
// - validationSchema - validation rules based on revalidator standard
// - onValidSubmit - invoked on submit of a valid form
// - onInvalidSumbit - invoked on submit of an invalid form
// ////////////////////////////////////////////////////////////////////////////

const InvalidTooltip = (props) => {
  let dimentions = props.target.getBoundingClientRect()
  let formDimentions = props.target.form.getBoundingClientRect()
  // calculate position of tooltip
  let positionLeft = dimentions.left - formDimentions.left
  let positionTop = dimentions.top - formDimentions.top + dimentions.height
  return <div className={css.invalidTooltip + ' ' + css.inline_info_icon} style={{left: positionLeft, top: positionTop}}>
          {props.children}
        </div>
}

interface IValidFormProps extends FormProps {
  id: string,
  validationSchema: {properties: any},
  onValidSubmit(Object): void,
  onInvalidSumbit?(errors: Object[]): void
}

interface IValidFormState {
  tooltips: IErrorElements[]
}

interface IErrorElements {
  error: {property: string, message: string},
  target: any
}

export default class ValidForm extends React.Component<IValidFormProps, IValidFormState> {
  constructor(props) {
    super(props)
    this.state = {tooltips: []}
    this.addVlidationErrorTooltips = this.addVlidationErrorTooltips.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onClick = this.onClick.bind(this)
    this.validateNativeField = this.validateNativeField.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onFormBlur = this.onFormBlur.bind(this)
  }

  // //////////////////////////////////////////////////////////////////////////
  // form validation context
  // to trigger manual validation for non native fields and custom events
  // APIs:
  // - validForm.validateField(controlId: string, controlValue: string | string[] | boolean | Date, target: any)
  //
  static childContextTypes = {
    validForm: PropTypes.object
  }

  getChildContext = () => {
    return {
      validForm: {
        validateField: this.customValidate.bind(this)
      }
    }
  }

  customValidate = (controlId: string, controlValue: string | string[] | boolean | Date, target: any) => {
    this.validateFormField(controlId, controlValue, target)
  }
  // //////////////////////////////////////////////////////////////////////////
  // PUBLIC APIS
  //
  public removeTooltipByFieldId = (fieldId: string) => {
    let tooltipIndex = this.state.tooltips.findIndex((tooltip) => {return(tooltip.error.property === fieldId)})
    if (tooltipIndex >= 0) {
      this.state.tooltips.splice(tooltipIndex, 1)
      this.setState({tooltips: this.state.tooltips})
    }
  }
  // //////////////////////////////////////////////////////////////////////////

  addVlidationErrorTooltips(target: any, errors: any[]) {
    let tooltips: IErrorElements[] = errors.map((err) => {
      let elm = target.elements[err.property]
      if (elm) { // must be...
        return {error: err, target: elm}
      }
      else throw new Error('Something went wrong!!')
    })
    this.setState({tooltips: tooltips})
  }

  handleFieldVlidationErrorTooltip(target: any, errors: any[]) {
    if (errors.length > 0) {
      // show only the first errors
      let tooltipIndex = this.state.tooltips.findIndex((value) => {return(value.target === target)})
      if (tooltipIndex >= 0) {
        this.state.tooltips.splice(tooltipIndex, 1, {error: errors[0], target: target})
      }
      else {
        this.state.tooltips.push({error: errors[0], target: target})
      }
      this.setState({tooltips: this.state.tooltips})
    }
    else {
      // no error - remove tooltip is exist
      let tooltipIndex = this.state.tooltips.findIndex((value) => {return(value.target === target)})
      if (tooltipIndex >= 0) {
        this.state.tooltips.splice(tooltipIndex, 1)
        this.setState({tooltips: this.state.tooltips})
      }
    }
  }

  updateStore(formId: string, controlId: string, controlValue: string | boolean | string[] | Date) {
    appStore.dispatch(actions.formFieldChanged(formId, controlId, controlValue))
    let updatedFormState = appStore.getState().forms[formId]
    // update the validity state of the entire form
    let formValidationResult = revalidator.validate(updatedFormState.values, this.props.validationSchema)
    appStore.dispatch(actions.formValidationChanged(this.props.id, formValidationResult.valid))
  }

  // validate native form control (input, select, checkbox etc...)
  validateNativeField = (target) => {
    let controlId = target.type === 'radio' ? target.name : target.id
    let controlValue = getFormFieldValue(target)
    let formId = this.props.id
    if (formId.length === 0) {
      throw new Error('Form ID is missing!, Please specify form ID')
    }

    this.validateFormField(controlId, controlValue, target)
  }

  // validate general field value and place tooltip near target dom element
  validateFormField = (controlId: string, controlValue: string | string[] | boolean | Date, tooltipTarget: any) => {
    this.updateStore(this.props.id, controlId, controlValue)
    // show tooltips
    let validationObject = {[controlId]: controlValue ? controlValue : undefined}
    let validationFieldSchema = {properties: {[controlId]: this.props.validationSchema.properties[controlId]}}
    if (validationFieldSchema.properties[controlId]) {
      let validationResult = revalidator.validate(validationObject, validationFieldSchema)
      this.handleFieldVlidationErrorTooltip(tooltipTarget, validationResult.errors)
    }
  }

  generateFormDataObject = (formHtmlElement: HTMLFormElement) => {
    return Array.prototype.reduce.call(formHtmlElement, (obj, elm) => {
      let controlId = elm.type === 'radio' ? elm.name : elm.id
      let controlValue = getFormFieldValue(elm)
      if (controlValue) {
        obj[controlId] = controlValue
      }
      return obj
    },  {})
  }

  onFormChange = (e) => {
    this.validateNativeField(e.target)
  }

  onFormBlur = (e) => {
    this.validateNativeField(e.target)
  }

  onClick = (e) => {
    // this.setState({tooltips: []})
  }

  onSubmit = (e) => {
    e.preventDefault()
    let formObject = appStore.getState().forms[this.props.id].values
    // let formObject = formToDataObject(e.target)
    let validationResult = revalidator.validate(formObject, this.props.validationSchema)
    if (validationResult.valid) {
      this.props.onValidSubmit(formObject)
    }
    else {
      this.props.onInvalidSumbit && this.props.onInvalidSumbit(validationResult.errors)
      this.addVlidationErrorTooltips(e.target, validationResult.errors)
    }
  }

  componentDidMount() {
    let formHtmlElement = ReactDOM.findDOMNode(this) as HTMLFormElement
    let initialFormDataObject = this.generateFormDataObject(formHtmlElement)

    appStore.dispatch(actions.formInitialized(this.props.id, initialFormDataObject))
  }

  componentWillUnmount() {
    appStore.dispatch(actions.formTerminated(this.props.id))
  }

  render() {
    let tooltips = this.state.tooltips.map((elm) => {
      return <Overlay show={true} target={() => elm.target} container={this} key={elm.error.property} >
               <InvalidTooltip target={elm.target}>{elm.error.property + ' ' + elm.error.message}</InvalidTooltip>
             </Overlay>
    })
    let formProps: FormProps = Object.assign({}, this.props)
    delete formProps['validationSchema']
    delete formProps['onValidSubmit']
    delete formProps['onInvalidSumbit']
    return <Form {...formProps} onSubmit={this.onSubmit} onClick={this.onClick} onChange={this.onFormChange.bind(this)} onBlur={this.onFormBlur.bind(this)} style={{position: 'relative'}}>
              {this.props.children}
              {tooltips}
           </Form>
  }
}

// ////////////////////////////////////////////////////////////////////////////
// costom non native form field wrapper
// ////////////////////////////////////////////////////////////////////////////
interface IValidFieldProps {
  changeMethodName: string,
  valuePropName: string
}
interface IValidFieldState {}

export class ValidField extends React.Component<IValidFieldProps, IValidFieldState> {
  constructor(props) {
    super(props)
    // let customProps = this.props.changeMethodName
  }

  componentDidMount() {
  }

  componentWillMount() {
    React.cloneElement(React.Children.only(this.props.children))
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
