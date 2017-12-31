import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button, Radio, Form, FormGroup, FormControl, Checkbox, InputGroup, Glyphicon, Overlay, Tooltip } from 'react-bootstrap'
import { mountWithMockStore, createTestStore } from '../testUtils.spec'
import ValidForm, { getFormFieldValue } from './ValidForm'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as Revalidator  from 'revalidator'

Enzyme.configure({ adapter: new Adapter() })

describe('ValidForm (form validation framework) tests', () => {
  describe('*** test formToDataObject()', () => {

    it('should build form object correctly...', () => {
      let event
      let wrapper = Enzyme.mount(<Form onSubmit={(e) => { event = e } } >
        <FormControl id='formControlsText' type='text' label='Text' placeholder='Enter text' />
        <FormControl id='formControlsEmail' type='email' label='Email address' placeholder='Enter email' />
        <FormControl id='formControlsPassword' type='password' label='Password' placeholder='Enter Password' />
        <Checkbox id='formControlsCheckbox'>check</Checkbox>
        <Button type='submit' id='button' />
      </Form>)

      let formControlsText = wrapper.find('input#formControlsText')
      formControlsText.simulate('change', {target: Object.assign(formControlsText.instance(), {value: 'text1'})})
      let formControlsEmail = wrapper.find('input#formControlsEmail')
      formControlsEmail.simulate('change', {target: Object.assign(formControlsEmail.instance(), {value: 'name@email.com'})})
      let formControlsCheckbox = wrapper.find('input#formControlsCheckbox')
      formControlsCheckbox.simulate('change', {target: Object.assign(formControlsCheckbox.instance(), {checked: true})})
      wrapper.find('form').simulate('submit')

      expect(getFormFieldValue(wrapper.find('input#formControlsText').instance())).to.equal('text1')
      expect(getFormFieldValue(wrapper.find('input#formControlsEmail').instance())).to.equal('name@email.com')
      expect(getFormFieldValue(wrapper.find('input#formControlsCheckbox').instance())).to.be.true
    })

    it('should handle radio buttons...', () => {
      let event
      let wrapper = Enzyme.mount(<Form onSubmit={(e) => { event = e } } >
        <FormGroup>
          <Radio inline id='radio1' name='myradio' value='1'>1</Radio>
          <Radio inline id='radio2' name='myradio' value='2'>2</Radio>
          <Radio inline id='radio3' name='myradio' value='3'>3</Radio>
        </FormGroup>
        <Button type='submit' id='button' />
      </Form>)
      let radio2 = wrapper.find('input#radio2')
      radio2.simulate('change', {target: Object.assign(radio2.instance(), {checked: true})})
      wrapper.find('form').simulate('submit')
      expect(getFormFieldValue(wrapper.find('input#radio2').instance())).to.equal('2')
    })

    it('should handle single select drop down lists...', () => {
      let event
      let wrapper = Enzyme.mount(<Form onSubmit={(e) => { event = e } } >
        <FormGroup>
          <FormControl id='dropDown1' componentClass='select' placeholder='select'>
            <option value='value1'>value1</option>
            <option value='value2'>value2</option>
            <option value='value3'>value3</option>
          </FormControl>
        </FormGroup>
      </Form>)

      let dropDown1 = wrapper.find('select#dropDown1')
      dropDown1.simulate('change', {target: Object.assign(dropDown1.instance(), {selectedIndex: 1})})
      wrapper.find('form').simulate('submit')
      expect(getFormFieldValue(wrapper.find('select#dropDown1').instance())).to.equal('value2')
    })

    it('should handle multi select drop down lists...', () => {
      let event
      let wrapper = Enzyme.mount(<Form onSubmit={(e) => { event = e } } >
        <FormGroup>
          <FormControl id='dropDown1' componentClass='select' multiple>
            <option value='value1'>value1</option>
            <option value='value2'>value2</option>
            <option value='value3'>value3</option>
          </FormControl>
        </FormGroup>
      </Form>)

      let option0 = wrapper.find('select#dropDown1').find('option').at(0)
      option0.simulate('change', {target: Object.assign(option0.instance(), {selected: false})})
      let option1 = wrapper.find('select#dropDown1').find('option').at(1)
      option1.simulate('change', {target: Object.assign(option1.instance(), {selected: true})})
      let option2 = wrapper.find('select#dropDown1').find('option').at(2)
      option2.simulate('change', {target: Object.assign(option2.instance(), {selected: true})})
      wrapper.find('form').simulate('submit')

      expect(getFormFieldValue(wrapper.find('select#dropDown1').instance())).to.have.deep.equal(['value2', 'value3'])
    })

    it('should handle Textareas...', () => {
      let event
      let wrapper = Enzyme.mount(<Form onSubmit={(e) => { event = e } } >
        <FormGroup>
          <FormGroup controlId='formControlsTextarea'>
            <FormControl componentClass='textarea' placeholder='textarea' />
          </FormGroup>
        </FormGroup>
      </Form>)

      wrapper.find('textarea#formControlsTextarea').instance()['value'] = 'text1'
      wrapper.find('form').simulate('submit')
      expect(getFormFieldValue(wrapper.find('textarea#formControlsTextarea').instance())).to.equal('text1')
    })
  })

  describe('*** test validation errors tooltips', () => {
    it('should add validation tooltips...', () => {
      const schema = {
        properties: {
          formControlsText: {
            required: true,
            type: 'string',
            format: 'string',
            description: 'field description',
            minLength: 4
          },
          formControlsEmail: {
            required: true,
            type: 'string',
            format: 'email',
            description: 'field description'
          }
        }
      }

      let wrapper = mountWithMockStore(<ValidForm id='testForm' validationSchema={schema} onValidSubmit={(e) => { } } >
        <FormControl id='formControlsText' type='text' label='Text' placeholder='Enter text' />
        <FormControl id='formControlsEmail' type='email' label='Email address' placeholder='Enter email' />
      </ValidForm>)

      let input_txt = wrapper.find('input#formControlsText')
      let input_email = wrapper.find('input#formControlsEmail')

      // input_txt.instance().value = 'tex'
      // input_email.instance().value = 'wrong_email'
      input_txt.simulate('change', {target: Object.assign(input_txt.instance(), {value: 'tex'})})
      input_email.simulate('change', {target: Object.assign(input_email.instance(), {value: 'wrong_email'})})

      // expect 2 validation errors
      expect(wrapper.find(Overlay)).to.have.length(2)
      wrapper.find('form').simulate('submit')
      // expect still 2 validation errors
      expect(wrapper.find(Overlay)).to.have.length(2)

      input_txt.simulate('change', {target: Object.assign(input_txt.instance(), {value: 'longer_text'})})
      wrapper.find('form').simulate('submit')
      // expect 1 validation error
      expect(wrapper.find(Overlay)).to.have.length(1)
      // remove the last overlay using form API
      let form = wrapper.find(ValidForm).instance() as ValidForm
      form.removeTooltipByFieldId('formControlsEmail')
      expect(wrapper.update().find(Overlay)).to.have.length(0)
    })
  })

  describe('*** Test field by field validation', () => {
    it('should validate single form field...', () => {
      const schema = {
        properties: {
          formControlsText: {
            required: true,
            type: 'string',
            format: 'string',
            description: 'field description',
            minLength: 4
          },
          formControlsEmail: {
            required: true,
            type: 'string',
            format: 'email',
            description: 'field description'
          }
        }
      } as Revalidator.JSONSchema<any>

      let validationResult = Revalidator.validate({formControlsText: 'abcdef'}, {properties: {formControlsText: {...schema.properties.formControlsText}}})
      expect(validationResult.valid).to.be.true
    })
  })
})
