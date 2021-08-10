/**
 * This module contains es resources configuration.
 * Identical to the one from ES processor, but updated to work with the api
 */

const config = require('config')

const topResources = {
  taxonomy: {
    index: config.get('ES.DOCUMENTS.taxonomy.index'),
    type: config.get('ES.DOCUMENTS.taxonomy.type')
  },

  skill: {
    index: config.get('ES.DOCUMENTS.skill.index'),
    type: config.get('ES.DOCUMENTS.skill.type')
  }
}

const modelToESIndexMapping = {
  Taxonomy: 'taxonomy',
  Skill: 'skill'
}

module.exports = {
  topResources,
  modelToESIndexMapping
}
