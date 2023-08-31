const config = require('config')
const elasticsearch = require('@elastic/elasticsearch')

// Elasticsearch client
let esClient

/**
 * Get ES Client
 * @return {Object} Elasticsearch Client Instance
 */
function getESClient () {
  if (esClient) {
    return esClient
  }
  const host = config.ES.HOST
  const cloudId = config.ES.ELASTICCLOUD.id
  if (cloudId) {
    // Elastic Cloud configuration
    esClient = new elasticsearch.Client({
      cloud: {
        id: cloudId
      },
      auth: {
        username: config.ES.ELASTICCLOUD.username,
        password: config.ES.ELASTICCLOUD.password
      }
    })
  } else {
    if (/.*amazonaws.*/.test(host)) {
      esClient = new elasticsearch.Client({
        apiVersion: config.get('ES.ES_API_VERSION'),
        node: host,
        connectionClass: require('http-aws-es') // eslint-disable-line global-require
      })
      console.log('esClient=> ', esClient)
    } else {
      esClient = new elasticsearch.Client({
        node: host
      })
    }
  }
  return esClient
}

module.exports = {
  getESClient
}
