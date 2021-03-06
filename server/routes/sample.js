var express = require('express')
var router = express.Router()

var fs = require('fs')
var config = require('../config.json')

var Application = require('../app/models/application')

/* GET / - load a schema/template */
router.get('/', function(req, res, next) {
  // console.log(req.query)
  var info = req.query

  if (info) {
    if (info.app_id) {
      // if the user is login AND specify the app_id, return the specified template/schema
      Application.findOne({user_id: info._id, _id: info.app_id}, function(err, application) {
        if (err) return next(err)
        res.json(application)
      })
    } else {
      // if the user is login, return the latest template/schema
      Application.findOne({user_id: info._id}, function(err, application) {
        if (err) return next(err)
        // console.log(application)
        res.json(application)
      })
    }
  } else {
    // otherwise, reutrn the default template/schema
    fs.readFile(config.default_schema, {encoding: 'utf8'}, (err, data) => {
      if (err) return next(err)
      res.json({template: data, name: "DefaultApp"})
    })
  }
})

/* POST / - save a new change of schema/template */
router.post('/', function(req, res, next) {
  // console.log(req.body)
  var application = new Application(req.body)

  application.app_key = "12345678"

  // save a new application to database
  application.save(function(err) {
    if (err) return next(err)
    res.json({status: 'ok', application})
  })
})

/* PUT / - modify a change of schema/template */
router.put('/', function(req, res, next) {
  // console.log(req.body)

  var application = new Application(req.body)
  var update = {'updated_at': new Date(), name: application.name, template: application.template}
  var options = {new: true}
  Application.findByIdAndUpdate(req.body.app_id, update, options, function (err, application) {
    if (err) return next(err)
    res.json({status: 'ok', application})
  })
})

/* DELETE / - delete a set of app */
router.delete('/', function(req, res, next) {
  // console.log(req.body)
  Application.remove({ _id: req.body.app_id }, function (err, result) {
    if (err) return next(err)
    res.json(result)
  })
})

module.exports = router
