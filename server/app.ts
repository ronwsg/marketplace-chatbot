import * as express from 'express'
import * as webpack from 'webpack'
import * as path from 'path'
import config from '../config/server'
import authapis from './auth'
import mocks from './mocks'
const debug = require('debug')('app:http')
const webpackConfig = require('../build/webpack.config')(false)
const webpackMiddleware = require('webpack-dev-middleware')
const proxy = require('http-proxy-middleware')
const registerPassportMiddleware = require('./passport').registerPassportMiddleware
const fs = require('fs')
const https = require('https')

const app = express()

// uncomment for SSL + replace certificate files with real ones (cert.pem, key.pen)
// const sslOptions = {
//     key: fs.readFileSync('config/key.pem'),
//     cert: fs.readFileSync('config/cert.pem'),
//     passphrase: 'unix11'
//   }

let webpackCompiler

// Enable proxy middleware if it has been enabled in the config.
if (config.proxy && config.proxy.enabled) {
    debug('Proxy is enabled...')
    app.use('/api', proxy(config.proxy.options))
}
// add authentication apis
// authapis(app)
mocks(app)

// registerPassportMiddleware(app)
registerWebpackMiddleware()
registerStaticFiles()
registerReturnAlwaysIndexHtml()

app.listen(config.server_port, () => {
    debug('Server is listening on port ' + config.server_port)
})

// uncomment to enable SSL (also certificate part above)
// https.createServer(sslOptions, app).listen(config.server_port, () => {
//     debug('HTTPS Server is listening on port ' + config.server_port)
// })

function registerReturnAlwaysIndexHtml() {
    app.use(function(req, res) {
        // res.sendFile(path.join(__dirname, '../index.html'))
        res.end(webpackCompiler.outputFileSystem.readFileSync('/index.html'))
    })
}

function registerWebpackMiddleware() {
    let webpackMiddlewareConfig = {
        publicPath: '/',
        stats : {
            chunks : false,
            chunkModules : false,
            colors : true
        },

    }

    //
    //  Assets are created inside memory
    //  path has no meaning
    //
    webpackConfig.output.path = '/'

    webpackCompiler = webpack(webpackConfig)

    app.use(webpackMiddleware(webpackCompiler, webpackMiddlewareConfig))
}

function registerStaticFiles() {
    let staticPath = path.join(__dirname, '../')
    app.use(express.static(staticPath))
}
