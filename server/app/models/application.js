var mongoose = require('mongoose')
var Schema = mongoose.Schema

var applicationSchema = new Schema({
  "app_key": {type: String},
  "name": {type: String},
  "template": {type: String},
  "user_id": {type: String, index: true},
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
});

module.exports = mongoose.model('application', applicationSchema)
