var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
  "object_id": {type: String},           // which quote, e.g. quote._id
  "count": {type: Number, default: 1},
  "author": {type: String, index: true}, // record the last one who liked
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
});

// likeSchema.pre('save', function(next){
//   if (!this.object_id) return next(new Error("Set 'object_id' for likeSchema"));
//   next();
// })

module.exports = mongoose.model('like', likeSchema);