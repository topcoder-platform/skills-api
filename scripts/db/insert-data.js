const sequelize = require('../../src/models/index')
const logger = require('../../src/common/logger')

const models = sequelize.models

const dataKeys = ['Taxonomy', 'Skill']

/**
 * import seed data
 */
async function main () {
  for (const key of dataKeys) {
    try {
      const records = require(`./data/${key}.json`)
      await models[key].bulkCreate(records)
      logger.info(`import data for ${key} done, record count: ${records.length}`)
    } catch (e) {
      logger.error(e)
      logger.warn(`import data for ${key} failed`)
    }
  }
  logger.info('all done')
  process.exit(0)
}

(async () => {
  main().catch(err => console.error(err))
})()
