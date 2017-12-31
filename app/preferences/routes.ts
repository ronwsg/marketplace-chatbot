import Chatbot from './pages/Chatbot'

const routes = [
    {path: '/chatbot', getComponent: getChatbotComponent, name: 'Chatbot'}
]

function getChatbotComponent(nextState, cb) {
    require.ensure([], (require) => {
        cb(null, require('./pages/Chatbot').default)
    }, 'chatbot')
}

export default routes
