var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');
var async = require('async');

// TODO: handle rejection StatusCodeError: 400
router.post('/', function(req, res) {
  var placeNameList = req.body.placeName.split(', '); // 'Los Angeles, CA, USA' --> ['Los Angeles', 'CA', 'USA']
  placeNameList.push('world'); // --> ['Los Angeles', 'CA', 'USA', 'world']

  // recursive functions to search for results. If a smaller range location returns data, send it back. Else, recursion.
  // https://stackoverflow.com/questions/21184340/async-for-loop-in-node-js
  (function next(index) {
    var placeName = placeNameList[index];
    if (placeName == "") next(index + 1);
    
    // get woeid by place name: https://stackoverflow.com/questions/12434591/get-woeid-from-city-name
    // check woeid: http://www.woeidlookup.com/
    var options1 = {
      url: "http://query.yahooapis.com/v1/public/yql",
      method: 'GET',
      qs: {
        'q': 'select * from geo.places where text="' + placeName + '"',
        'format': 'json'
      }
    };
  
    rp(options1)
    .then(function (body) {
      var data = JSON.parse(body);
      console.log('data is', data);
      var woeid = data.query.count == "1" ? data.query.results.place.woeid : data.query.results.place[0].woeid; // test in postman and you see why
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
          found = true;
          res.send(body);
          res.end();
          return;
        } else {
          next(index + 1);
        }
      });
    });
  })(0);
});

module.exports = router;
