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

  AUTH0_URL: process.env.AUTH0_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  BUSAPI_URL: process.env.BUSAPI_URL || 'https://api.topcoder-dev.com/v5',

  KAFKA_ERROR_TOPIC: process.env.KAFKA_ERROR_TOPIC || 'common.error.reporting',
  KAFKA_MESSAGE_ORIGINATOR: process.env.KAFKA_MESSAGE_ORIGINATOR || 'skills-api',

  SKILLS_ERROR_TOPIC: process.env.SKILLS_ERROR_TOPIC || 'skills.action.error',

  // ElasticSearch
  ES: {
    HOST: process.env.ES_HOST || 'http://localhost:9200',
    ES_REFRESH: process.env.ES_REFRESH || 'true',
    ES_API_VERSION: process.env.ES_API_VERSION || '7.4',

    ELASTICCLOUD: {
      id: process.env.ELASTICCLOUD_ID,
      username: process.env.ELASTICCLOUD_USERNAME,
      password: process.env.ELASTICCLOUD_PASSWORD
    },

    // es mapping: _index, _type, _id
    DOCUMENTS: {
      skill: {
        index: process.env.SKILL_INDEX || 'skill',
        type: '_doc'
      },
      taxonomy: {
        index: process.env.TAXONOMY_INDEX || 'taxonomy',
        type: '_doc'
      }
    },
    MAX_BATCH_SIZE: parseInt(process.env.MAX_BATCH_SIZE, 10) || 10000,
    MAX_BULK_SIZE: parseInt(process.env.MAX_BULK_SIZE, 10) || 100
  },

  AUTOMATED_TESTING_NAME_PREFIX: process.env.AUTOMATED_TESTING_NAME_PREFIX || 'POSTMANE2E-'
}
