'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Freebie = mongoose.model('Freebie'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an freebie
 */
exports.create = function (req, res) {
  var freebie = new Freebie(req.body);
  freebie.user = req.user;

  freebie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(freebie);
    }
  });
};

/**
 * Show the current freebie
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var freebie = req.freebie ? req.freebie.toJSON() : {};

  // Add a custom field to the Freebie, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Freebie model.
  freebie.isCurrentUserOwner = !!(req.user && freebie.user && freebie.user._id.toString() === req.user._id.toString());

  res.json(freebie);
};

/**
 * Update an freebie
 */
exports.update = function (req, res) {
  var freebie = req.freebie;

  freebie.title = req.body.title;
  freebie.content = req.body.content;

  freebie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(freebie);
    }
  });
};

/**
 * Delete an freebie
 */
exports.delete = function (req, res) {
  var freebie = req.freebie;

  freebie.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(freebie);
    }
  });
};

/**
 * List of Freebies
 */
exports.list = function (req, res) {
  Freebie.find().sort('-created').populate('user', 'displayName').exec(function (err, freebies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(freebies);
    }
  });
};

/**
 * Freebie middleware
 */
exports.articleByID = function (req, res, next, id) {

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
        message: 'No freebie with that identifier has been found'
      });
    }
    req.freebie = freebie;
    next();
  });
};
