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
const Taxonomy = sequelize.models.Taxonomy

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
  await populateTaxonomyNames(skill)

  return helper.omitAuditFields(skill)
}

get.schema = {
  id: joi.string().uuid().required(),
  params: joi.object()
}

/**
 * Populates the taxonomy name for each of the skill
 * @param skills individual skill or an array of skills
 * @returns the updated skills object
 */
async function populateTaxonomyNames (skills) {
  if (_.isArray(skills)) {
    const taxonomyMap = {}
    for (const skill of skills) {
      // dont populate if we already have the name
      if (skill.taxonomyName) { continue }

      if (!_.has(taxonomyMap, skill.taxonomyId)) {
        const taxonomy = await dbHelper.get(Taxonomy, skill.taxonomyId)
        taxonomyMap[skill.taxonomyId] = taxonomy.name
      }
      skill.taxonomyName = taxonomyMap[skill.taxonomyId]
    }
  } else {
    const taxonomy = await dbHelper.get(Taxonomy, skills.taxonomyId)
    skills.taxonomyName = taxonomy.name
  }

  return skills
}

/**
 * search skills by query
 * @param query the search query
 * @return the results
 */
async function search (query) {
  let items = await dbHelper.find(TCSkill, query)

  items = items.map(item => item.dataValues)
  await populateTaxonomyNames(items)
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
