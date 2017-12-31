/*
 The file implements the same behavior as Home but with react-redux connect method
 */

import * as React from "react";
import {AppState} from "../../store/AppStore";
import {connect} from "react-redux";
const classes = require("./<%= jsClassName %>.scss");

interface Props {
}

interface State {
}

abstract class _<%= jsClassName %> extends React.Component<Props, any> {
  render() {
    return (<div className={classes.<%= cssClassName %>}>
    </div>);
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    // titleColor: state.preferences.titleColor,
  }
};

const mapDispatchToProps = {
    // changeTitleAndColor: actions.changeTitleAndColor
};

export const <%= jsClassName %> = (connect as any)(mapStateToProps, mapDispatchToProps)(_<%= jsClassName %>);
