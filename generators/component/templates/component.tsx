import * as React from 'react'

interface Props {
}

interface State {
}

// The Widget Root
export default class <%= jsClassName %> extends React.Component<Props,State> {
  render () {
    return (
      <div class="<%= cssClassName %>">
      </div>
    )
  }
}
