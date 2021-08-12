/**
 * Delete index in Elasticsearch
 */
const logger = require('../../src/common/logger')
const scriptHelper = require('../../src/common/script-helper')
const constants = require('../constants')

const indices = Object.values(constants.topResources).map(x => x.index)
const userPrompt = `WARNING: this would remove existent data! Are you sure want to delete the following eleasticsearch indices: ${indices}?`

async function deleteIndex () {
  await scriptHelper.promptUser(userPrompt, async () => {
    for (const index of indices) {
      try {
        await scriptHelper.deleteIndex(index, logger)
      } catch (err) {
        logger.logFullError(err)
        process.exit(1)
      }
    }
    process.exit(0)
  })
}

deleteIndex()
