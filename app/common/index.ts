import { Reducer, AnyAction } from 'redux'

// Create a new reducer function
// clones the original state and invokes a callback to set the new state values
export function createReducer<S, A extends AnyAction>(setNewState: (newState: S, action: A) => void): Reducer<S> {
  let fn = (state: S, action: A) => {
    let newState = Object.assign({}, state)
    setNewState(newState, action)
    return newState
  }
  return fn
}