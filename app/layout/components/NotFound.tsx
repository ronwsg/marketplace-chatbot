import * as React from 'react'

interface Props {
}

interface State {
}

export default class NotFound extends React.Component<Props, State> {
  render() {
    return <div style={{ textAlign: 'center' }}>
             <h3>404 page not found</h3>
             <p>We are sorry but the page you are looking for does not exist.</p>
           </div>
  }
}