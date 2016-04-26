var chance = require('chance').Chance();
var request = require('request');

var config = require("../../../server/config.json");
var quotes_path = config.base_url + "/api/v1/quotes";

describe('Test PUT quote',function(){

  var quote = {
    "digest": chance.sentence(),
    "author": chance.name(),
    "date": chance.date({string: true})
  };

  var new_quote = {
    "digest": chance.sentence(),
    "author": chance.name(),
    "date": chance.date({string: true})
  };

  var quote_id;

  beforeEach(function() {
    request.post({url: quotes_path, json: quote}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      quote_id = data._id;
    });
  });

  afterEach(function() {
    // console.log(quote_id);
    request.del({url: quotes_path + "/" + quote_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
    });
  });

  it("should modify a single quote", function() {
    request.put({url: quotes_path + "/" + quote_id, json: new_quote}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      expect(data.digest).not.toEqual(quote.digest);
      expect(data.author).not.toEqual(quote.author);
      expect(data.date).not.toEqual(quote.date);
      expect(data.digest).toEqual(new_quote.digest);
      expect(data.author).toEqual(new_quote.author);
      expect(data.date).toEqual(new_quote.date);
      expect(data._id).toEqual(quote_id);
    });
  });
});