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

// The es index property mapping
const esIndexPropertyMapping = {
  [topResources.skill.index]: {
    created: {
      type: 'date'
    },
    createdBy: {
      type: 'keyword'
    },
    externalId: {
      type: 'keyword'
    },
    id: {
      type: 'keyword'
    },
    metadata: {
      type: 'object',
      enabled: 'false'
    },
    name: {
      type: 'keyword'
    },
    taxonomyId: {
      type: 'keyword'
    },
    taxonomyName: {
      type: 'keyword'
    },
    updated: {
      type: 'date'
    },
    updatedBy: {
      type: 'keyword'
    },
    uri: {
      type: 'text'
    }
  },
  [topResources.taxonomy.index]: {
    created: {
      type: 'date'
    },
    createdBy: {
      type: 'keyword'
    },
    id: {
      type: 'keyword'
    },
    metadata: {
      type: 'object',
      enabled: 'false'
    },
    name: {
      type: 'keyword'
    },
    updated: {
      type: 'date'
    },
    updatedBy: {
      type: 'keyword'
    }
  }
}

module.exports = {
  topResources,
  modelToESIndexMapping,
  esIndexPropertyMapping
}
