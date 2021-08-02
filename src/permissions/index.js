/*
 * Setup permission rules(policies).
 */

const Authorizer = require('tc-core-library-js').Authorizer

const generalPermission = require('./generalPermission')
const { PERMISSION } = require('./constants')

module.exports = () => {
  Authorizer.setDeniedStatusCode(403)

  Authorizer.setPolicy('skill.create', generalPermission(PERMISSION.CREATE_SKILL))
  Authorizer.setPolicy('skill.edit', generalPermission(PERMISSION.UPDATE_SKILL))
  Authorizer.setPolicy('skill.delete', generalPermission(PERMISSION.DELETE_SKILL))
  Authorizer.setPolicy('skill.deleteMetadata', generalPermission(PERMISSION.DELETE_SKILL_METADATA))
  Authorizer.setPolicy('taxonomy.create', generalPermission(PERMISSION.CREATE_TAXONOMY))
  Authorizer.setPolicy('taxonomy.edit', generalPermission(PERMISSION.UPDATE_TAXONOMY))
  Authorizer.setPolicy('taxonomy.delete', generalPermission(PERMISSION.DELETE_TAXONOMY))
  Authorizer.setPolicy('taxonomy.deleteMetadata', generalPermission(PERMISSION.DELETE_TAXONOMY_METADATA))
}
