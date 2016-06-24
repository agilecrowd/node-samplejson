var express = require('express')
var router = express.Router()
var r = require("rethinkdb")
var multiparty = require("multiparty")
var bluebird = require("bluebird")
var shortid = require("shortid")
var aws = require("aws-sdk")
var fs = require("fs")

var config = require('../../config.json')
var table = "materials"

aws.config.update(config.aws);
var s3 = bluebird.promisifyAll(new aws.S3());

/* POST / - create a new material */
router.post('/', function(req, res, next) {
  // console.log(req.body)

  // DONE: type is listen, then upload to S3, \
  // then write the url to content, as well as title and duration
  new multiparty.Form().parse(req, function(err, fields, files) {
    // console.log(fields)
    if (fields.type == 'listen') {
      // audio file should be attached
      if (!files.audios)
        return res.status(400).json({success: false, err: "No audio files found"});

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
              content: i[2].Location,
              title: i[1].originalFilename,
              duration: fields.duration[0]};
          });

          return r.table(table).insert(items, {returnChanges: true})
            .run(conn).finally(function() { conn.close(); });
        })
      .then(function(output) {
        console.log("Completed upload:", output);
        res.json({success: true, audios: output});
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
            title: fields.title[0],
            content: fields.content[0]
          }
        ]).run(conn, function(err, result) {
          if (err) throw err;
          res.send(result);
        }).finally(function() { conn.close(); });
      })
    }
  })

})

/* GET / - list comments */
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

/* PUT / - fill in sample data */
router.put('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(function(conn) {
    r.table(table).insert([
      {
        type: 'listen',
        title: 'English music',
        content: 'http://www.tonycuffe.com/mp3/cairnomount_lo.mp3',
        duration: 30
      },
      {
        type: 'read',
        title: 'Install software',
        content: 'You can install the server dependencies by navigating to the root of the project directory (with the newssharer-server.js and package.json files), and execute npm install to install the following dependencies',
        duration: 20
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
    r.table(table).delete().run(conn, function(err, result) {
      if (err) throw err;
      res.json(result);
    }).finally(function() { conn.close(); });
  })
})

module.exports = router
