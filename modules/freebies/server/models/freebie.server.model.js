'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var Category = mongoose.model('Category');

/**
 * Freebie Schema
 */
var FreebieSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    match: /^([\w ,.!?]{1,100})$/,
    required: 'Title cannot be blank',
    get: function(value) {
      return value.toUpperCase();
    }
  },
  url: {
    type: String,
    default: '',
    trim: true,
    required: 'Url cannot be blank'
  },
  imageurl: {
    type: String,
    default: '',
    trim: true,
    required: 'Image Url cannot be blank'
  },
  downloadCounter: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  updatedAt: {
    type: Date,
    default: Date.now(),
    required: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Freebie', FreebieSchema);
