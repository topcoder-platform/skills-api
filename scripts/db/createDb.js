const { createDb } = require('../../src/common/db-helper')

async function main () {
  await createDb()
}

(async () => {
  main().catch(err => console.error(err))
})()
