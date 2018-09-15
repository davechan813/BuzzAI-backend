var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');

router.post('/', function(req, res) {
  // get woeid by place name: https://stackoverflow.com/questions/12434591/get-woeid-from-city-name
  // check woeid: http://www.woeidlookup.com/
  console.log('placeName:', req.body.placeName);
  var options1 = {
    url: "http://query.yahooapis.com/v1/public/yql",
    method: 'GET',
    qs: {
      'q': 'select * from geo.places where text="' + req.body.placeName + '"',
      'format': 'json'
    }
  };
  rp(options1)
    .then(function (body) {
      var data = JSON.parse(body);
      var woeid = data.query.count == "1" ? data.query.results.place.woeid : data.query.results.place[0].woeid;
      console.log('woeid:', woeid);

      // Get data from Twitter api: https://developer.twitter.com/en/docs/trends/trends-for-location/api-reference/get-trends-place
      var store = require('store');
      var key = store.get('key'); // twitter api key
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + key
      };
      var options2 = {
        url: 'https://api.twitter.com/1.1/trends/place.json',
        method: 'GET',
        headers: headers,
        qs: {'id': woeid}
      };
      request(options2, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.send(body);
        } else {
          console.log('error:', error);
          console.log('response.statusCode:', response.statusCode);
          res.send({ statusCode: response.statusCode }); // send back the status code if there is no data return
        }
      });
    })
});

module.exports = router;
