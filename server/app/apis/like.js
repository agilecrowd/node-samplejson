var express = require('express');
var router = express.Router();
var Like = require('../models/like');

/* POST / - create a new like or increase/descease it */
router.post('/', function(req, res, next) {
  // console.log(req.body);

  var like = new Like(req.body);
  // console.log(like);
  // Save / or increment the like count in database
  var update = {$inc: { count: like.count }, 'author': like.author, 'updated_at': new Date()};
  var options = {new: true, upsert: true, setDefaultsOnInsert: true}
  var conditions = {object_id: like.object_id}
  Like.findOneAndUpdate(conditions, update, options, function (err, like) {
    if (err) return next(err);
    res.send(like);
  });
});

/* GET / - retrieve all likes */
router.get('/', function(req, res, next) {
  // Get /?object_id=guid
  if (Object.keys(req.query).length) {
    // console.log(req.query);
    Like.findOne({object_id: req.query.object_id}, function(err, like) {
      if (err) return next(err);
      res.json(like);
    });
  } else {
    // console.log("Get /")
    Like.find({}).sort({updated_at: 'desc'}).exec(function(err, likes) {
      if (err) return next(err);
      res.json(likes);
    });
  }
});

/* GET /:like_id - Get a single like */
router.get('/:like_id', function(req, res, next) {
  Like.findById(req.params.like_id, function(err, like) {
    if (err) return next(err);
    res.json(like);
  });
});

/* DELETE /:like_id - Remove a single like */
router.delete('/:like_id', function(req, res, next) {
  Like.remove({ _id: req.params.like_id }, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

module.exports = router;