/**
 * drop tables
 */
const _ = require('lodash')
const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')
const {
  topResources,
  modelToESIndexMapping
} = require('../constants')
const { getESClient } = require('../../src/common/es-client')

async function main () {
  const client = getESClient()

  // delete data in es
  const keys = Object.keys(sequelize.models)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const esResourceName = modelToESIndexMapping[key]
    try {
      if (_.includes(_.keys(topResources), esResourceName)) {
        logger.info(`Deleting index for ${esResourceName}`)
        await client.indices.delete({
          index: topResources[esResourceName].index
        })
        logger.info(`Successfully deleted index for ${esResourceName}`)
      }
    } catch (e) {
      console.error(e)
      logger.warn(`deleting data in es for ${key} failed`)
    }
  }

  // delete tables
  try {
    await sequelize.drop()
    // the dropped tables cannot be re-created via command `npm run migrations up`
    // without dropping the SequelizeMeta table first
    // so here we drop the SequelizeMeta table too.
    await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta";')
  } catch (e) {
    console.error(e)
    logger.warn('deleting tables failed')
  }
}

(async () => {
  main().catch(err => console.error(err))
})()
