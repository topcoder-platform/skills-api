/**
 * the taxonomy sub-services, specific to the metadata fields
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
const resource = serviceHelper.getResource('Taxonomy')

/**
 * update taxonomy metadata
 * @param instance the taxonomy instance
 * @param metadata the new metadata
 * @param auth the auth object
 * @return the updated taxonomy
 */
async function updateMetaData (instance, metadata, auth) {
  const newEntity = await instance.update({
    ...instance.dataValues,
    updatedBy: helper.getAuthUser(auth),
    metadata
  })
  await serviceHelper.patchRecordInEs(resource, newEntity.dataValues)
  return helper.omitAuditFields(newEntity.dataValues)
}

/**
 * Fully update taxonomy metadata
 * @param id the taxonomy id
 * @param entity the request taxonomy metadata
 * @param auth the auth object
 * @return the updated taxonomy
 */
async function fullyUpdate (id, entity, auth) {
  const instance = await dbHelper.get(Taxonomy, id)

  if (Object.keys(entity).length) {
    // check permission for adding new fields
    serviceHelper.hasPermission(PERMISSION.ADD_TAXONOMY_METADATA, auth)
  }
  if (Object.keys(instance.metadata).length) {
    // check permission for removing existing fields
    serviceHelper.hasPermission(PERMISSION.DELETE_TAXONOMY_METADATA, auth)
  }

  return updateMetaData(instance, entity, auth)
}

fullyUpdate.schema = {
  id: joi.string().uuid().required(),
  entity: joi.object().required(),
  auth: joi.object()
}

/**
 * Partically update taxonomy metadata
 * @param id the taxonomy id
 * @param entity the request taxonomy metadata
 * @param auth the auth object
 * @return the updated taxonomy
 */
async function particallyUpdate (id, entity, auth) {
  const instance = await dbHelper.get(Taxonomy, id)

  const inputFields = Object.keys(entity)
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

  return updateMetaData(instance, { ...instance.dataValues.metadata, ...entity }, auth)
}

particallyUpdate.schema = {
  id: joi.string().uuid().required(),
  entity: joi.object().min(1).required(),
  auth: joi.object()
}

/**
 * Remove one or more fields from taxonomy metadata
 * @param id the taxonomy id
 * @param fields the list of field names
 * @param auth the auth object
 * @return the updated taxonomy
 */
async function remove (id, fields, auth) {
  const instance = await dbHelper.get(Taxonomy, id)

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
