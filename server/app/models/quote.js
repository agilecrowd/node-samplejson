var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Like = require('../models/like');

var quoteSchema = new Schema({
  "type": {type: String, default: 'selection'}, // selection, link, image, video
  "message": {type: String},
  "title": {type: String},
  "src_url": {type: String},   // source url for selection, link, image, video
  "link": {type: String},      // link to this quote for share
  "digest": {type: String, index: true},
  "author": {type: String, index: true},
  "date": {type: String, index: true},
  // Support like as another document
  "like": { type: Schema.Types.ObjectId, ref: 'like' },
  // Support meta as sub-document
  "meta": { "ean": String },
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
});

quoteSchema.statics.findOneByEAN = function(ean, callback) {
  return this.findOne({'meta.ean': ean}, callback);
}

module.exports = mongoose.model('quote', quoteSchema);