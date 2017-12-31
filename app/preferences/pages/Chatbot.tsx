import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as Redux from 'redux'
import { Button, Jumbotron, Row, Col, InputGroup, FormControl, Glyphicon } from 'react-bootstrap'
import { AppState, appStore } from '../../store/AppStore'
// import { Unsubscribe } from 'redux'
// import { actions } from '../reducers/main'
import { connect } from 'react-redux'
// import { FormattedMessage } from 'react-intl'
const classes = require('./Chatbot.scss')
import Axios from 'axios'
import { Message, MessageProps } from '../components/Messages'

const WATSON_API_VERSION = '2017-05-26'
const WATSON_WORKSPACE_ID = '5f08b25d-8b3e-4035-9353-513ab11f57e0'
const WATSON_USERNAME: string = '86a06f95-4759-4a26-87e3-ca375bdcb0f4'
const WATSON_PASSWORD: string = 'HNwRrvXvGg5H'

const RESPONSE_ACTION_SHOW_RPDOCTS = 'show-products'
const ENTITY_PRODUCT_TYPE = 'applicationtype'
const ENTITY_CATEGORY = 'category'

const Spinner: React.SFC<{}> = (props) => (
  <div className='spinner'>
    <div className='bounce1'></div>
    <div className='bounce2'></div>
    <div className='bounce3'></div>
  </div>
)

interface ChatbotProps {
}

interface ChatbotState {
  messages?: MessageProps[]
  prompt: string
  context?: any
  output?: any
  loading?: boolean
}

export class Chatbot extends React.Component<ChatbotProps, ChatbotState> {
  constructor(props) {
    super(props)
    this.state = {
      prompt: '',
      context: null,
      output: null,
      messages: [],
      loading: false}
  }

  // private lastMessage

  // unsubscribe: Unsubscribe

  sendMessage = () => {
    if (!!!this.state.prompt) return

    const msgText = this.state.prompt

    this.setState({
      prompt: '',
      messages: [...this.state.messages, {text: [msgText], me: true}]
    })

    this.conversation(msgText)
  }

  conversation = (msgText: string) => {
    this.setState({loading: true})
    Axios.post('/api/v1/workspaces/' + WATSON_WORKSPACE_ID + '/message', {input: {text: msgText}, context: this.state.context}, {params: {version: WATSON_API_VERSION}, auth: {
      username: WATSON_USERNAME,
      password: WATSON_PASSWORD
    }, withCredentials: true})
    .then((response => {
      this.setState({loading: false})
      console.log('RESPONSE: ', response.data)
      this.watsonResponseHandler(response.data)
    }))
    .catch((err) => {
      this.setState({loading: false})
      console.log('API ERROR: ', err)
    })
  }

  watsonResponseHandler = (watsonResponse: any) => {
    let outputText = watsonResponse.output.text
    let outputProducts = watsonResponse.output.products
    let filter = watsonResponse.entities.find(elm => elm.entity === ENTITY_PRODUCT_TYPE || elm.entity === ENTITY_CATEGORY)

    if (watsonResponse.output.action === RESPONSE_ACTION_SHOW_RPDOCTS) {
      // get product list
      Axios.get('/catalog/' + filter.value, {params: {version: WATSON_API_VERSION}})
      .then((response) => {
        this.setState({
          context: watsonResponse.context,
          output: watsonResponse.output,
          messages: [...this.state.messages, {text: outputText, products: response.data, me: false}]
        })
      })
    }
    else {
      this.setState({
        context: watsonResponse.context,
        output: watsonResponse.output,
        messages: [...this.state.messages, {text: outputText, products: outputProducts, me: false}]
      })
    }
  }

  componentDidMount() {
    // initial message from BOT
    this.conversation('')
  }

  componentDidUpdate(prevProps, prevState) {
    // debugger
    // if (this.lastMessage) this.lastMessage.show()
  }

  componentWillUnmount() {
  }

  render() {
    let msgList = this.state.messages.map((elm, i, arr) => (<Message {...elm} key={i} />))
    // if (msgList.length > 0) this.lastMessage = msgList[msgList.length - 1]
    return (
      <div className={classes.desktop}>
          <Row id='header' className={classes.headerarea}>
            <Col  md={12}>
              <span style={{color: '#fdb515', fontWeight: 'normal'}}>Marketplace Chatbot</span>
            </Col>
          </Row>
          <Row id='chatarea' className={classes.chatarea}>
            <Col  md={12}>
              {msgList}
              {this.state.loading ? <Spinner/> : null}
            </Col>
          </Row>
          <Row id='promptarea' className={classes.promptarea}>
            <div>
              <InputGroup>
                <FormControl type='text'
                  placeholder='Write a reply....'
                  value={this.state.prompt} onChange={(e) => {this.setState({prompt: e.target['value']})}}
                  onKeyDown={ (e) => {if (e.keyCode === 13) this.sendMessage()}}/>
                <InputGroup.Button>
                  <Button bsStyle='info' onClick={(e) => {this.sendMessage()}} disabled={this.state.prompt.length <= 0}>
                    <Glyphicon glyph='send' />
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </div>
          </Row>
      </div>
    )
  }
}
// =======> CONNECT <=======
const mapStateToProps = (state: AppState) => ({
})

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatbot)
