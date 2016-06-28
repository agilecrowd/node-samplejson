var express = require('express')
var router = express.Router()
var r = require("rethinkdb")
var multiparty = require("multiparty")
var bluebird = require("bluebird")
var shortid = require("shortid")
var aws = require("aws-sdk")
var fs = require("fs")

var config = require('../../config.json')
var table = "answers"

aws.config.update(config.aws)
var s3 = bluebird.promisifyAll(new aws.S3())

/* POST / - create a new answer */
router.post('/', function(req, res, next) {
  // console.log(req.body)
  new multiparty.Form().parse(req, function(err, fields, files) {
    if (fields.type == 'listen') {
      // audio file should be attached
      if (!files.audios)
        return res.status(400).json({success: false, err: "No audio files found"})
      if (!fields.duration)
        return res.status(400).json({success: false, err: "No audio duration found"})

      var operations = files.audios.map(function(file) {
        var id = shortid.generate();

        return bluebird.join(id, file,
          s3.uploadAsync({
            Key: id + "_" + file.originalFilename,
            Bucket: config.s3.bucket,
            ACL:"public-read",
            Body: fs.createReadStream(file.path)
          }))
      })

      bluebird.join(r.connect(config.rethinkdb), bluebird.all(operations),
        function(conn, files) {
          var items = files.map(function(i) {
            fs.unlink(i[1].path);
            return {
              id: i[0],
              type: fields.type[0],
              object_id: fields.object_id[0],
              content: i[2].Location,
              title: i[1].originalFilename,
              duration: fields.duration[0]};
          });

          return r.table(table).insert(items, {returnChanges: true})
            .run(conn).finally(function() { conn.close(); });
        })
      .then(function(output) {
        console.log("Completed upload:", output);
        res.status(200).json({success: true, body: result});
      })
      .error(function(e) {
        console.log("Failed to upload:", e);
        res.status(400).json({success: false, err: e});
      });
    } else if (fields.type == 'read') {
      // without audio file, just insert to db directly
      r.connect(config.rethinkdb).then(function(conn) {
        r.table(table).insert([
          {
            type: fields.type[0],
            object_id: fields.object_id[0],
            content: fields.content[0]
          }
        ]).run(conn, function(err, result) {
          if (err) throw err;
          res.status(200).json({success: true, body: result});
        }).finally(function() { conn.close(); });
      })
    }
  })
})

/* GET / - list answers */
router.get('/', function(req, res, next) {
  // console.log(req.body)
  r.connect(config.rethinkdb).then(function(conn) {
    return r.table(table).run(conn, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
      });
    }).finally(function() { conn.close(); });
  })
})

/* PUT / - fill in answer data */
router.put('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    r.table(table).insert([
      {
        object_id: '1234-4567-2334',
        type: 'listen',
        content: 'http://www.tonycuffe.com/mp3/cairnomount_lo.mp3',
        upvotes: 30
      },
      {
        object_id: 'Apple Cloud Services Outage',
        type: 'read',
        content: 'You can install the server dependencies by navigating',
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

/* DELETE / - clean up answer data */
router.delete('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    r.table(table).delete().run(conn, function(err, result) {
      if (err) throw err;
      res.json(result);
    }).finally(function() { conn.close(); });
  })
})

module.exports = router
