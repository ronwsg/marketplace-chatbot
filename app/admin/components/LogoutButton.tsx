import * as React from 'react'
import { connect } from 'react-redux'
import {Glyphicon} from 'react-bootstrap'
import * as cookie from 'react-cookie'
import {AuthState, logoutUser} from '../reducers/main'

interface Props {
  handleLogout?: React.MouseEventHandler<HTMLSpanElement>,
}

interface State {
}

export class LogoutButton extends React.Component<Props, State> {
  render() {
    return (
      <span onClick={this.props.handleLogout}>
        <Glyphicon glyph='log-out'/> Logout
      </span>
    )
  }
}

// =======> CONNECT <=======
const mapStateToProps = (state: AuthState) => ({
})

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: (event: React.MouseEvent<HTMLSpanElement>) => {
      logoutUser(dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null)(LogoutButton)
