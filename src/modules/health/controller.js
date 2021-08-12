/**
 * Controller for health check endpoint
 */
const models = require('../../models')
const logger = require('../../common/logger')

// the topcoder-healthcheck-dropin library returns checksRun count,
// here it follows that to return such count
let checksRun = 0

/**
 * Check health of the DB
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function checkHealth (req, res) {
  checksRun += 1
  await models
    .validate()
    .then(() => {
      logger.info({ component: 'HealthCheckController', context: 'checkHealth', message: 'Connection has been established successfully.' })
    })
    .catch(err => {
      logger.logFullError(err, { component: 'HealthCheckController', context: 'checkHealth' })
      res.status(503)
    })
  res.send({ checksRun })
}

module.exports = {
  checkHealth
}
