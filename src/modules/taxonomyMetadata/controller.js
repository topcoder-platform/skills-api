/**
 * the taxonomy sub-controller, specific to the metadata fields
 */

const service = require('./service')

/**
 * Fully update taxonomy metadata.
 * @param req the http request
 * @param res the http response
 */
async function fullyUpdate (req, res) {
  res.json(await service.fullyUpdate(req.params.id, req.body, req.authUser))
}

/**
 * Partically update taxonomy metadata.
 * @param req the http request
 * @param res the http response
 */
async function particallyUpdate (req, res) {
  res.json(await service.particallyUpdate(req.params.id, req.body, req.authUser))
}

/**
 * Remove one or more fields from taxonomy metadata.
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
