var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');
var async = require('async');

// TODO: handle rejection StatusCodeError: 400
router.get('/', function(req, res) {
    var queryStr = req.param('query');
    console.log("loading tweets for " + queryStr);
    var store = require('store');
    var key = store.get('key'); // twitter api key
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization' : 'Bearer ' + key
    };
    var options = {
      url: 'https://api.twitter.com/1.1/search/tweets.json?q=' + queryStr,
      method: 'GET',
      headers: headers
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          found = true;
          res.send(body);
          res.end();
          return;
        } else {
          console.log("Error!");
        }
      });
});

module.exports = router;