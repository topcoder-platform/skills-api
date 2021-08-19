/**
 * errors defined
 */

/**
 * the base error class
 */
class AppError extends Error {
  constructor (status, message) {
    super()
    this.status = status
    this.message = message || 'unknown exception'
  }
}

module.exports = {
  newBadRequestError: (msg) => new AppError(
    400,
    msg || 'The request could not be interpreted correctly or some required parameters were missing.'
  ),
  ForbiddenError: msg => new AppError(403, msg || 'Forbidden'),
  NotFoundError: msg => new AppError(404, msg || 'Not Found'),
  newEntityNotFoundError: msg => new AppError(404, msg || 'The entity does not exist.'),
  newAuthError: msg => new AppError(401, msg || 'Auth failed.'),
  newPermissionError: msg => new AppError(403, msg || 'The entity does not exist.'),
  newConflictError: msg => new AppError(409, msg || 'The entity does not exist.'),
  deleteConflictError: msg => new AppError(400, msg || 'Please delete child records first')
}
