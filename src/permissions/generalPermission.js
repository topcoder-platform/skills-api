/**
 * General method to check that user has permissions to call particular route.
 *
 * This "middleware" uses unified permissions rules to check access.
 *
 * - `permissions` can be an array of permissions rules or one permission rule object
 *
 * Usage:
 *   1. One permission
 *      ```js
 *      Authorizer.setPolicy('project.view', generalPermission(PERMISSION.VIEW_PROJECT));
 *      ```
 *
 *       where `PERMISSION.VIEW_PROJECT` is defined as any object which could be processed by
 *       the method `util.hasPermission`.
 *
 *   2. Multiple permissions
 *      ```js
 *      Authorizer.setPolicy('project.view', generalPermission([
 *        PERMISSION.READ_PROJECT_INVITE_OWN,
 *        PERMISSION.READ_PROJECT_INVITE_NOT_OWN,
 *      ]));
 *      ```
 *
 *      In this case if user who is making request has at least of one listed permissions access would be allowed.
 */
const _ = require('lodash')
const helper = require('../common/permission-helper')

/**
 * @param {Object|Array} permissions permission object or array of permissions
 *
 * @return {Function} which would be resolved if `req` is allowed and rejected otherwise
 */
module.exports = permissions => async (req) => {
  const hasPermission = _.isArray(permissions)
    ? _.some(permissions, permission => helper.hasPermissionByReq(permission, req))
    : helper.hasPermissionByReq(permissions, req)

  if (!hasPermission) {
    throw new Error('You do not have permissions to perform this action')
  }
}
