const errors = require('./errors')
const esHelper = require('./es-helper')
const logger = require('./logger')
const permissionHelper = require('./permission-helper')

// map model name to bus message resource if different
const MODEL_TO_RESOURCE = {
  Skill: 'skill',
  Taxonomy: 'taxonomy'
}

/**
 * Create record in es
 * @param resource the resource to create
 * @param result the resource fields
 */
async function createRecordInEs (resource, entity) {
  try {
    await esHelper.insertIntoES(resource, entity)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * Patch record in es
 * @param resource the resource to create
 * @param result the resource fields
 */
async function patchRecordInEs (resource, entity) {
  try {
    await esHelper.updateESRecord(resource, entity)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * post delete message to es
 * @param id the id of record
 * @param params the params of record (like nested ids)
 * @param resource the resource to delete
 */
async function deleteRecordFromEs (id, params, resource) {
  try {
    await esHelper.deleteESRecord(resource, id)
  } catch (err) {
    logger.logFullError(err)
  }
}

/**
 * get resource in es
 * @param resource resource to get
 * @param id resource id
 * @param params resource params
 */
async function getRecordInEs (resource, id, params) {
  // Merge path and query params
  try {
    const result = await esHelper.getFromElasticSearch(resource, id, params)
    return result
  } catch (err) {
    // return error if enrich fails or permission fails
    if (err.status && err.status === 403) {
      throw errors.elasticSearchEnrichError(err.message)
    }
    logger.logFullError(err)
  }
}

/**
 * search resource in es
 * @param resource the resource to delete
 * @param query the search query
 */
async function searchRecordInEs (resource, query) {
  // remove dollar signs that are used for postgres
  for (const key of Object.keys(query)) {
    if (key[0] === '$' && key[key.length - 1] === '$') {
      query[key.slice(1, -1)] = query[key]
      delete query[key]
    }
  }

  try {
    return await esHelper.searchElasticSearch(resource, query)
  } catch (err) {
    logger.logFullError(err)
  }
  return null
}

/**
 * Get the resource from model name
 * @param modelName the model name
 * @returns {string|*} the resource
 */
function getResource (modelName) {
  if (MODEL_TO_RESOURCE[modelName]) {
    return MODEL_TO_RESOURCE[modelName]
  } else {
    return modelName.toLowerCase()
  }
}

/**
 * Check if a user has specific permissions.
 *
 * @param {Object} permission     permission or permissionRule
 * @param {Object} user           user for whom we check permissions
 * @param {Object} user.roles     list of user roles
 * @param {Object} user.scopes    scopes of user token
 * @returns {undefined}
 */
function hasPermission (permission, authUser) {
  if (permissionHelper.hasPermission(permission, authUser)) {
    return
  }
  throw errors.ForbiddenError('You do not have permissions to perform this action')
}

module.exports = {
  getResource,
  patchRecordInEs,
  deleteRecordFromEs,
  searchRecordInEs,
  createRecordInEs,
  getRecordInEs,
  hasPermission
}
