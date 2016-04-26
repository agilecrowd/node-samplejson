var express = require('express');
var router = express.Router();
var metatag = require('../app/utils/ogmeta');
var lodash = require('lodash');

/* GET /quotes page. */
router.get('/', function(req, res, next) {
  var json;
  if (req.query.json) {
    json = JSON.parse(req.query.json);
  }
  // Transform json according to the quote model
  if (json.selectionText) {
    json.digest = json.selectionText;
    delete json.selectionText;
  }
  if (json.pageUrl) {
    json.link = json.pageUrl;
    delete json.pageUrl;
  }
  // Setup default ean value as 0
  if (!json.ean) {
    json.ean = 0;
  }
  // Setup default value for author (og:article:author) and date (og:article:published_time)
  if (!json.author) {
    json.author = "Walter Benjamin";
  }
  if (!json.date) {
    json.date = "9/22/1938";
  }

  // Parse meta tag to get more metadata from the link
  if (json.link) {
    metatag.parse(json.link, function(err, meta) {
      if (err) console.log(err);
      json = lodash.merge(json, meta);
      // console.log(json);
      res.render('quote_form', { json: json });
    });
  } else {
    // console.log(json);
    res.render('quote_form', { json: json });
  }
});

module.exports = router;