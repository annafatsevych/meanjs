'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  q = require('q'),
  Freebie = mongoose.model('Freebie'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an freebie
 */
exports.create = function (req, res) {
  var freebie = new Freebie(req.body);
  freebie.user = req.user;

  console.log('create -----');

  // freebie.user = req.user;
  // freebie.categories = req.categories;
  console.log(req.body);

  freebie.save(function (err) {
    // console.log("In save --");
    // console.log(freebie);
    // if (err) {
    //   return res.status(400).send({
    //     message: errorHandler.getErrorMessage(err)
    //   });
    // }
    // Freebie.find().exec(function (err, freebie) {
    //   console.log("IN SEC SACE");
    //   console.log(freebie);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.json(freebie);
    }
    // });
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
  freebie.url = req.body.url;
  freebie.imagurl = req.body.imageurl;
  freebie.categories = req.body.categories;


  exports.getAllCats = function (req, res) {
    var categories = Category.find().sort('-created').exec(function (err, categories) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(categories);
      }
    });
  };


  freebie.save(function (err) {
    console.log("In SAVE ---");
    console.log(freebie);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(freebie);
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
  console.log("in list");

  Freebie.find().sort('-created').populate('user', 'displayName').populate('categories', 'name').exec(function (err, freebies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(freebies);
    }
  });
};


exports.showcategories = function(req, res) {
  var freebieId = req.params.id;

  return q(
    Freebie.findById(freebieId)
    .populate("cateogories")
    .exec()
  )
  .then(function(freebie) {
    if (!freebie) {
      return res.send(404);
    }

    return res.json(freebie);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

/**
 * Freebie middleware
 */
exports.freebieByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Freebie is invalid'
    });
  }

  Freebie.findById(id).populate('user', 'displayName').populate('categories', '_id, name').exec(function (err, freebie) {
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
