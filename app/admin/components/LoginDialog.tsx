import * as React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, FormControl, ButtonProps } from 'react-bootstrap'
import { actions, User, loginUser } from '../reducers/main'
import { AppState } from '../../store/AppStore'
import ValidForm from '../../common/components/ValidForm'
const fbImage = require('./FB-f-Logo__blue_29.png')
const googleImage = require('./Google_plus_29.png')

const FLD_USERNAME = 'username'
const FLD_PASSWORD = 'password'

const validationSchema = {
  properties: {
    username: {
      required: true,
      type: 'string',
      format: 'email',
      description: 'The username field, email address which identifies the user',
      minLength: 6
    },
    password: {
      required: true,
      type: 'string',
      description: 'The password field, minimum of 4 letters',
      minLength: 4
    }
  }
}

let login = (dispatch: any, username: string, password: string) => {
  loginUser(dispatch, username, password)
}

interface IProps {
  open?: boolean,
  form?: any,
  handleClose?: React.MouseEventHandler<React.ClassicComponent<ButtonProps, Object>>,
  handleLogin?: (u: string, p: string) => void,
}

interface IState {
  username?: string,
  password?: string
}

export class LoginDialog extends React.Component<IProps, IState> {
  constructor(props, context) {
    super(props)
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value })
  }

  loginInvoker = () => {
    if (!this.state || !this.state.username || !this.state.password) {
      alert('Missing username or password!')
    }
    else {
      this.props.handleLogin(this.state.username, this.state.password)
    }
  }

  render() {
    return (
      <Modal
        title='Login'
        onHide={this.props.handleClose}
        show={this.props.open} >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <ValidForm id='loginForm' validationSchema={validationSchema} onValidSubmit={this.loginInvoker}>
          <Modal.Body>
            <h4>Please enter your email address and password.</h4>
            <br />
            <FormControl id={FLD_USERNAME} type='text' placeholder='Email address' onChange={this.handleUsernameChange} />
            <br />
            <FormControl id={FLD_PASSWORD} type='password' placeholder='Password' onChange={this.handlePasswordChange} />
            <br /><br /><br />
            <Button bsStyle='primary' href='/auth/facebook'>
              <img src={fbImage} /> Login with Facebook
              </Button>
            &nbsp;
              <Button bsStyle='danger' href='/auth/google'>
              <img src={googleImage} /> Login with Google
              </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.handleClose}>Cancel</Button>
            <Button id='loginButton' bsStyle='success' disabled={!this.props.form || !this.props.form.valid} type='submit'>Login</Button>
          </Modal.Footer>
        </ValidForm>
      </Modal>
    )
  }
}

// =======> CONNECT <=======
interface IStateProps {
}

interface IDispatchProps {
}

const mapStateToProps = (state: AppState) => ({
  open: state.auth.open,
  form: state.forms['loginForm']
})

const mapDispatchToProps = (dispatch) => {
  return {
    handleClose: (event) => {
      dispatch(actions.closeLoginDialog())
    },
    handleLogin: (username: string, password: string) => {
      login(dispatch, username, password)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog)
