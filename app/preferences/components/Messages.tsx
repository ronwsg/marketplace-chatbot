import * as React from 'react'
import * as ReactDom from 'react-dom'
const css = require('./Messages.scss')
const defaultProduct = require('../../imgs/blank_prod.png')
const botImg = require('../../imgs/bot.png')

export interface MessageProps {
  text: string[]
  me: boolean
  products?: ProductProps[]
}
export class Message extends React.Component<MessageProps> {
  private ref

  public show = () => {
    ReactDom.findDOMNode(this.ref).scrollIntoView()
  }

  componentDidMount() {
    ReactDom.findDOMNode(this.ref).scrollIntoView()
  }

  render() {
    return <div className={css.messagepnl} ref={(elm) => {this.ref = elm}}>
      {this.props.me ? null : <img src={botImg} className={css.botimage} />}
      <div className={(this.props.me ? css.messageme : css.messageother) + ' ' + css.fadein}>
        {this.props.text.map((elm, i, arr) => (<p key={i}>{elm}</p>))}
        {this.props.products ? this.props.products.map((elm, i, arr) => (<ProductCard name={elm.name} price={elm.price} image={elm.image} key={i}></ProductCard>)) : null}
      </div>
    </div>
  }
}

interface ProductProps {
  name: string
  price: string
  image?: string
}

const ProductCard: React.SFC<ProductProps> = (props) => (
  <button type='button' className='btn btn-default btn-xs'>
    <p>
      <img src={(props.image ? 'data:image/png;base64, ' +  props.image : defaultProduct)}/>
      {props.name} - <strong>from {props.price}</strong>
    </p>
  </button>
)