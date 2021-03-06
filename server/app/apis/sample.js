var express = require('express')
var router = express.Router()

var fs = require('fs')
var path = require('path')
var dummyjson = require('dummy-json')
var config = require('../../config.json')

var Application = require('../models/application')

/* GET / - get a new sample according to the schema/template */
router.get('/', function(req, res, next) {
  // console.log(req.query)
  var app_id = req.query.app_id

  if (app_id) {
    // if the user is login, return the latest template/schema
    Application.findOne({_id: app_id}, function(err, application) {
      if (err) return next(err)
      res.set('Content-Type', 'application/json')
      res.send(dummyjson.parse(application.template))
    })
  }
  // var dir = path.join(config.base_dir, req.query.username)
  // var filename = req.query.app_name + ".hbr"
  // var fullpath = path.join(dir, filename)
  //
  // fs.exists(fullpath, (exists) => {
  //   if (!exists) throw err
  //   fs.readFile(fullpath, {encoding: 'utf8'}, (err, data) => {
  //     if (err) throw err;
  //     res.set('Content-Type', 'application/json')
  //     res.send(dummyjson.parse(data))
  //   })
  // })
})

module.exports = router
