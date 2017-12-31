import * as React from 'react'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import {PageHeader, Glyphicon, Image} from 'react-bootstrap'
import { AppState } from '../../store/AppStore'
import LanguageSelector from '../../common/components/LanguageSelector'
import LoginDialog from '../../admin/components/LoginDialog'
import LogoutButton from '../../admin/components/LogoutButton'
import LoginButton from '../../admin/components/LoginButton'
import Breadcrumbs from '../../common/components/Breadcrumbs'
const css = require('./AppDesktop.scss')
const bgImg = require('../../imgs/bg.jpg')
const botImg = require('../../imgs/bot.png')

interface IProps {
  userDisplayName: string,
  userId: string,
  userImage: string,
  isAuthenticated: boolean,
  routes: [any]
}
interface IState {
  isDrawerOpen: boolean
}

export class AppDesktop extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      isDrawerOpen: false,
    }
  }

  gotoPage(path: string) {
    this.setState({ isDrawerOpen: false })
    browserHistory.push(path)
  }

  toggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen })
  }

  render() {
    return <div>
          <div className={css.desktop}>
            <div className={css.title}>
              SMB Marketplace<br/>Next Gen<br/>
              <button onClick={() => {
                  let win = window.open('/chatbot', 'chatbot', ' scrollbars=yes,menubar=no,width=375,height=667,top=30,left=30,resizable=yes,toolbar=no,location=no,status=no')
                }}>
                <Image src={botImg}/>
              </button>
            </div>
            {/* {this.props.children} */}
          </div>
        </div>
  }
}
// =======> CONNECT <=======
const mapStateToProps = (state: AppState) => ({
  userDisplayName: state.auth.user.displayName,
  userId: state.auth.user.id,
  userImage: state.auth.user.picture,
  isAuthenticated: state.auth.isAuthenticated
})

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDesktop)
