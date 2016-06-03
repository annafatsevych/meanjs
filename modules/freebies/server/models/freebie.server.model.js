'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Freebie Schema
 */
var FreebieSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Freebie name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Freebie', FreebieSchema);
