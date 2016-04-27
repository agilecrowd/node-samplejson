var express = require('express');
var router = express.Router();
var passport = require('passport')
var Account = require('../app/models/account')

/* GET home page. */
router.get('/', function(req, res, next) {
  // var json;
  // if (req.query.json) {
  //   json = JSON.parse(req.query.json);
  // }
  // TOOD: Parse meta tag to get more metadata from the link
  // if (json.link) {
  //   var meta = metatag(json.link);
  //   json = merge(json, meta);
  // }

  // console.log(json);
  res.render('index', { user: req.user });
})

router.get('/register', function(req, res) {
  res.render('register', { });
})

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', { error : err.message });
    }

    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
})

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
})

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/')
})

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

router.get('/ping', function(req, res){
    res.status(200).send("pong!")
})

module.exports = router;
