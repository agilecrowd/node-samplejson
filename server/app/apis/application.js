var express = require('express')
var router = express.Router()
var Application = require('../models/application')

/* POST / - create a new application */
router.post('/', function(req, res, next) {
  // console.log(req.body)

  var application = new Application({name: req.body.app_name, app_key: "12345678", user_id: req.body.user_id})
  // console.log(application)

  // save a new application to database
  application.save(function(err) {
    if (err) return next(err)
    res.json({status: 'ok', application})
  })
})

module.exports = router
