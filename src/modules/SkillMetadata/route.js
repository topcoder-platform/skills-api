/**
 * the skill sub-routes, specific to the metadata fields
 */

const Controller = require('./controller')

module.exports = {
  '/skills/:id/metadata': {
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
      permission: 'skill.deleteMetadata'
    }
  }
}
