var express = require('express');
var router = express.Router();
var Share = require('../models/share');
var Quote = require('../models/quote');

/* POST / - create a new share or increase/descease it */
router.post('/', function(req, res, next) {
  // console.log(req.body);

  var share = new Share(req.body);
  // console.log(share);
  // Save / or increment the share count in database
  var update = {$inc: { count: 1 }, 'author': share.author, 'updated_at': new Date()};
  var options = {new: true, upsert: true, setDefaultsOnInsert: true}
  var conditions = {object_id: share.object_id, target: share.target.toLowerCase()}
  Share.findOneAndUpdate(conditions, update, options, function (err, share) {
    if (err) return next(err);
    res.send(share);
  });
});

/* GET / - retrieve all shares */
router.get('/', function(req, res, next) {
  // Get /?object_id=guid OR /?target=facebook
  if (Object.keys(req.query).length) {
    // console.log(req.query);
    // Get /?object_id=guid
    if (req.query.object_id) {
      Share.findAndMerge({object_id: req.query.object_id}, ["object_id", "target", "count"], function(err, share) {
        if (err) return next(err);
        res.json(share);
      });
    }
    // Get /?ean=123&target=facebook
    else if (req.query.target && req.query.ean) {
      Quote.findOneByEAN(req.query.ean, function(err, quote) {
        if (err) return next(err);
        if (!quote) return res.json(quote);
        Share.findOne({target: req.query.target, object_id: quote._id}, function(err, share) {
          if (err) return next(err);
          res.json(share);
        });
      });
    }
    // Get /?target=facebook
    else if (req.query.target) {
      Share.findOne({target: req.query.target}, function(err, share) {
        if (err) return next(err);
        res.json(share);
      });
    }
  } else {
    // console.log("Get /")
    Share.find({}).sort({updated_at: 'desc'}).exec(function(err, shares) {
      if (err) return next(err);
      res.json(shares);
    });
  }
});

/* GET /:share_id - Get a single share */
router.get('/:share_id', function(req, res, next) {
  Share.findById(req.params.share_id, function(err, share) {
    if (err) return next(err);
    res.json(share);
  });
});

/* DELETE /:share_id - Remove a single share */
router.delete('/:share_id', function(req, res, next) {
  Share.remove({ _id: req.params.share_id }, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

module.exports = router;