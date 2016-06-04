'use strict';

/**
 * Module dependencies
 */
var freebiesPolicy = require('../policies/freebies.server.policy'),
  freebies = require('../controllers/freebies.server.controller');

module.exports = function (app) {
  // Freebies collection routes
  app.route('/api/freebies').all(freebiesPolicy.isAllowed)
    .get(freebies.list)
    .post(freebies.create);

  // Single freebie routes
  app.route('/api/freebies/:freebieId').all(freebiesPolicy.isAllowed)
    .get(freebies.read)
    .put(freebies.update)
    .delete(freebies.delete);

  // Finish by binding the freebie middleware
  app.param('freebieId', freebies.freebieByID);
};
