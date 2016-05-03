var express = require('express');
var router = express.Router();

/* GET upload page. */
router.get('/', function(req, res, next) {
  // console.log(req.user)
  // console.log(req.query)

  res.render('upload')
})

module.exports = router
