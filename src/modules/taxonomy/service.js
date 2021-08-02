/**
 * the taxonomy services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const { PERMISSION } = require('../../permissions/constants')
const sequelize = require('../../models/index')

const Taxonomy = sequelize.models.Taxonomy
const Skill = sequelize.models.Skill
const resource = serviceHelper.getResource('Taxonomy')

/**
 * create entity
 * @param entity the request taxonomy entity
 * @param auth the auth information
 * @return the created taxonomy
 */
async function create (entity, auth) {
  if (Object.keys(entity.metadata).length) {
    // check permission for adding new metadata fields
    serviceHelper.hasPermission(PERMISSION.ADD_TAXONOMY_METADATA, auth)
  }

  const result = await dbHelper.create(Taxonomy, entity, auth)

  await serviceHelper.createRecordInEs(resource, result.dataValues)
  return helper.omitAuditFields(result.dataValues)
}

create.schema = {
  entity: joi.object().keys({
    name: joi.string().required(),
    metadata: joi.object().default({})
  }).required(),
  auth: joi.object()
}

/**
 * patch taxonomy by id
 * @param id the taxonomy id
 * @param entity the request taxonomy entity
 * @param auth the auth object
 * @param params the query params
 * @return the updated taxonomy
 */
async function patch (id, entity, auth) {
  const instance = await dbHelper.get(Taxonomy, id)

  if (entity.metadata) {
    if (Object.keys(entity.metadata).length) {
      // check permission for adding new metadata fields
      serviceHelper.hasPermission(PERMISSION.ADD_TAXONOMY_METADATA, auth)
    }
    if (Object.keys(instance.metadata).length) {
      // check permission for removing existing metadata fields
      serviceHelper.hasPermission(PERMISSION.DELETE_TAXONOMY_METADATA, auth)
    }
  }

  const newEntity = await instance.update({
    ...entity,
    updatedBy: helper.getAuthUser(auth)
  })

  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)
  return helper.omitAuditFields(newEntity.dataValues)
}

patch.schema = {
  id: joi.string().uuid().required(),
  entity: joi.object().keys({
    name: joi.string(),
    metadata: joi.object()
  }).min(1).required(),
  auth: joi.object()
}

/**
 * get taxonomy by id
 * @param id the taxonomy id
 * @param params the path parameters
 * @param query the query parameters
 * @param fromDb Should we bypass Elasticsearch for the record and fetch from db instead?
 * @return the db taxonomy
 */
async function get (id, params, query = {}, fromDb = false) {
  const trueParams = _.assign(params, query)
  if (!fromDb) {
    const esResult = await serviceHelper.getRecordInEs(resource, id, trueParams)
    if (esResult) {
      return helper.omitAuditFields(esResult)
    }
  }

  const recordObj = await dbHelper.get(Taxonomy, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${Taxonomy.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
  }

  return helper.omitAuditFields(recordObj.dataValues)
}

get.schema = {
  id: joi.string().uuid().required(),
  params: joi.object(),
  query: joi.object(),
  fromDb: joi.boolean()
}

/**
 * search taxonomies by query
 * @param query the search query
 * @return the results
 */
async function search (query) {
  // get from elasticsearch, if that fails get from db
  // and response headers ('X-Total', 'X-Page', etc.) are not set in case of db return
  const esResult = await serviceHelper.searchRecordInEs(resource, query)
  if (esResult) {
    esResult.result = helper.omitAuditFields(esResult.result)
    return esResult
  }

  let items = await dbHelper.find(Taxonomy, query)
  items = helper.omitAuditFields(items.map(i => i.dataValues))
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.string().uuid(),
    perPage: joi.pageSize(),
    name: joi.string()
  }
}

/**
 * remove entity by id
 * @param id the entity id
 * @param auth the auth object
 * @param params the query params
 * @return no data returned
 */
async function remove (id, auth, params) {
  const existing = await dbHelper.find(Skill, { taxonomyId: id })
  if (existing.length > 0) {
    throw errors.deleteConflictError(`Please delete ${Skill.name} with ids ${existing.map(o => o.id)}`)
  }

  await dbHelper.remove(Taxonomy, id)
  await serviceHelper.deleteRecordFromEs(id, params, resource)
}

remove.schema = {
  id: joi.string().uuid().required(),
  auth: joi.object(),
  params: joi.object()
}

module.exports = {
  create,
  search,
  patch,
  get,
  remove
}
