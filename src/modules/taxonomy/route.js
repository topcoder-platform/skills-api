/**
 * the taxonomy routes
 */

const Controller = require('./controller')

module.exports = {
  '/taxonomies': {
    get: {
      method: Controller.search
    },
    post: {
      method: Controller.create,
      auth: 'jwt',
      permission: 'taxonomy.create'
    },
    head: {
      method: Controller.search
    }
  },
  '/taxonomies/:id': {
    get: {
      method: Controller.get
    },
    head: {
      method: Controller.get
    },
    patch: {
      method: Controller.patch,
      auth: 'jwt',
      permission: 'taxonomy.edit'
    },
    put: {
      method: Controller.fullyUpdate,
      auth: 'jwt',
      permission: 'taxonomy.edit'
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      permission: 'taxonomy.delete'
    }
  }
}
