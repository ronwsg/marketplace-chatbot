import * as React from 'react'
import { Action } from 'redux'
import * as c from './'

describe('common tests', () => {
  it('createReducer() tests', () => {
    interface ITestState {payload: string}
    let TestState: ITestState = {
      payload: null
    }
    let testAction: Action = {
      type: 'TEST'
    }
    let reducer = c.createReducer<ITestState, Action>((newState) => {
      newState.payload = 'value'
    })

    expect(reducer(TestState, testAction)).to.deep.equal({payload: 'value'})
  })
})