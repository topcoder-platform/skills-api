/**
 * This service provides operations to clean up the environment for running automated tests.
 */
const config = require('config')
const sequelize = require('../../models')
const logger = require('../../common/logger')
const dbHelper = require('../../common/db-helper')
const serviceHelper = require('../../common/service-helper')

/**
 * Delete the postman records from the given table.
 * @param {string} tableName the table name
 * @param {object} model the db model
 * @param resourceName the resource name of the model
 * @returns {void}
 */
const deleteFromTable = async (tableName, model, resourceName) => {
  logger.info(`Delete postman records ${resourceName}`)
  const records = await sequelize.query(`SELECT * FROM "${tableName}" where name like :value`, {
    model: model,
    replacements: { value: `${config.AUTOMATED_TESTING_NAME_PREFIX}%` },
    mapToModel: true
  })
  const resource = serviceHelper.getResource(resourceName)
  for (const r of records) {
    const id = r.dataValues.id
    logger.debug('Deleting records with id: ', id)
    await dbHelper.remove(model, id)
    await serviceHelper.deleteRecordFromEs(id, undefined, resource)
  }
}

/**
 * Clear the postman test data. The main function of this class.
 * @returns {Promise<void>}
 */
const cleanUpTestData = async () => {
  logger.info('Start clean up the test data from postman test!')
  await sequelize.transaction(async () => {
    await deleteFromTable('Skills', sequelize.models.Skill, 'Skill')
    await deleteFromTable('Taxonomies', sequelize.models.Taxonomy, 'Taxonomy')
  })
  logger.info('Finish clean up the test data from postman test!')
}

module.exports = {
  cleanUpTestData
}
