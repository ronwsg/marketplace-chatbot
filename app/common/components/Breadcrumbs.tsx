import * as React from 'react'
import {Link} from 'react-router'

interface IProps {
  routes: [any]
}

interface IState {
}

export default class Breadcrumbs extends React.Component<IProps, IState> {
  render() {
    let crumbs = this.props.routes.map((elm, index, arr) => {
      if (index + 1 < arr.length) {
        return <li key={index} className='breadcrumb-item'>
          <Link onlyActiveOnIndex={true} to={elm.path || ''} >
              {elm.name}
          </Link>
        </li>
      }
      else {
        return <li key={index} className='breadcrumb-item'>
            {elm.name}
        </li>
      }
    })

    return (
      <div className='container'>
        <ol className='breadcrumb'>
          {crumbs}
        </ol>
        {this.props.children}
      </div>
    )
  }
}
