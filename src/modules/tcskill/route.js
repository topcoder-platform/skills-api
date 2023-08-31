/**
 * the tcskill routes
 */

const Controller = require('./controller')

module.exports = {
  '/tcskills': {
    get: {
      method: Controller.search
    }
  },
  '/tcskills/:id': {
    get: {
      method: Controller.get
    }
  }
}
