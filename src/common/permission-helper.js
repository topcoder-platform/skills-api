/*
 * Defined helper functions related to permissions.
 */

const _ = require('lodash')

/**
 * Check if user match the permission rule.
 *
 * This method uses permission rule defined in `permissionRule`
 * and checks that the `user` matches it.
 *
 * `permissionRule.topcoderRoles` may be equal to `true` which means user is a logged-in user
 *
 * @param {Object}        permissionRule               permission rule
 * @param {Array<String>|Boolean} permissionRule.topcoderRoles the list of Topcoder roles of the user
 * @param {Object}        user                         user for whom we check permissions
 * @param {Object}        user.roles                   list of user roles
 * @param {Object}        user.scopes                  scopes of user token
 *
 * @returns {Boolean}     true, if has permission
 */
function matchPermissionRule (permissionRule, user) {
  let hasTopcoderRole = false
  let hasScope = false

  // if no rule defined, no access by default
  if (!permissionRule) {
    return false
  }

  // check Topcoder Roles
  if (permissionRule.topcoderRoles) {
    // check if user has one of allowed Topcoder roles
    if (permissionRule.topcoderRoles.length > 0) {
      hasTopcoderRole = _.intersection(
        _.get(user, 'roles', []).map(role => role.toLowerCase()),
        permissionRule.topcoderRoles.map(role => role.toLowerCase())
      ).length > 0

      // `topcoderRoles === true` means that we check if user is has any Topcoder role
      // basically this equals to logged-in user, as all the Topcoder users
      // have at least one role `Topcoder User`
    } else if (permissionRule.topcoderRoles === true) {
      hasTopcoderRole = _.get(user, 'roles', []).length > 0
    }
  }

  // check M2M scopes
  if (permissionRule.scopes) {
    hasScope = _.intersection(
      _.get(user, 'scopes', []),
      permissionRule.scopes
    ).length > 0
  }

  return hasTopcoderRole || hasScope
}

/**
 * Check if user has permission.
 *
 * This method uses permission defined in `permission` and checks that the `user` matches it.
 *
 * `permission` may be defined in two ways:
 *  - **Full** way with defined `allowRule` and optional `denyRule`, example:
 *    ```js
 *    {
 *       allowRule: {
 *          topcoderRoles: []
 *       },
 *       denyRule: {
 *          topcoderRoles: []
 *       }
 *    }
 *    ```
 *    If user matches `denyRule` then the access would be dined even if matches `allowRule`.
 *  - **Simplified** way may be used if we only want to define `allowRule`.
 *    We can skip the `allowRule` property and define `allowRule` directly inside `permission` object, example:
 *    ```js
 *    {
 *       topcoderRoles: []
 *    }
 *    ```
 *    This **simplified** permission is equal to a **full** permission:
 *    ```js
 *    {
 *       allowRule: {
 *         topcoderRoles: []
 *       }
 *    }
 *    ```
 *
 * @param {Object} permission     permission or permissionRule
 * @param {Object} user           user for whom we check permissions
 * @param {Object} user.roles     list of user roles
 * @param {Object} user.scopes    scopes of user token
 *
 * @returns {Boolean}     true, if has permission
 */
function hasPermission (permission, user) {
  if (!permission) {
    return false
  }

  const allowRule = permission.allowRule ? permission.allowRule : permission
  const denyRule = permission.denyRule ? permission.denyRule : null

  const allow = matchPermissionRule(allowRule, user)
  const deny = matchPermissionRule(denyRule, user)

  return allow && !deny
}

/*
 * @param {Object} permission     permission or permissionRule
 * @param {Object} req the request object
 *
 * @returns {Boolean}     true, if has permission
 */
function hasPermissionByReq (permission, req) {
  // as it's very easy to forget "req" argument, throw error to make debugging easier
  if (!req) {
    throw new Error('Method "hasPermissionByReq" requires "req" argument.')
  }

  return hasPermission(permission, _.get(req, 'authUser'))
}

module.exports = {
  hasPermissionByReq,
  hasPermission
}
