var chance = require('chance').Chance();
var request = require('request');

var config = require("../../../server/config.json");
var quotes_path = config.base_url + "/api/v1/quotes";

describe('Test GET quotes',function(){

  var quote = {
    "digest": chance.sentence(),
    "author": chance.name(),
    "date": chance.date({string: true})
  };

  var quote_id;
  var quote_num = 0;

  beforeEach(function(done) {
    request.get({url: quotes_path}, function(err, response, data) {
      quote_num = JSON.parse(data).length;
      request.post({url: quotes_path, json: quote}, function(err, response, data) {
        expect(err).toBeNull();
        // console.log(data);
        quote_id = data._id;
        done();
      });
    });
  });

  afterEach(function(done) {
    // console.log(quote_id);
    request.del({url: quotes_path + "/" + quote_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      done();
    });
  });

  it("should get all quotes", function(done) {
    request.get({url: quotes_path}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      expect(JSON.parse(data).length).toEqual(quote_num + 1);
      done();
    });
  });
});