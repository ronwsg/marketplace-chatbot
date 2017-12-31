import { connect, ComponentClass } from 'react-redux'
import { Action, Reducer } from 'redux'
import { IntlProvider } from 'react-intl'
import * as React from 'react'
import { addLocaleData } from 'react-intl'
import * as en from 'react-intl/locale-data/en'
import * as fr from 'react-intl/locale-data/fr'

const enUS = require('../../i18n/en-US.json')

addLocaleData([...en, ...fr])

export const DEFAULT_LOCALE = 'en-US'
export const UPDATE_INTL = '@@intl/UPDATE'

export interface IIntlState {
  locale: string,
  messages: Object,
}

const initialState: IIntlState = {
  locale: 'en-US',
  messages: enUS
}

export interface UpdateIntl extends Action {
  locale: string,
  messages: Object,
}

export const updateIntlAction = (locale: string, messages: Object): UpdateIntl => ({
  type: UPDATE_INTL,
  locale: locale,
  messages: messages
})

export const  intlReducer: Reducer<IIntlState> = (state: IIntlState = initialState, action: UpdateIntl): IIntlState => {
  if (action.type !== UPDATE_INTL) {
    return state
  }

  let newState = Object.assign({}, state)
  newState.locale = action.locale
  newState.messages = action.messages
  return newState
}

// ConnectedIntlProvider
const mapStateToProps = (state): any => {
  return {
    locale: state.intl.locale,
    messages: state.intl.messages,
    key: state.intl.locale
  }
}

export const ConnectedIntlProvider: ComponentClass<IntlProvider.Props> = connect(mapStateToProps)(IntlProvider)