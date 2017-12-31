import { createTestStore } from '../../common/testUtils.spec'
import { actions } from './main'

describe('change title color REDUCERS tests', () => {
  it('should have the correct color after dispatch...', () => {
      let store = createTestStore()
      store.dispatch(actions.changeTitleAndClockColor('red'))

      expect(store.getState()).to.have.nested.property('preferences.clockColor')
      expect(store.getState()).to.have.nested.property('preferences.clockColor', 'red')
    })
})
