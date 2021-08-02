/**
 * Generate a permissions.html document using the permission config.
 *
 * Run by: `npm run generate:doc:permissions`
 *
 * For development purpose, run by `npm run generate:doc:permissions:dev` which would regenerate HTML on every update.
 */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const {
  PERMISSION
} = require('../../src/permissions/constants')

const docTemplatePath = path.resolve(__dirname, './template.hbs')
const outputDocPath = path.resolve(__dirname, '../../docs/permissions.html')

handlebars.registerHelper('istrue', value => value === true)

/**
 * Normalize permission object which has "simple" and "full" shape into a "full" shape for consistency
 *
 * @param {Object} permission permission object
 *
 * @returns {Objects} permission object in the "full" shape with "allowRule" and "denyRule"
 */
function normalizePermission (permission) {
  let normalizedPermission = permission

  if (!normalizedPermission.allowRule) {
    normalizedPermission = {
      meta: permission.meta,
      allowRule: _.omit(permission, 'meta')
    }
  }

  return normalizedPermission
}

const templateStr = fs.readFileSync(docTemplatePath).toString()
const renderDocument = handlebars.compile(templateStr)

const permissionKeys = _.keys(PERMISSION)
// prepare permissions without modifying data in constant `PERMISSION`
const allPermissions = permissionKeys.map((key) => {
  // add `key` to meta
  const meta = _.assign({}, PERMISSION[key].meta, {
    key
  })

  // update `meta` to one with `key`
  return _.assign({}, PERMISSION[key], {
    meta
  })
})
const groupsObj = _.groupBy(allPermissions, 'meta.group')
const groups = _.toPairs(groupsObj).map(([title, permissions]) => ({
  title,
  anchor: `section-${title.toLowerCase().replace(' ', '-')}`,
  permissions
}))

groups.forEach((group) => {
  group.permissions = group.permissions.map(normalizePermission)
})

const data = {
  groups
}

fs.writeFileSync(outputDocPath, renderDocument(data))
