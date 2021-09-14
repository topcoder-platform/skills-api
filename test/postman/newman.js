const config = require('config')
const apiTestLib = require('tc-api-testing-lib')
const helper = require('../../src/common/helper')
const logger = require('../../src/common/logger')

const requests = [
  {
    folder: 'create taxonomy by admin',
    iterationData: require('./testData/taxonomy/create-taxonomy-by-admin.json')
  },
  {
    folder: 'create taxonomy by m2m',
    iterationData: require('./testData/taxonomy/create-taxonomy-by-m2m.json')
  },
  {
    folder: 'create taxonomy with all kinds of invalid request body',
    iterationData: require('./testData/taxonomy/create-taxonomy-with-invalid-data.json')
  },
  {
    folder: 'create taxonomy with all kinds of invalid token',
    iterationData: require('./testData/taxonomy/create-taxonomy-with-invalid-tokens.json')
  },
  {
    folder: 'list taxonomies by admin',
    iterationData: require('./testData/taxonomy/list-taxonomies.json')
  },
  {
    folder: 'list taxonomies by m2m',
    iterationData: require('./testData/taxonomy/list-taxonomies.json')
  },
  {
    folder: 'list taxonomies by copilot',
    iterationData: require('./testData/taxonomy/list-taxonomies.json')
  },
  {
    folder: 'list taxonomies by user',
    iterationData: require('./testData/taxonomy/list-taxonomies.json')
  },
  {
    folder: 'list taxonomies by anonymous',
    iterationData: require('./testData/taxonomy/list-taxonomies.json')
  },
  {
    folder: 'list taxonomies with various parameters',
    iterationData: require('./testData/taxonomy/list-taxonomies-with-various-parameters.json')
  },
  {
    folder: 'list taxonomies with invalid parameters',
    iterationData: require('./testData/taxonomy/list-taxonomies-with-invalid-parameters.json')
  },
  {
    folder: 'head taxonomies by admin'
  },
  {
    folder: 'head taxonomies by m2m'
  },
  {
    folder: 'head taxonomies by copilot'
  },
  {
    folder: 'head taxonomies by user'
  },
  {
    folder: 'head taxonomies by anonymous'
  },
  {
    folder: 'head taxonomies with various parameters',
    iterationData: require('./testData/taxonomy/head-taxonomies-with-various-parameters.json')
  },
  {
    folder: 'head taxonomies with invalid parameters',
    iterationData: require('./testData/taxonomy/head-taxonomies-with-invalid-parameters.json')
  },
  {
    folder: 'get taxonomy by admin',
    iterationData: require('./testData/taxonomy/get-taxonomy.json')
  },
  {
    folder: 'get taxonomy by m2m',
    iterationData: require('./testData/taxonomy/get-taxonomy.json')
  },
  {
    folder: 'get taxonomy by copilot',
    iterationData: require('./testData/taxonomy/get-taxonomy.json')
  },
  {
    folder: 'get taxonomy by user',
    iterationData: require('./testData/taxonomy/get-taxonomy.json')
  },
  {
    folder: 'get taxonomy by anonymous',
    iterationData: require('./testData/taxonomy/get-taxonomy.json')
  },
  {
    folder: 'get taxonomy with invalid requests',
    iterationData: require('./testData/taxonomy/get-taxonomy-with-invalid-parameters.json')
  },
  {
    folder: 'head taxonomy by admin',
    iterationData: require('./testData/taxonomy/head-taxonomy.json')
  },
  {
    folder: 'head taxonomy by m2m',
    iterationData: require('./testData/taxonomy/head-taxonomy.json')
  },
  {
    folder: 'head taxonomy by copilot',
    iterationData: require('./testData/taxonomy/head-taxonomy.json')
  },
  {
    folder: 'head taxonomy by user',
    iterationData: require('./testData/taxonomy/head-taxonomy.json')
  },
  {
    folder: 'head taxonomy by anonymous',
    iterationData: require('./testData/taxonomy/head-taxonomy.json')
  },
  {
    folder: 'head taxonomy with invalid requests',
    iterationData: require('./testData/taxonomy/head-taxonomy-with-invalid-parameters.json')
  },
  {
    folder: 'patch taxonomy by admin',
    iterationData: require('./testData/taxonomy/patch-taxonomy-by-admin.json')
  },
  {
    folder: 'patch taxonomy by m2m',
    iterationData: require('./testData/taxonomy/patch-taxonomy-by-m2m.json')
  },
  {
    folder: 'patch taxonomy with all kinds of invalid request body',
    iterationData: require('./testData/taxonomy/patch-taxonomy-with-invalid-data.json')
  },
  {
    folder: 'patch taxonomy with all kinds of invalid token',
    iterationData: require('./testData/taxonomy/patch-taxonomy-with-invalid-tokens.json')
  },
  {
    folder: 'update taxonomy by admin',
    iterationData: require('./testData/taxonomy/update-taxonomy-by-admin.json')
  },
  {
    folder: 'update taxonomy by m2m',
    iterationData: require('./testData/taxonomy/update-taxonomy-by-m2m.json')
  },
  {
    folder: 'update taxonomy with all kinds of invalid request body',
    iterationData: require('./testData/taxonomy/update-taxonomy-with-invalid-data.json')
  },
  {
    folder: 'update taxonomy with all kinds of invalid token',
    iterationData: require('./testData/taxonomy/update-taxonomy-with-invalid-tokens.json')
  },
  {
    folder: 'delete taxonomy by admin'
  },
  {
    folder: 'delete taxonomy by m2m'
  },
  {
    folder: 'delete taxonomy with all kinds of invalid request',
    iterationData: require('./testData/taxonomy/delete-taxonomy-with-invalid-request.json')
  },
  {
    folder: 'create skill by admin',
    iterationData: require('./testData/skill/create-skill-by-admin.json')
  },
  {
    folder: 'create skill by m2m',
    iterationData: require('./testData/skill/create-skill-by-m2m.json')
  },
  {
    folder: 'create skill with all kinds of invalid request body',
    iterationData: require('./testData/skill/create-skill-with-invalid-data.json')
  },
  {
    folder: 'create skill with all kinds of invalid token',
    iterationData: require('./testData/skill/create-skill-with-invalid-tokens.json')
  },
  {
    folder: 'list skills by admin',
    iterationData: require('./testData/skill/list-skills.json')
  },
  {
    folder: 'list skills by m2m',
    iterationData: require('./testData/skill/list-skills.json')
  },
  {
    folder: 'list skills by copilot',
    iterationData: require('./testData/skill/list-skills.json')
  },
  {
    folder: 'list skills by user',
    iterationData: require('./testData/skill/list-skills.json')
  },
  {
    folder: 'list skills by anonymous',
    iterationData: require('./testData/skill/list-skills.json')
  },
  {
    folder: 'list skills with various parameters',
    iterationData: require('./testData/skill/list-skills-with-various-parameters.json')
  },
  {
    folder: 'list skills with invalid parameters',
    iterationData: require('./testData/skill/list-skills-with-invalid-parameters.json')
  },
  {
    folder: 'head skills by admin'
  },
  {
    folder: 'head skills by m2m'
  },
  {
    folder: 'head skills by copilot'
  },
  {
    folder: 'head skills by user'
  },
  {
    folder: 'head skills by anonymous'
  },
  {
    folder: 'head skills with various parameters',
    iterationData: require('./testData/skill/head-skills-with-various-parameters.json')
  },
  {
    folder: 'head skills with invalid parameters',
    iterationData: require('./testData/skill/head-skills-with-invalid-parameters.json')
  },
  {
    folder: 'get skill by admin',
    iterationData: require('./testData/skill/get-skill.json')
  },
  {
    folder: 'get skill by m2m',
    iterationData: require('./testData/skill/get-skill.json')
  },
  {
    folder: 'get skill by copilot',
    iterationData: require('./testData/skill/get-skill.json')
  },
  {
    folder: 'get skill by user',
    iterationData: require('./testData/skill/get-skill.json')
  },
  {
    folder: 'get skill by anonymous',
    iterationData: require('./testData/skill/get-skill.json')
  },
  {
    folder: 'get skill with invalid requests',
    iterationData: require('./testData/skill/get-skill-with-invalid-parameters.json')
  },
  {
    folder: 'head skill by admin',
    iterationData: require('./testData/skill/head-skill.json')
  },
  {
    folder: 'head skill by m2m',
    iterationData: require('./testData/skill/head-skill.json')
  },
  {
    folder: 'head skill by copilot',
    iterationData: require('./testData/skill/head-skill.json')
  },
  {
    folder: 'head skill by user',
    iterationData: require('./testData/skill/head-skill.json')
  },
  {
    folder: 'head skill by anonymous',
    iterationData: require('./testData/skill/head-skill.json')
  },
  {
    folder: 'head skill with invalid requests',
    iterationData: require('./testData/skill/head-skill-with-invalid-parameters.json')
  },
  {
    folder: 'patch skill by admin',
    iterationData: require('./testData/skill/patch-skill-by-admin.json')
  },
  {
    folder: 'patch skill by m2m',
    iterationData: require('./testData/skill/patch-skill-by-m2m.json')
  },
  {
    folder: 'patch skill with all kinds of invalid request body',
    iterationData: require('./testData/skill/patch-skill-with-invalid-data.json')
  },
  {
    folder: 'patch skill with all kinds of invalid token',
    iterationData: require('./testData/skill/patch-skill-with-invalid-tokens.json')
  },
  {
    folder: 'update skill by admin',
    iterationData: require('./testData/skill/update-skill-by-admin.json')
  },
  {
    folder: 'update skill by m2m',
    iterationData: require('./testData/skill/update-skill-by-m2m.json')
  },
  {
    folder: 'update skill with all kinds of invalid request body',
    iterationData: require('./testData/skill/update-skill-with-invalid-data.json')
  },
  {
    folder: 'update skill with all kinds of invalid token',
    iterationData: require('./testData/skill/update-skill-with-invalid-tokens.json')
  },
  {
    folder: 'delete skill by admin'
  },
  {
    folder: 'delete skill by m2m'
  },
  {
    folder: 'delete skill with all kinds of invalid request',
    iterationData: require('./testData/skill/delete-skill-with-invalid-request.json')
  }
]

/**
 * Clear the test data.
 * @return {Promise<void>}
 */
async function clearTestData () {
  logger.info('Clear the Postman test data.')
  await helper.postRequest(`${config.API_BASE_URL}/${config.API_VERSION}/skills/internal/jobs/clean`)
  logger.info('Finished clear the Postman test data.')
}

/**
 * Run the postman tests.
 */
apiTestLib.runTests(requests, require.resolve('./skill-api.postman_collection.json'),
  require.resolve('./skill-api.postman_environment.json')).then(async () => {
  logger.info('newman test completed!')
  await clearTestData()
}).catch(async (err) => {
  logger.logFullError(err)
  // Only calling the clean up function when it is not validation error.
  if (err.name !== 'ValidationError') {
    await clearTestData()
  }
})
