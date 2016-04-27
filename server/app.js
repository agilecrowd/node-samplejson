var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var mongoose = require('mongoose');
var config = require('./config.json');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var flash    = require('connect-flash');
var session  = require('express-session');

mongoose.connect(config.mongodsn);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.once('open', function callback () {
  console.log("Mongo connected");
});

var routes = require('./routes/index');
var users  = require('./routes/users');
var quotes = require('./routes/quotes');
var samples = require('./routes/sample')
var api_quotes = require('./app/apis/quote');
var api_likes = require('./app/apis/like');
var api_shares = require('./app/apis/share')
var api_samples = require('./app/apis/sample')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// required for passport
app.use(session({ secret: 'ilovesamplejsonjsonsample', resave: false, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/quotes', quotes);
app.use('/samples', samples)
app.use('/api/v1/quotes', api_quotes);
app.use('/api/v1/likes', api_likes);
app.use('/api/v1/shares', api_shares)
app.use('/api/v1/samples', api_samples)

// passport config
var Account = require('./app/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
