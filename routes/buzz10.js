var express = require('express');
var router = express.Router();
var store = require('store')
var request = require('request');


router.post('/', function(req, res) {

  console.log(req.body.geoId);  // this is how we get the POST input
  console.log(store.get('key'))   // with this key query with twitter api
  var key = store.get('key');

  // https://api.twitter.com/1.1/trends/place.json

  var headers = {
    'Content-Type':     'application/x-www-form-urlencoded',
    'Authorization' : 'Bearer ' + key
  }

  var options = {
    url: 'https://api.twitter.com/1.1/trends/place.json',
    method: 'GET',
    headers: headers,
    qs: {'id': req.body.geoId}
  }

  // Start the request
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
        res.send(body)
    }
  })



});

module.exports = router;
