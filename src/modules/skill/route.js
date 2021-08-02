/**
 * the skill routes
 */

const Controller = require('./controller')

module.exports = {
  '/skills': {
    get: {
      method: Controller.search
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      permission: 'skill.create'
    },
    head: {
      method: Controller.search
    }
  },
  '/skills/:id': {
    get: {
      method: Controller.get
    },
    head: {
      method: Controller.get
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      permission: 'skill.edit'
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      permission: 'skill.delete'
    }
  }
}
