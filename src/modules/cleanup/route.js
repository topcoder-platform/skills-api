/**
 * The Clean up data routes.
 */

const Controller = require('./controller')

module.exports = {
  '/skills/internal/jobs/clean': {
    post: {
      method: Controller.cleanUpTestData,
      auth: 'jwt',
      permission: 'skill.delete'
    }
  }
}
