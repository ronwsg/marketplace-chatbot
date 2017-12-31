const HttpsProxyAgent = require('https-proxy-agent')

// ========================================================
// Default server Configuration
// ========================================================
const config = {
  env: process.env.NODE_ENV || 'development',

  // servr port # is taken from the PORT environment variable
  server_port: process.env.PORT || 8080,
  // Proxy setup
  proxy: {
    enabled: true,
    // configuration options - https://github.com/chimurai/http-proxy-middleware
    options: {
      target: 'https://gateway.watsonplatform.net',
      pathRewrite: {
        '^/api/*': '/conversation/api/'
      },
      changeOrigin: true,
      agent: new HttpsProxyAgent('http://genproxy:8080' || 'http://genproxy:8080'),
      logLevel: 'debug'
    }
  },
  // user profile cookie setup
  cookie: {
    // expiration time in milliseconds
    // default: 1 hour = 1000 * 60 * 60 * 1
    expiration: 3600000
  }
}

export default config