var express = require('express')
var router = express.Router()
var Application = require('../models/application')

/* POST / - create a new application */
router.post('/', function(req, res, next) {
  console.log(req.body)

  var application = new Application({name: req.body.app_name, app_key: "12345678", user_id: req.body.user_id})
  console.log(application)
  // Create a new secure as app_key
  // var update = {app_key: "12344567", 'updated_at': new Date()};
  // var options = {new: true, upsert: true, setDefaultsOnInsert: true}
  // var conditions = {id: , target: share.target.toLowerCase()}
  // Share.findOneAndUpdate(conditions, update, options, function (err, share) {
  //   if (err) return next(err);
  //   res.send(share);
  // });
  res.send(application)
})

module.exports = router
