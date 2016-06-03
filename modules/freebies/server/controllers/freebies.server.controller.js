'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Freebie = mongoose.model('Freebie'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Freebie
 */
exports.create = function(req, res) {
  var freebie = new Freebie(req.body);
  freebie.user = req.user;

  freebie.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freebie);
    }
  });
};

/**
 * Show the current Freebie
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var freebie = req.freebie ? req.freebie.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  freebie.isCurrentUserOwner = req.user && freebie.user && freebie.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(freebie);
};

/**
 * Update a Freebie
 */
exports.update = function(req, res) {
  var freebie = req.freebie ;

  freebie = _.extend(freebie , req.body);

  freebie.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freebie);
    }
  });
};

/**
 * Delete an Freebie
 */
exports.delete = function(req, res) {
  var freebie = req.freebie ;

  freebie.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freebie);
    }
  });
};

/**
 * List of Freebies
 */
exports.list = function(req, res) { 
  Freebie.find().sort('-created').populate('user', 'displayName').exec(function(err, freebies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(freebies);
    }
  });
};

/**
 * Freebie middleware
 */
exports.freebieByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Freebie is invalid'
    });
  }

  Freebie.findById(id).populate('user', 'displayName').exec(function (err, freebie) {
    if (err) {
      return next(err);
    } else if (!freebie) {
      return res.status(404).send({
        message: 'No Freebie with that identifier has been found'
      });
    }
    req.freebie = freebie;
    next();
  });
};
