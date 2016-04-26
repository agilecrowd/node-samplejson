var express = require('express')
var router = express.Router()

var fs = require('fs')
var dummyjson = require('dummy-json')

var template = fs.readFileSync('./schemas/rli/helo.json', {encoding: 'utf8'})

/* GET / - get a new sample according to the schema/template */
router.get('/', function(req, res, next) {
  console.log(req.body)
  res.set('Content-Type', 'application/json')
  res.send(dummyjson.parse(template))
})

module.exports = router
