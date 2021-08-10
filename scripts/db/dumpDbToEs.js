const _ = require('lodash')
const config = require('config')
const sequelize = require('../../src/models/index')
const dbHelper = require('../../src/common/db-helper')
const serviceHelper = require('../../src/common/service-helper')
const logger = require('../../src/common/logger')
const { getESClient } = require('../../src/common/es-client')
const {
  topResources,
  modelToESIndexMapping
} = require('../constants')

const models = sequelize.models

const client = getESClient()

const INDEX_NOT_FOUND = 'index_not_found_exception'

/**
 * Cleans up the data in elasticsearch
 * @param {Array} keys Array of models
 */
async function cleanupES (keys) {
  const client = getESClient()

  try {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (models[key].tableName) {
        const esResourceName = modelToESIndexMapping[key]
        if (_.includes(_.keys(topResources), esResourceName)) {
          try {
            await client.indices.delete({
              index: topResources[esResourceName].index
            })
          } catch (e) {
            if (e.meta && e.meta.body.error.type === INDEX_NOT_FOUND) {
              // Ignore
            } else {
              throw e
            }
          }
        }
      }
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    throw e
  }
  console.log('Existing data in elasticsearch has been deleted!')
}

async function insertBulkIntoES (esResourceName, dataset) {
  if (!esResourceName) {
    logger.error(`Cannot insert data into esResourceName ${esResourceName} as it's not found`)
    return
  }

  const resourceConfig = config.get(`ES.DOCUMENTS.${esResourceName}`)

  const chunked = _.chunk(dataset, config.get('ES.MAX_BULK_SIZE'))
  for (const ds of chunked) {
    const body = _.flatMap(ds, doc => [{ index: { _id: doc.id } }, doc])
    try {
      await client.bulk({
        index: resourceConfig.index,
        type: resourceConfig.type,
        body,
        refresh: 'wait_for'
      })
    } catch (e) {
      logger.error('ES, create mapping error.')
      logger.error(JSON.stringify(e))
    }
  }
}

/**
 * import test data
 * @return {Promise<void>}
 */
async function main () {
  const keys = Object.keys(models)

  await cleanupES(keys)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const queryPage = { perPage: parseInt(config.get('ES.MAX_BATCH_SIZE'), 10), page: 1 }
    try {
      while (true) {
        const data = await dbHelper.find(models[key], { ...queryPage })
        for (let i = 0; i < data.length; i++) {
          logger.info(`Inserting data ${(i + 1) + (queryPage.perPage * (queryPage.page - 1))}`)
          logger.info(JSON.stringify(data[i]))
          if (!_.isString(data[i].created)) {
            data[i].created = new Date()
          }
          if (!_.isString(data[i].updated)) {
            data[i].updated = new Date()
          }
          if (!_.isString(data[i].createdBy)) {
            data[i].createdBy = 'tcAdmin'
          }
          if (!_.isString(data[i].updatedBy)) {
            data[i].updatedBy = 'tcAdmin'
          }
        }
        await insertBulkIntoES(serviceHelper.getResource(key), data)
        if (data.length < queryPage.perPage) {
          logger.info('import data for ' + key + ' done')
          break
        } else {
          queryPage.page = queryPage.page + 1
        }
      }
    } catch (e) {
      logger.error(JSON.stringify(_.get(e, 'meta.body', ''), null, 4))
      logger.error(_.get(e, 'meta.meta.request.params.method', ''))
      logger.error(_.get(e, 'meta.meta.request.params.path', ''))
      logger.warn('import data for ' + key + ' failed')
      continue
    }
  }
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
