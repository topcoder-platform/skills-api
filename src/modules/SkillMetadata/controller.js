/**
 * the skill sub-controller, specific to the metadata fields
 */

const service = require('./service')

/**
 * Fully update skill metadata.
 * @param req the http request
 * @param res the http response
 */
async function fullyUpdate (req, res) {
  res.json(await service.fullyUpdate(req.params.id, req.body, req.authUser))
}

/**
 * Partically update skill metadata.
 * @param req the http request
 * @param res the http response
 */
async function particallyUpdate (req, res) {
  res.json(await service.particallyUpdate(req.params.id, req.body, req.authUser))
}

/**
 * Remove one or more fields from skill metadata.
 * @param req the http request
 * @param res the http response
 */
async function remove (req, res) {
  res.json(await service.remove(req.params.id, req.body, req.authUser))
}

module.exports = {
  fullyUpdate,
  particallyUpdate,
  remove
}
