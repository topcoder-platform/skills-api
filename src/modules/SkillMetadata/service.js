/**
 * the skill sub-services, specific to the metadata fields
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')
const { PERMISSION } = require('../../permissions/constants')
const sequelize = require('../../models/index')

const Skill = sequelize.models.Skill
const Taxonomy = sequelize.models.Taxonomy
const resource = serviceHelper.getResource('Skill')

/**
 * update skill metadata
 * @param instance the skill instance
 * @param metadata the new metadata
 * @param auth the auth object
 * @return the updated skill
 */
async function updateMetaData (instance, metadata, auth) {
  const newEntity = await instance.update({
    ...instance.dataValues,
    updatedBy: helper.getAuthUser(auth),
    metadata
  })
  const taxonomy = await dbHelper.get(Taxonomy, newEntity.taxonomyId)
  await serviceHelper.patchRecordInEs(resource, { ...newEntity.dataValues, taxonomyName: taxonomy.name })
  return helper.omitAuditFields(newEntity.dataValues)
}

/**
 * Fully update skill metadata
 * @param id the skill id
 * @param entity the request skill metadata
 * @param auth the auth object
 * @return the updated skill
 */
async function fullyUpdate (id, entity, auth) {
  const instance = await dbHelper.get(Skill, id)

  if (Object.keys(entity).length) {
    // check permission for adding new fields
    serviceHelper.hasPermission(PERMISSION.ADD_SKILL_METADATA, auth)
  }
  if (Object.keys(instance.metadata).length) {
    // check permission for removing existing fields
    serviceHelper.hasPermission(PERMISSION.DELETE_SKILL_METADATA, auth)
  }

  return updateMetaData(instance, entity, auth)
}

fullyUpdate.schema = {
  id: joi.string().uuid().required(),
  entity: joi.object().keys({
    challengeProminence: joi.prominence('challengeProminence'),
    memberProminence: joi.prominence('memberProminence')
  }).unknown(true).required(),
  auth: joi.object()
}

/**
 * Partically update skill metadata
 * @param id the skill id
 * @param entity the request skill metadata
 * @param auth the auth object
 * @return the updated skill
 */
async function particallyUpdate (id, entity, auth) {
  const instance = await dbHelper.get(Skill, id)

  const inputFields = Object.keys(entity)
  const existingFields = Object.keys(instance.metadata)
  const sharedFields = _.intersection(inputFields, existingFields)

  if (inputFields.length > sharedFields.length) {
    // check permission for adding new fields
    serviceHelper.hasPermission(PERMISSION.ADD_SKILL_METADATA, auth)
  }
  if (sharedFields.length) {
    // check permission for updating fields
    serviceHelper.hasPermission(PERMISSION.UPDATE_SKILL_METADATA, auth)
  }

  return updateMetaData(instance, { ...instance.dataValues.metadata, ...entity }, auth)
}

particallyUpdate.schema = {
  id: joi.string().uuid().required(),
  entity: joi.object().keys({
    challengeProminence: joi.prominence('challengeProminence'),
    memberProminence: joi.prominence('memberProminence')
  }).min(1).unknown(true).required(),
  auth: joi.object()
}

/**
 * Remove one or more fields from skill metadata
 * @param id the skill id
 * @param fields the list of field names
 * @param auth the auth object
 * @return the updated skill
 */
async function remove (id, fields, auth) {
  const instance = await dbHelper.get(Skill, id)

  const existingFields = Object.keys(instance.metadata)
  const nonExistingFields = fields.filter(field => !existingFields.includes(field))
  if (nonExistingFields.length) {
    throw errors.NotFoundError(`Metadata fields: ${nonExistingFields} do not exist`)
  }

  return updateMetaData(instance, _.omit(instance.dataValues.metadata, fields), auth)
}

remove.schema = {
  id: joi.string().uuid().required(),
  fields: joi.array().min(1).items(joi.string()).required(),
  auth: joi.object()
}

module.exports = {
  fullyUpdate,
  particallyUpdate,
  remove
}
