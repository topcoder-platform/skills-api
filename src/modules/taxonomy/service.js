/**
 * the taxonomy services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')
const config = require('config')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const constants = require('../../constants')
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

  let payload
  try {
    return await sequelize.transaction(async () => {
      const result = await dbHelper.create(Taxonomy, entity, auth)

      payload = result.dataValues

      await serviceHelper.createRecordInEs(resource, result.dataValues)
      return helper.omitAuditFields(result.dataValues)
    })
  } catch (e) {
    if (payload) {
      helper.publishError(config.SKILLS_ERROR_TOPIC, payload, constants.API_ACTION.TaxonomyCreate)
    }
    throw e
  }
}

create.schema = {
  entity: joi.object().keys({
    name: joi.string().required(),
    metadata: joi.object().default({})
  }).required(),
  auth: joi.object()
}

/**
 * Update taxonomy by id. Used in functions patch and fullyUpdate.
 *
 * @param instance the taxonomy instance
 * @param updateData the data to be updated
 * @param auth the auth object
 * @return the updated taxonomy
 */
async function update (instance, updateData, auth) {
  let payload
  try {
    return await sequelize.transaction(async () => {
      const newEntity = await instance.update({
        ...updateData,
        updatedBy: helper.getAuthUser(auth)
      })

      payload = newEntity.dataValues

      await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)

      return helper.omitAuditFields(newEntity.dataValues)
    })
  } catch (e) {
    if (payload) {
      helper.publishError(config.SKILLS_ERROR_TOPIC, payload, constants.API_ACTION.TaxonomyUpdate)
    }
    throw e
  }
}

/**
 * Patch taxonomy by id.
 * If the metadata field is provided, existing metadata fields would be updated and new metadata fields would be added.
 *
 * @param id the taxonomy id
 * @param entity the request taxonomy entity
 * @param auth the auth object
 * @param params the query params
 * @return the updated taxonomy
 */
async function patch (id, entity, auth) {
  const instance = await dbHelper.get(Taxonomy, id)

  if (entity.metadata) {
    const inputFields = Object.keys(entity.metadata)
    const existingFields = Object.keys(instance.metadata)
    const sharedFields = _.intersection(inputFields, existingFields)

    if (inputFields.length > sharedFields.length) {
      // check permission for adding new fields
      serviceHelper.hasPermission(PERMISSION.ADD_TAXONOMY_METADATA, auth)
    }
    if (sharedFields.length) {
      // check permission for updating fields
      serviceHelper.hasPermission(PERMISSION.UPDATE_TAXONOMY_METADATA, auth)
    }
  }

  const updateData = { ...instance, metadata: { ...instance.metadata, ...entity.metadata } }

  return update(instance, updateData, auth)
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
    page: joi.page(),
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

  const payload = { id }
  try {
    return await sequelize.transaction(async () => {
      await dbHelper.remove(Taxonomy, id)
      await serviceHelper.deleteRecordFromEs(id, params, resource)
    })
  } catch (e) {
    helper.publishError(config.SKILLS_ERROR_TOPIC, payload, constants.API_ACTION.TaxonomyDelete)
    throw e
  }
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
