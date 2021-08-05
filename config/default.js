/**
 * the default config
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3001,

  AUTH_SECRET: process.env.AUTH_SECRET || 'CLIENT_SECRET',
  VALID_ISSUERS: process.env.VALID_ISSUERS ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://topcoder-dev.auth0.com/", "https://api.topcoder.com"]',

  PAGE_SIZE: process.env.PAGE_SIZE || 20,
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  API_VERSION: process.env.API_VERSION || 'api/1.0',

  DB_NAME: process.env.DB_NAME || 'skills-db',
  DB_USERNAME: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,

  // ElasticSearch
  ES: {
    HOST: process.env.ES_HOST || 'http://localhost:9200',
    ES_REFRESH: process.env.ES_REFRESH || 'true',
    ES_API_VERSION: process.env.ES_API_VERSION || "7.4",

    ELASTICCLOUD: {
      id: process.env.ELASTICCLOUD_ID,
      username: process.env.ELASTICCLOUD_USERNAME,
      password: process.env.ELASTICCLOUD_PASSWORD
    },

    // es mapping: _index, _type, _id
    DOCUMENTS: {
      skill: {
        index: process.env.SKILL_INDEX || 'skill',
        type: '_doc',
        enrichPolicyName: process.env.SKILL_ENRICH_POLICYNAME || 'skill-policy'
      },
      taxonomy: {
        index: process.env.TAXONOMY_INDEX || 'taxonomy',
        type: '_doc',
        pipelineId: process.env.TAXONOMY_PIPELINE_ID || 'taxonomy-pipeline',
        enrichPolicyName: process.env.TAXONOMY_ENRICH_POLICYNAME || 'taxonomy-policy'
      }
    },
    MAX_BATCH_SIZE: parseInt(process.env.MAX_BATCH_SIZE, 10) || 10000,
    MAX_BULK_SIZE: parseInt(process.env.MAX_BULK_SIZE, 10) || 100
  }
}
