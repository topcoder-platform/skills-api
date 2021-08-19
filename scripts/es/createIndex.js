/**
 * Create index in Elasticsearch
 */
const logger = require('../../src/common/logger')
const scriptHelper = require('../../src/common/script-helper')
const constants = require('../constants')

const indices = Object.values(constants.topResources).map(x => x.index)
const userPrompt = `WARNING: Are you sure want to create the following elasticsearch indices: ${indices}?`

async function createIndex () {
  await scriptHelper.promptUser(userPrompt, async () => {
    for (const index of indices) {
      try {
        await scriptHelper.createIndex(index, logger)
      } catch (err) {
        logger.logFullError(err)
        process.exit(1)
      }
    }
    process.exit(0)
  })
}

createIndex()
