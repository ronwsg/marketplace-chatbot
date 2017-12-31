import * as React from 'react'
import { connect } from 'react-redux'
import {Button, Glyphicon, ButtonProps} from 'react-bootstrap'
import {AuthState, actions} from '../reducers/main'

interface Props {
  handleOpen?: React.MouseEventHandler<HTMLSpanElement>,
}

interface State {
}

export class LoginButton extends React.Component<Props, State> {
  render() {
    return (
      <span onClick={this.props.handleOpen}>
        <Glyphicon glyph='log-in'/> Login
      </span>
    )
  }
}

// =======> CONNECT <=======
const mapStateToProps = (state: AuthState) => ({
})

const mapDispatchToProps = (dispatch) => {
  return {
    handleOpen: (event: React.MouseEvent<HTMLSpanElement>) => {
      dispatch(actions.openLoginDialog())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null)(LoginButton)
