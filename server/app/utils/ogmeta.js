// ogmeta.js

var cheerio = require('cheerio')
var request = require('request')

var parse = function(url, cb) {
  request(url, function(error, response, body) {
    var $ = cheerio.load(body);
    var meta = $('meta')

    var ogType = ogAttribs(meta, 'og:type');
    var ogTitle = ogAttribs(meta, 'og:title');
    var ogAuthor = ogAttribs(meta, 'og:author');
    var ogDate = ogAttribs(meta, 'og:date');

    cb(error, {type: ogType, title: ogTitle, author: ogAuthor, date: ogDate});
  });
}

function ogAttribs(meta, property) {
  var keys = Object.keys(meta);

  // console.log(meta);
  // console.log(keys);

  for (var key in keys) {
    if (parseInt(key) < meta.length) {
      if (  meta[key].attribs
         && meta[key].attribs.property
         && meta[key].attribs.property === property) {

        return meta[key].attribs.content;
      }
    } else {
      return;
    }
  }
}

module.exports = {
  parse: parse
};