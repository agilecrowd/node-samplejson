var chance = require('chance').Chance();
var request = require('request');

var config = require("../../../server/config.json");
var likes_path = config.base_url + "/api/v1/likes";

describe('Test GET likes',function(){

  var object_id = chance.guid();
  var count = chance.integer({min: -20, max: 20});

  var like = {
    "object_id": object_id,
    "count": count,
    "author": chance.name()
  };

  var like_id;
  var like_num = 0;

  beforeEach(function(done) {
    request.get({url: likes_path}, function(err, response, data) {
      like_num = JSON.parse(data).length;
      request.post({url: likes_path, json: like}, function(err, response, data) {
        expect(err).toBeNull();
        // console.log(data);

        request.post({url: likes_path, json: like}, function(err, response, data) {
          expect(err).toBeNull();
          // console.log(data);
          like_id = data._id;
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    // console.log(like_id);
    request.del({url: likes_path + "/" + like_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(data);
      done();
    });
  });

  it("should get all likes", function(done) {
    request.get({url: likes_path}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(JSON.parse(data));
      expect(JSON.parse(data).length).toEqual(like_num + 1);
      done();
    });
  });

  it("should get a specific like", function(done) {
    request.get({url: likes_path + '/' + like_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(JSON.parse(data));
      expect(JSON.parse(data).count).toEqual(2 * count);
      done();
    });
  });

  it("should get a specific object_id", function(done) {
    request.get({url: likes_path + '/?object_id=' + object_id}, function(err, response, data) {
      expect(err).toBeNull();
      // console.log(JSON.parse(data));
      expect(JSON.parse(data).count).toEqual(2 * count);
      done();
    });
  });
});