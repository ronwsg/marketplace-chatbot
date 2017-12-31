import * as c from './changeTitleColor'
// import {changeLocaleAction, CHANGE_LOCALE, changeLocaleReducer} from './changeLocale'
import { Action, Reducer } from 'redux'

export interface PreferencesState {
    locale: string
    titleColor: string
    clockColor: string
}

let initialState: PreferencesState = {
    locale: 'en',
    titleColor: 'red',
    clockColor: 'green',
}

const reducers: { name: string, reducer: Function } | {} = {
    // [CHANGE_LOCALE]: changeLocaleReducer,
    [c.CHANGE_TITLE_COLOR]: c.changeTitleAndClockColorReducer,
}

export const actions = {
    // changeLocale: changeLocaleAction, <-- replaced by a new i18n framework
    changeTitleAndClockColor: c.changeTitleAndClockColorAction,
}

export const preferencesReducer: Reducer<PreferencesState> = (state: PreferencesState = initialState, action: Action): PreferencesState => {
    let reducer = reducers[action.type]
    if (reducer) {
        return reducer(state, action)
    }

    return state
}
