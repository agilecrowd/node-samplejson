// ogmeta_test.js

var parse = require('./ogmeta');

var Url = 'http://stackoverflow.com/questions/12741715/how-to-access-meta-opengraph-with-cheerio';

parse.parse(Url, function(err, map) {
  if (err) console.log(err);
  console.log(map);
});