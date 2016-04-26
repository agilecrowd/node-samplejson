var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Like = require('../models/like');

var commentSchema = new Schema({
  "object_id": {type: String}, // which quote, e.g. quote._id
  "type": {type: String, default: 'selection'}, // selection, link, image, video
  "message": {type: String},
  "src_url": {type: String},   // source url for link, image, video
  "link": {type: String},      // link to this comment for share
  "author": {type: String, index: true},
  "like": { type: Schema.Types.ObjectId, ref: 'like' },
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema);