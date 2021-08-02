const config = require('config')
const _ = require('lodash')
const logger = require('../common/logger')
const esClient = require('./es-client').getESClient()

const DOCUMENTS = config.ES.DOCUMENTS

// resource filter config
const RESOURCE_FILTER = {
  // independent resources
  skill: {
    externalId: {
      resource: 'skill',
      queryField: 'externalId'
    },
    taxonomyId: {
      resource: 'skill',
      queryField: 'taxonomyId'
    },
    name: {
      resource: 'skill',
      queryField: 'name'
    }
  },
  taxonomy: {
    name: {
      resource: 'taxonomy',
      queryField: 'name'
    }
  }
}

// filter chain config
const FILTER_CHAIN = {
  taxonomy: {
    filterNext: 'skill',
    queryField: 'taxonomyId',
    idField: 'id'
  },
  skill: {
    queryField: 'skillId',
    idField: 'taxonomyId'
  }
}

function getTotalCount (total) {
  return typeof total === 'number' ? total : total.value
}

/**
 * inserts data into ES
 * @param esResourceName the es resource name
 * @param data the data to insert
 */
async function insertIntoES (esResourceName, data) {
  const resourceConfig = config.get(`ES.DOCUMENTS.${esResourceName}`)
  await esClient.create({
    index: resourceConfig.index,
    type: resourceConfig.type,
    refresh: config.get('ES.ES_REFRESH'),
    body: data,
    id: data.id
  })
}

/**
 * updated ES record
 * @param esResourceName the ES resource name
 * @param data the data to update
 */
async function updateESRecord (esResourceName, data) {
  const resourceConfig = config.get(`ES.DOCUMENTS.${esResourceName}`)
  await esClient.update({
    index: resourceConfig.index,
    type: resourceConfig.type,
    refresh: config.get('ES.ES_REFRESH'),
    id: data.id,
    body: {
      doc: data
    }
  })
}

/**
 * removes record from ES
 * @param esResourceName the ES resource name
 * @param id the id of the record to remove
 */
async function deleteESRecord (esResourceName, id) {
  const resourceConfig = config.get(`ES.DOCUMENTS.${esResourceName}`)
  await esClient.delete({
    index: resourceConfig.index,
    type: resourceConfig.type,
    refresh: config.get('ES.ES_REFRESH'),
    id: id
  })
}

/**
 * Get a resource by Id from ES.
 * @param resource the resource to get
 * @param args the request path and query parameters
 * @returns {Promise<*>} the promise of retrieved resource object from ES
 */
async function getFromElasticSearch (resource, ...args) {
  logger.debug(`Get from ES first: args ${JSON.stringify(args, null, 2)}`)
  const id = args[0]

  const doc = DOCUMENTS[resource]

  // construct ES query
  const esQuery = {
    index: doc.index,
    type: doc.type,
    id: id
  }

  logger.debug(`ES query for get ${resource}: ${JSON.stringify(esQuery, null, 2)}`)

  // query ES
  const { body: result } = await esClient.getSource(esQuery)
  return result
}

/**
 * Parse the query parameters to resource filter list.
 * @param resource the resource to apply filter
 * @param params the request query parameter
 * @param itself true mean the filter is applied the resource itself
 * @returns {[]} parsed filter array
 */
function parseResourceFilter (resource, params, itself) {
  const resDefinedFilters = RESOURCE_FILTER[resource]
  const resFilters = []
  if (resDefinedFilters) {
    const resQueryParams = _.pick(params, Object.keys(resDefinedFilters))
    if (!_.isEmpty(resQueryParams)) {
      // filter by child resource
      _.forOwn(resQueryParams, (value, query) => {
        const filterDef = resDefinedFilters[query]
        if (itself && resource === filterDef.resource) {
          resFilters.push({
            param: query,
            resource: filterDef.resource,
            queryField: filterDef.queryField,
            value
          })
        } else if (!itself && resource !== filterDef.resource) {
          resFilters.push({
            param: query,
            resource: filterDef.resource,
            queryField: filterDef.queryField,
            value
          })
        }
      })
    }
  }
  return resFilters
}

/**
 * Set the filters to ES query.
 * @param resFilters the resource filters
 * @param esQuery the ES query
 */
function setResourceFilterToEsQuery (resFilters, esQuery) {
  if (resFilters.length > 0) {
    for (const filter of resFilters) {
      let matchField = `${filter.queryField}`
      if (filter.queryField !== 'name') {
        matchField = matchField + '.keyword'
      }
      esQuery.body.query.bool.must.push({
        match: {
          [matchField]: filter.value
        }
      })
    }
  }
}

/**
 * Set filter values to ES query.
 * @param esQuery the ES query object
 * @param matchField the field to match
 * @param filterValue the filter value, it can be array or single value
 * @param queryField the field that the filter applies
 * @returns {*} the ES query
 */
function setFilterValueToEsQuery (esQuery, matchField, filterValue, queryField) {
  if (queryField !== 'name') {
    matchField = matchField + '.keyword'
  }
  if (Array.isArray(filterValue)) {
    for (const value of filterValue) {
      esQuery.body.query.bool.should.push({
        match: {
          [matchField]: value
        }
      })
    }
    esQuery.body.query.bool.minimum_should_match = 1
  } else {
    esQuery.body.query.bool.must.push({
      match: {
        [matchField]: filterValue
      }
    })
  }
  return esQuery
}

/**
 * Build ES query from given filter.
 * @param filter
 * @returns {{}} created ES query object
 */
function buildEsQueryFromFilter (filter) {
  const queryDoc = DOCUMENTS[filter.resource]
  const esQuery = {
    index: queryDoc.index,
    type: queryDoc.type,
    body: {
      query: {
        bool: {
          must: [],
          should: [],
          minimum_should_match: 0
        }
      }
    }
  }

  const matchField = `${filter.queryField}`
  return setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
}

/**
 * Resolve filter by querying ES with filter data.
 * @param filter the filter to query ES
 * @param initialRes the resource that initial request comes in
 * @returns {Promise<*>} the resolved value
 */
async function resolveResFilter (filter, initialRes) {
  const filterChain = FILTER_CHAIN[filter.resource]

  // return the value if this is end of the filter
  if (filter.resource === initialRes || !filterChain.filterNext) {
    return {
      resource: filter.resource,
      queryField: filter.queryField,
      value: filter.value
    }
  }

  // query ES with filter
  const esQuery = buildEsQueryFromFilter(filter)
  const { body: result } = await esClient.search(esQuery)

  const numHits = getTotalCount(result.hits.total)

  if (numHits > 0) {
    // this value can be array
    let value
    if (numHits === 1) {
      value = result.hits.hits[0]._source.id
    } else {
      value = result.hits.hits.map(hit => hit._source.id)
    }
    const nextFilter = {
      resource: filterChain.filterNext,
      queryField: filterChain.queryField,
      value
    }
    // go to next filter
    const resolved = await resolveResFilter(nextFilter, initialRes)
    return resolved
  }
  throw new Error(`Resource filter[${filter.resource}.${filter.queryField}=${filter.value}] query returns no data`)
}

/**
 * Search ES with provided request parameters.
 * @param resource the resource to search
 * @param args the request path and query parameters
 * @returns {Promise<*>} the promise of searched results
 */
async function searchElasticSearch (resource, ...args) {
  logger.debug(`Searching ES first with query args: ${JSON.stringify(args[0], null, 2)}`)
  // path and query parameters
  const params = args[0]
  const doc = DOCUMENTS[resource]
  if (!params.page) {
    params.page = 1
  }
  if (!params.perPage) {
    params.perPage = config.PAGE_SIZE
  }

  let sortClause = []

  const preResFilters = parseResourceFilter(resource, params, false)
  const preResFilterResults = []
  // resolve pre resource filters
  if (!params.enrich && preResFilters.length > 0) {
    for (const filter of preResFilters) {
      const resolved = await resolveResFilter(filter, resource)
      preResFilterResults.push(resolved)
    }
  }

  if (params.orderBy) {
    sortClause = [{ [`${params.orderBy}.keyword`]: 'asc' }]
  }

  // construct ES query
  const esQuery = {
    index: doc.index,
    type: doc.type,
    size: params.perPage,
    from: (params.page - 1) * params.perPage, // Es Index starts from 0
    body: {
      query: {
        bool: {
          must: [],
          should: [],
          minimum_should_match: 0
        }
      },
      sort: sortClause
    }
  }

  // set pre res filter results
  if (!params.enrich && preResFilterResults.length > 0) {
    for (const filter of preResFilterResults) {
      const matchField = `${filter.queryField}`
      setFilterValueToEsQuery(esQuery, matchField, filter.value, filter.queryField)
    }
  }

  const ownResFilters = parseResourceFilter(resource, params, true)
  // set it's own res filter to the main query
  if (!params.enrich && ownResFilters.length > 0) {
    setResourceFilterToEsQuery(ownResFilters, esQuery)
  }

  logger.debug(`ES query for search ${resource}: ${JSON.stringify(esQuery, null, 2)}`)
  const { body: docs } = await esClient.search(esQuery)
  if (docs.hits && getTotalCount(docs.hits.total) === 0) {
    return {
      total: docs.hits.total,
      page: params.page,
      perPage: params.perPage,
      result: []
    }
  }

  const result = docs.hits.hits.map(hit => hit._source)

  return {
    total: docs.hits.total,
    page: params.page,
    perPage: params.perPage,
    result
  }
}

module.exports = {
  insertIntoES,
  updateESRecord,
  deleteESRecord,
  searchElasticSearch,
  getFromElasticSearch
}
