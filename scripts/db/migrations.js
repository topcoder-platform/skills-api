const sequelize = require('../../src/models/index')
const path = require('path')
const { Umzug, SequelizeStorage } = require('umzug')

function getUmzug () {
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, './migrations/*.js'),
      // inject sequelize's QueryInterface in the migrations
      params: [
        sequelize.getQueryInterface()
      ]
    },
    context: sequelize.getQueryInterface(),
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: new SequelizeStorage({ sequelize })
  })
}

(async () => {
  if (process.argv[2] === 'up') {
    await getUmzug().up()
    console.log('All migrations performed successfully')
  } else if (process.argv[2] === 'down') {
    await getUmzug().down()
    console.log('The last executed migration reverted successfully')
  } else {
    console.error('You should pass \'up\' or \'down\' as the parameter')
  }
})()
