import {createStore, combineReducers, Reducer, Store} from 'redux'
import {PreferencesState, preferencesReducer} from '../preferences/reducers/main'
import {AuthState, adminReducer} from '../admin/reducers/main'
import {IIntlState, intlReducer} from '../common/reducers/I18nReducer'
import {IFormsState, formsReducer} from '../common/reducers/validFormReducers'

export interface AppState {
    preferences: PreferencesState
    auth: AuthState
    intl: IIntlState
    forms: IFormsState
}

export const appReducers: Reducer<AppState> = combineReducers<AppState>({
    preferences: preferencesReducer,
    auth: adminReducer,
    intl: intlReducer,
    forms: formsReducer
})

export let appStore: Store<AppState> = createStore<AppState>(appReducers, window['devToolsExtension'] && window['devToolsExtension']())
