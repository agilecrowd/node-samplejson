var express = require('express');
var router = express.Router();
var Like = require('../models/like');
var Quote = require('../models/quote');

/* POST / - create a new quote */
router.post('/', function(req, res, next) {
  console.log(req.body);

  var quote = new Quote(req.body);

  // transform ean into meta
  if (req.body.ean) {
    quote.meta.ean = req.body.ean;
    delete req.body.ean;
  }

  // Share to Facebook checked
  if (req.body.facebook == 'on') {
    //
  }
  // Share to Twitter checked
  if (req.body.twitter == 'on') {
    //
  }

  // Save the quote to database
  quote.save(function(err) {
    if (err) return next(err);
    res.send({status: 'ok', quote: quote});
  })
});

/* GET / - retrieve all quotes */
router.get('/', function(req, res, next) {
  Quote.find({}).populate('like', 'count').sort({updated_at: 'desc'}).exec(function(err, quotes) {
    if (err) return next(err);
    res.json(quotes);
  });
});

/* GET /:quote_id - Get a single quote */
router.get('/:quote_id', function(req, res, next) {
  Quote.findById(req.params.quote_id, function(err, quote) {
    if (err) return next(err);
    res.json(quote);
  });
});

/* PUT /:quote_id - Modify a single quote */
router.put('/:quote_id', function(req, res, next) {
  // console.log(req.params.quote_id);
  // console.log(req.body);
  var quote = new Quote(req.body);
  var update = {'updated_at': new Date()};
  if (quote.digest) update['digest'] = quote.digest;
  if (quote.author) update['author'] = quote.author;
  if (quote.date)   update['date']   = quote.date;
  if (quote.like)   update['like']   = quote.like;
  // var update = {'digest': quote.digest, 'author': quote.author, 'date': quote.date, 'updated_at': new Date()};
  var options = {new: true}
  Quote.findByIdAndUpdate(req.params.quote_id, update, options, function (err, quote) {
    if (err) return next(err);
    res.send(quote);
  });
});

/* DELETE /:quote_id - Remove a single quote */
router.delete('/:quote_id', function(req, res, next) {
  Quote.remove({ _id: req.params.quote_id }, function (err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

module.exports = router;
