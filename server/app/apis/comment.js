var express = require('express')
var router = express.Router()
var r = require("rethinkdb")

var config = require('../../config.json')

/* POST / - create a new comment */
router.post('/', function(req, res, next) {
  console.log(req.body)
  var comment_object_id = req.body.object_id;
  var comment_content = req.body.content;
  r.connect(config.rethinkdb).then(function(conn) {
    r.table("comments").insert([
      {
        object_id: comment_object_id,
        content: comment_content,
        upvotes: 0
      }
    ]).run(conn, function(err, result) {
      if (err) throw err;
      res.send(result);
    }).finally(function() { conn.close(); });
  })
})

/* GET / - list comments */
router.get('/', function(req, res, next) {
  // console.log(req.body)
  r.connect(config.rethinkdb).then(function(conn) {
    return r.table("comments").run(conn, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
      });
    }).finally(function() { conn.close(); });
  })
})

/* PUT / - fill in sample data */
router.put('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    r.table("comments").insert([
      {
        object_id: '1234-4567-2334',
        content: 'https://www.subtraction.com/2016/06/02/a-conversation-about-fantasy-user-interfaces/',
        upvotes: 30
      },
      {
        object_id: 'Apple Cloud Services Outage',
        content: 'https://www.apple.com/support/systemstatus/',
        upvotes: 20
      }
    ]).run(conn)
      .finally(function() { conn.close(); });
  })
  .then(function(output) {
    // if (!output) return res.status(404).json({err: "Not found"});
    res.json({status: 'fill ok'})
   });
})

/* DELETE / - clean up sample data */
router.delete('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    r.table("comments").delete().run(conn, function(err, result) {
      if (err) throw err;
      res.json(result);
    }).finally(function() { conn.close(); });
  })
})

module.exports = router
