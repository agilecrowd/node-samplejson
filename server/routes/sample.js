var express = require('express')
var router = express.Router()

var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var config = require('../config.json')

/* GET / - load a schema/template */
router.get('/', function(req, res, next) {
  // console.log(req.query)
  var dir = path.join(config.base_dir, req.query.username)
  var filename = req.query.app_name + ".hbr"
  var fullpath = path.join(dir, filename)

  fs.exists(fullpath, (exists) => {
    if (!exists) fullpath = config.default_schema
    fs.readFile(fullpath, {encoding: 'utf8'}, (err, data) => {
      if (err) throw err;
      res.send(data)
    })
  })
})

/* POST / - save a new change of schema/template */
router.post('/', function(req, res, next) {
  // console.log(req.body)
  var dir = path.join(config.base_dir, req.body.username)
  var filename = req.body.app_name + ".hbr"

  mkdirp(dir, function (err) {
    if (err) throw(err)
    fs.writeFile(path.join(dir, filename), req.body.content, function(err) {
      if (err) throw(err)
      res.send(req.body.content)
    })
  })
})

module.exports = router
