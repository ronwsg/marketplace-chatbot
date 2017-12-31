import * as React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../../store/AppStore'
import config from '../../../config/client'

// /////////////////////////////////////////////////////////////////////////////
// retrieves the role - function matrix definition (currently hardcoded config)
const retrieveRoleDefinition = () => {
  return config.rba
}

// get the list of roles which are granted for this component's controlled function
const getGrantedRoles = (userRoles: string[], controlledFunction: string): string[] => {
  if (!userRoles) {
    return null
  }
  let rba = RBA.retrieveRoleDefinition()
  return userRoles.filter((role) => {
    return (rba[role] && rba[role].find((elm) => (elm === controlledFunction)))
  })
}
// for testing purpose...
export const RBA = {
  retrieveRoleDefinition: retrieveRoleDefinition,
  getGrantedRoles: getGrantedRoles
}

interface IProps {
  isAuthenticated?: boolean,
  roles?: [string]
}
interface IState { }

interface IStateProps extends IProps {}

// =======> CONNECT <=======
const mapStateToProps = (state: AppState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    roles: state.auth.roles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

// ////////////////////////////////////
// RoelAwareComponent wrapper
// export the wrapped conponent instead of the original one
//
export default function authorized<P>(controlledFunction: string, Component: React.ComponentClass<P>): React.ComponentClass<P> {
  class RoleAwareComponent extends React.Component<IProps & P, IState> {

    constructor(props) {
      super(props)
    }

     shouldBeVisible() {
      if (this.props.isAuthenticated) {
        let grantedRoles = RBA.getGrantedRoles(this.props.roles, controlledFunction)
        if (grantedRoles && grantedRoles.length > 0)
          return true
        else
          return false
      }
      else
        return false
    }

    render() {
      if (this.shouldBeVisible()) {
        return <Component {...this.props} />
      }
      else
        return null
    }
  }

  return connect<IStateProps, null, P>(mapStateToProps, null)(RoleAwareComponent)
}
