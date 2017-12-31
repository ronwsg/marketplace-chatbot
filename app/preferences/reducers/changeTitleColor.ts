import { Action, Reducer } from 'redux'
import { PreferencesState } from './main'
export const CHANGE_TITLE_COLOR = 'CHANGE_TITLE_COLOR'

interface ChangeTitleColor extends Action {
    color: string
}

export function changeTitleAndClockColorAction(color: string) {
    return <ChangeTitleColor>{
        type: CHANGE_TITLE_COLOR,
        color: color,
    }
}

export const changeTitleAndClockColorReducer: Reducer<PreferencesState> = (state: PreferencesState, action: ChangeTitleColor): PreferencesState => {
    let newState = Object.assign({}, state)

    newState.titleColor = action.color
    newState.clockColor = action.color

    return newState
}
