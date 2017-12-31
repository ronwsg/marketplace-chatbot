import {Action, Reducer} from 'redux'

export const FORM_INITIALIZED = 'FORM_INITIALIZED'
export const FORM_FIELD_CHANGED = 'FORM_FIELD_CHANGED'
export const FORM_VALIDATION_CHANGED = 'FORM_VALIDATION_CHANGED'
export const FORM_TERMINATED = 'FORM_TERMINATED'

interface FormField {
  [id: string]: string | string[] | boolean
}

export interface IFormsState {
  [formId: string]: {
    values?: {
      FormField?
    },
    validated: boolean,
    valid: boolean
  }
}

export const initialState: IFormsState = {
}

interface IFormInitialized extends Action {
  formId: string,
  initialValues?: { FormField? }
}

interface IFormFieldChanged extends Action {
  formId: string,
  fieldId: string,
  fieldValue: string | string[] | boolean
}

interface IFormValidationChanged extends Action {
  formId: string,
  valid: boolean
}

interface IFormTerminated extends Action {
  formId: string
}

export function formInitializedAction(formId: string, initialValues: Object): IFormInitialized {
  return <IFormInitialized>{
    type: FORM_INITIALIZED,
    formId: formId,
    initialValues: initialValues
  }
}

export function formFieldChangedAction(formId: string, fieldId: string, value: string | string[] | boolean | Date): IFormFieldChanged {
  return <IFormFieldChanged>{
    type: FORM_FIELD_CHANGED,
    formId: formId,
    fieldId: fieldId,
    fieldValue: value
  }
}

export function formValidationChangedAction(formId: string, valid: boolean): IFormValidationChanged {
  return <IFormValidationChanged>{
    type: FORM_VALIDATION_CHANGED,
    formId: formId,
    valid: valid
  }
}

export function formTerminatedAction(formId: string): IFormTerminated {
  return <IFormTerminated>{
    type: FORM_TERMINATED,
    formId: formId
  }
}

export let formInitializedReducer: Reducer<IFormsState> = (state: IFormsState, action: IFormInitialized): IFormsState  => {
  let newState: IFormsState = Object.assign({}, state)
  newState[action.formId] = {values:  Object.assign({}, action.initialValues), validated: false, valid: false}
  return newState
}

export let formFieldChangedReducer: Reducer<IFormsState> = (state: IFormsState, action: IFormFieldChanged): IFormsState => {
  let newState: IFormsState = Object.assign({}, state)
  if (!newState[action.formId]) {
    newState[action.formId] = {values: {}, validated: false, valid: false}
  }
  if (action.fieldValue)
    newState[action.formId].values[action.fieldId] = action.fieldValue
  else
    delete newState[action.formId].values[action.fieldId]
  return newState
}

export let formValidationChangedReducer: Reducer<IFormsState> = (state: IFormsState, action: IFormValidationChanged): IFormsState => {
  let newState: IFormsState = Object.assign({}, state)
  let newFormState = Object.assign({}, state[action.formId])
  newState[action.formId] = newFormState
  newState[action.formId].validated = true
  newState[action.formId].valid = action.valid
  return newState
}

export let formTerminatedReducer: Reducer<IFormsState> = (state: IFormsState, action: IFormTerminated): IFormsState => {
  let newState: IFormsState = Object.assign({}, state)
  delete newState[action.formId]
  return newState
}

const reducers = {
  [FORM_INITIALIZED]: formInitializedReducer,
  [FORM_FIELD_CHANGED]: formFieldChangedReducer,
  [FORM_VALIDATION_CHANGED]: formValidationChangedReducer,
  [FORM_TERMINATED]: formTerminatedReducer,
}

export const actions = {
  formInitialized: formInitializedAction,
  formFieldChanged: formFieldChangedAction,
  formValidationChanged: formValidationChangedAction,
  formTerminated: formTerminatedAction
}

export let formsReducer: Reducer<IFormsState> = (state: IFormsState = initialState, action: Action): IFormsState => {
  let reducer = reducers[action.type]
  if (reducer) {
      return reducer(state, action)
  }

  return state
}
