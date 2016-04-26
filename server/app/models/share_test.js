var _ = require('lodash');

function arrayMerge(records, filters) {
  var result = {};
  records.forEach(function(record) {
    for (var prop in record) {
      console.log(prop);
      if (filters.indexOf(prop) != -1) {
        if (_.isNumber(record[prop])) {
          result[prop] = _.add(result[prop], record[prop]);
        } else if (_.isString(record[prop])) {
          if (!result[prop]) result[prop] = []
          if (result[prop].indexOf(record[prop])) result[prop].push(record[prop])
          _.uniq(result[prop], true);
        } else {
          console.log("Not support yet!");
        }
      }
    }
  });
  return result;
}

var recs = [
  {
    "_id": "564e6883263e3c1dbc964a22",
    "object_id": "564e63d7730c03600e9b483c",
    "target": "twitter",
    "author": null,
    "__v": 0,
    "updated_at": "2015-11-20T00:34:09.609Z",
    "created_at": "2015-11-20T00:25:39.327Z",
    "count": 5
  },
  {
    "_id": "564e6a6b263e3c1dbc964a23",
    "object_id": "564e63d7730c03600e9b483c",
    "target": "facebook",
    "author": null,
    "__v": 0,
    "updated_at": "2015-11-20T00:33:55.841Z",
    "created_at": "2015-11-20T00:33:47.854Z",
    "count": 2
  }
];

console.log(arrayMerge(recs, ["object_id", "target", "count"]))