import * as React from 'react'
import { connect } from 'react-redux'
import {NavDropdown, MenuItem} from 'react-bootstrap'
import { updateIntlAction } from '../reducers/I18nReducer'
import {AppState} from '../../store/AppStore'

const en = require('../../i18n/en-US.json')
const fr = require('../../i18n/fr.json')
const translation = { 'en-US': en, fr }
const languages = { 'en-US': 'English', fr: 'French' }

interface Props {
  updateIntl?: React.MouseEventHandler<NavDropdown>,
  locale?: string
}

interface State {
}

class LanguageSelector extends React.Component<Props, State> {
  render() {
    return(
      <NavDropdown eventKey={3} title={languages[this.props.locale]} id='language-nav-dropdown' onSelect={this.props.updateIntl}>
        <MenuItem eventKey={'en-US'}>English</MenuItem>
        <MenuItem eventKey={'fr'}>French</MenuItem>
      </NavDropdown>
    )
  }
}

// =======> CONNECT <=======
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.intl.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateIntl: (e) => {
      dispatch(updateIntlAction(e, translation[e]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null)(LanguageSelector)