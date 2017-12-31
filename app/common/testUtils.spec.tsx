import * as React from 'react'
import { createStore, Store } from 'redux'
import { AppState, appStore, appReducers } from '../store/AppStore'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { ConnectedIntlProvider } from './reducers/I18nReducer'
import { Provider as ReduxProvider } from 'react-redux'

Enzyme.configure({ adapter: new Adapter() })

const initialState = appStore.getState()

export const createTestStore = (state?: AppState): Store<AppState> => {
    if (state) {
        const stateMerged: AppState = Object.assign(initialState, state)
        return createStore<AppState>(appReducers, stateMerged)
    }
    else {
        return createStore<AppState>(appReducers)
    }
}

export function mountWithMockStore<P, S>(element: any, testStore?: Store<AppState>): Enzyme.ReactWrapper<P, S> {
    // let testStore = createTestStore(state)
    return Enzyme.mount<P, S>(
        <ReduxProvider store={ testStore ? testStore : appStore } >
            <ConnectedIntlProvider>
                {element}
            </ConnectedIntlProvider>
        </ReduxProvider>)
}

export function renderWithMockStore<P, S>(element: any, testStore?: Store<AppState>): Cheerio {
    // let testStore = createTestStore(state)
    return Enzyme.render<P, S>(
        <ReduxProvider store={ testStore ? testStore : appStore } >
            <ConnectedIntlProvider>
                {element}
            </ConnectedIntlProvider>
        </ReduxProvider>)
}

export const resetStore = () => {
    // reset application state to its initial state
    appReducers(undefined, { type: 'DUMMY' })
}

const findRoute = (path: string, routes: any[]) => {
  return routes.find((val) => {
    return (val.path === path)
  })
}
