/**
 * the taxonomy sub-routes, specific to the metadata fields
 */

const Controller = require('./controller')

module.exports = {
  '/taxonomies/:id/metadata': {
    put: {
      method: Controller.fullyUpdate,
      auth: 'jwt'
    },
    patch: {
      method: Controller.particallyUpdate,
      auth: 'jwt'
    },
    delete: {
      method: Controller.remove,
      auth: 'jwt',
      permission: 'taxonomy.deleteMetadata'
    }
  }
}
