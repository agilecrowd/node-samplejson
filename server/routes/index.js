var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var json;
  if (req.query.json) {
    json = JSON.parse(req.query.json);
  }
  // TOOD: Parse meta tag to get more metadata from the link
  // if (json.link) {
  //   var meta = metatag(json.link);
  //   json = merge(json, meta);
  // }

  console.log(json);
  res.render('index', { json: json });
});

module.exports = router;
