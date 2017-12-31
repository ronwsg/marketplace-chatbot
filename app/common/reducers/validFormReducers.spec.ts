import * as r from './validFormReducers'
import { createTestStore } from '../testUtils.spec'

describe('ValidForm (form validation framework) REDUCERS tests', () => {
  describe('*** test Form Initialized Action', () => {
    it('should have from representation in application state after initialization...', () => {
      let store = createTestStore()
      store.dispatch(r.formInitializedAction('form_1', {field1: 'value1'}))

      expect(store.getState()).to.have.nested.property('forms.form_1')
      expect(store.getState()).to.have.nested.property('forms.form_1.values')
      expect(store.getState()).to.have.nested.property('forms.form_1.values.field1', 'value1')
      expect(store.getState()).to.have.nested.property('forms.form_1.validated', false)
      expect(store.getState()).to.have.nested.property('forms.form_1.valid', false)
    })

    it('should have field value in application state after field change...', () => {
      let store = createTestStore()
      store.dispatch(r.formInitializedAction('form_1', {}))
      store.dispatch(r.formFieldChangedAction('form_1', 'field_1', 'value_1'))

      expect(store.getState()).to.have.nested.property('forms.form_1')
      expect(store.getState()).to.have.nested.property('forms.form_1.values.field_1', 'value_1')
      expect(store.getState()).to.have.nested.property('forms.form_1.validated', false)
      expect(store.getState()).to.have.nested.property('forms.form_1.valid', false)
    })

    it('should have form validation status in application state after validation failure...', () => {
      let store = createTestStore()
      store.dispatch(r.formInitializedAction('form_1', {}))
      store.dispatch(r.formValidationChangedAction('form_1', false))

      expect(store.getState()).to.have.nested.property('forms.form_1')
      expect(store.getState()).to.have.nested.property('forms.form_1.validated', true)
      expect(store.getState()).to.have.nested.property('forms.form_1.valid', false)
    })

    it('should have form validation status in application state after validation success...', () => {
      let store = createTestStore()
      store.dispatch(r.formInitializedAction('form_1', {}))
      store.dispatch(r.formValidationChangedAction('form_1', true))

      expect(store.getState()).to.have.nested.property('forms.form_1')
      expect(store.getState()).to.have.nested.property('forms.form_1.validated', true)
      expect(store.getState()).to.have.nested.property('forms.form_1.valid', true)
    })
  })
})