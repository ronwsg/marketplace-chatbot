const fs = require('fs')

const mockFilePath = 'server/mock_files/'

function readMockFile(filename: string, ...args: any[]): Object {
  // console.log('arguments ->', arguments)
  let filepath = mockFilePath + filename
  args.forEach(arg => {
    filepath += '_' + arg
  })
  filepath += '.json'
  let fileJs = fs.readFileSync(filepath)
  return JSON.parse(fileJs)
}


export default (app) => {
  // ////////////////////////////////////////////////////////////////
  // mock APIs - in production APIs will be redirected to
  // the UI backend

  // accessed via - http://localhost:8080/api/account/[id]
  app.get('/api/account/:id', (req, res) => {
    // simulate delay in API call
    setTimeout(function() {
      res.send(readMockFile('account', req.params.id))
    }, 300)
  })

  // accessed via - http://localhost:8080/catalog/[type]
  app.get('/catalog/:type', (req, res) => {
    // simulate delay in API call
    res.send(readMockFile('catalog', req.params.type))
  })

}