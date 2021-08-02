/**
 * This module contains es resources configuration.
 * Identical to the one from ES processor, but updated to work with the api
 */

const config = require('config')

const topResources = {
  taxonomy: {
    index: config.get('ES.DOCUMENTS.taxonomy.index'),
    type: config.get('ES.DOCUMENTS.taxonomy.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.taxonomy.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'name', 'created', 'updated', 'createdBy', 'updatedBy']
    },
    pipeline: {
      id: config.get('ES.DOCUMENTS.taxonomy.pipelineId'),
      field: 'taxonomyId',
      targetField: 'taxonomy',
      maxMatches: '1'
    }
  },

  skill: {
    index: config.get('ES.DOCUMENTS.skill.index'),
    type: config.get('ES.DOCUMENTS.skill.type'),
    enrich: {
      policyName: config.get('ES.DOCUMENTS.skill.enrichPolicyName'),
      matchField: 'id',
      enrichFields: ['id', 'taxonomyId', 'name', 'externalId', 'uri', 'created', 'updated', 'createdBy', 'updatedBy', 'taxonomyName']
    },
    ingest: {
      pipeline: {
        id: config.get('ES.DOCUMENTS.taxonomy.pipelineId')
      }
    }
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
