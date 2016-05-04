var chance = require('chance').Chance();
var request = require('request');
var fs = require('fs');
var path = require('path');
var superagent = require('superagent');

var config = require("../../../server/config.json");
var uploads_path = config.base_url + "/api/v1/uploads";

describe('Test POST uploads',function(){

  var quote_id;

  // beforeEach(function(done) {done();});

  // afterEach(function(done) {
  //   // console.log(quote_id);
  //   request.del({url: quotes_path + "/" + quote_id}, function(err, response, data) {
  //     expect(err).toBeNull();
  //     // console.log(data);
  //     done();
  //   });
  // });

  it("should post some specific files", function(done) {
    var imageFile = path.join(__dirname, '../support/a.png');
    console.log(imageFile)
    superagent
      .post(uploads_path)
      .type('form')
      .field('a', 'a-value')
      .field('b', 'b-value')
      .attach('images', imageFile)
      .end(function(err, res) {
        // assert.equal(res.statusCode, 200);
        expect(err).toBeNull();
        console.log(res);
        done();
      });
  });
});
