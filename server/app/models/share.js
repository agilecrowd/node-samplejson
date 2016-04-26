var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var shareSchema = new Schema({
  "object_id": {type: String},           // which quote, e.g. quote._id
  "target": {type: String, default: 'quote'}, // 'facebook', 'twitter', etc.
  "count": {type: Number, default: 1},   // amount for target
  "author": {type: String, index: true}, // record the last one who shared
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
});

shareSchema.statics.findAndMerge = function(conditions, filters, callback) {
  this.find(conditions, function(err, records) {
    if (err) return callback(err, null);
    var record = arrayMerge(records, filters);
    return callback(null, record);
  })
}

function arrayMerge(records, filters) {
  var result = {};
  records.forEach(function(record) {
    for (var prop in record) {
      // console.log(prop);
      if (filters.indexOf(prop) != -1) {
        if (_.isNumber(record[prop])) {
          result[prop] = _.add(result[prop], record[prop]);
        } else if (_.isString(record[prop])) {
          if (!result[prop]) result[prop] = []
          if (result[prop].indexOf(record[prop])) result[prop].push(record[prop])
          _.uniq(result[prop], true);
        } else {
          console.error("Not support yet!");
        }
      }
    }
  });
  return result;
}

module.exports = mongoose.model('share', shareSchema);