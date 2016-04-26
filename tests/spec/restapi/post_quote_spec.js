var chance = require('chance').Chance();
var request = require('request');

var config = require("../../../server/config.json");
var quotes_path = config.base_url + "/api/v1/quotes";

describe('Test POST quote',function(){

  var quote_id;

  // beforeEach(function(done) {done();});

  afterEach(function(done) {
    // console.log(quote_id);
    request.del({url: quotes_path + "/" + quote_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      done();
    });
  });

  it("should post a specific quote", function() {
    var quote = {
      "ean": 123456,
      "digest": chance.sentence(),
      "author": chance.name(),
      "date": chance.date({string: true})
    };
    // console.log(options);
    request.post({url: quotes_path, json: quote}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      expect(data.digest).toEqual(quote.digest);
      expect(data.author).toEqual(quote.author);
      expect(data.date).toEqual(quote.date);
      quote_id = data._id;
    });
  });
});