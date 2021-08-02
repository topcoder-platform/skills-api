/**
 * The application entry point
 */

require('./src/bootstrap')
const config = require('config')
const express = require('express')
const cross = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')
const http = require('http')
const swaggerUi = require('swagger-ui-express')
const jsyaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const logger = require('./src/common/logger')
const errorMiddleware = require('./src/common/error.middleware')
const routes = require('./src/route')
const { permissions, jwtAuthenticator } = require('tc-core-library-js').middleware
const app = express()
const httpServer = http.Server(app)
const models = require('./src/models')
const initPermissions = require('./src/permissions')

app.set('port', config.PORT)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cross())
const apiRouter = express.Router({})

// load all routes
_.each(routes, (verbs, url) => {
  _.each(verbs, (def, verb) => {
    if (!def.method) {
      throw new Error(`${verb.toUpperCase()} ${url} method is undefined`)
    }
    if (def.auth && def.auth !== 'jwt') {
      throw new Error(`auth type "${def.auth}" is not supported`)
    }

    const actions = []
    // Authentication
    if (def.auth) {
      actions.push((req, res, next) => {
        jwtAuthenticator(_.pick(config, ['AUTH_SECRET', 'VALID_ISSUERS']))(req, res, next)
      })
    }
    // Authorization
    if (def.permission) {
      actions.push(permissions(def.permission))
    }
    // main middleware
    actions.push(async (req, res, next) => {
      try {
        await def.method(req, res, next)
      } catch (e) {
        next(e)
      }
    })

    logger.info(`Endpoint discovered : ${verb.toLocaleUpperCase()} /${config.API_VERSION}${url}`)
    apiRouter[verb](`/${config.API_VERSION}${url}`, actions)
  })
})
app.use('/', apiRouter)
const spec = fs.readFileSync(path.join(__dirname, 'docs/swagger.yaml'), 'utf8')
const swaggerDoc = jsyaml.safeLoad(spec)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(errorMiddleware())
app.use('*', (req, res) => {
  const pathKey = req.baseUrl.substring(config.API_VERSION.length + 1)
  const route = routes[pathKey]
  if (route) {
    res.status(405).json({ message: 'The requested method is not supported.' })
  } else {
    res.status(404).json({ message: 'The requested resource cannot found.' })
  }
});

(async () => {
  await models.init()
  initPermissions() // initialize permission policies
  httpServer.listen(app.get('port'), () => {
    logger.info(`Express server listening on port ${app.get('port')}`)
  })
})()
