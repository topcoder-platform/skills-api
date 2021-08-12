const Confirm = require('prompt-confirm')
const { getESClient } = require('../common/es-client')
const { esIndexPropertyMapping } = require('../../scripts/constants')

const esClient = getESClient()

/**
 * Prompt the user with a y/n query and call a callback function based on the answer
 * @param {string} promptQuery the query to ask the user
 * @param {function} cb the callback function
 */
async function promptUser (promptQuery, cb) {
  if (process.argv.includes('--force')) {
    await cb()
    return
  }

  const prompt = new Confirm(promptQuery)
  prompt.ask(async (answer) => {
    if (answer) {
      await cb()
    }
  })
}

/**
 * Create index in elasticsearch
 * @param {String} index the index name
 * @param {Object} logger the logger object
 */
async function createIndex (index, logger) {
  await esClient.indices.create({ index })
  await esClient.indices.close({ index })
  await esClient.indices.putSettings({
    index: index,
    body: {
      settings: {
        analysis: {
          normalizer: {
            lowercaseNormalizer: {
              filter: ['lowercase']
            }
          }
        }
      }
    }
  })
  await esClient.indices.open({ index })
  await esClient.indices.putMapping({
    index,
    body: {
      properties: esIndexPropertyMapping[index]
    }
  })
  logger.info(`ES Index ${index} creation succeeded!`)
}

/**
 * Delete index in elasticsearch
 * @param {String} index the index name
 * @param {Object} logger the logger object
 */
async function deleteIndex (index, logger) {
  await esClient.indices.delete({ index })
  logger.info(`ES Index ${index} deletion succeeded!`)
}

module.exports = {
  promptUser,
  createIndex,
  deleteIndex
}
