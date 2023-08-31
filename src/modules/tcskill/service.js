/**
 * the skill services
 */

const joi = require('@hapi/joi')
const _ = require('lodash')

const errors = require('../../common/errors')
const helper = require('../../common/helper')
const dbHelper = require('../../common/db-helper')
const sequelize = require('../../models/index')

const TCSkill = sequelize.models.TCSkill

/**
 * get skill by id
 * @param id the skill id
 * @param params the path parameters
 * @param query the query parameters
 * @return the skill
 */
async function get (id, params, query = {}) {
  const trueParams = _.assign(params, query)

  const recordObj = await dbHelper.get(TCSkill, id)
  if (!recordObj) {
    throw errors.newEntityNotFoundError(`cannot find ${TCSkill.name} where ${_.map(trueParams, (v, k) => `${k}:${v}`).join(', ')}`)
  }
  const skill = recordObj.dataValues

  return helper.omitAuditFields(skill)
}

get.schema = {
  id: joi.string().uuid().required(),
  params: joi.object()
}

/**
 * search skills by query
 * @param query the search query
 * @return the results
 */
async function search (query) {
  let items = await dbHelper.find(TCSkill, query)

  items = items.map(item => item.dataValues)
  items = helper.omitAuditFields(items)
  return { fromDb: true, result: items, total: items.length }
}

search.schema = {
  query: {
    page: joi.page(),
    perPage: joi.pageSize(),
    taxonomyId: joi.string().uuid(),
    name: joi.string(),
    externalId: joi.string(),
    orderBy: joi.string()
  }
}

module.exports = {
  search,
  get
}
