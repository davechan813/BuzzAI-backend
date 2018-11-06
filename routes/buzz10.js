var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise');
var async = require('async');


// TODO: Change this hardcode data to the return value of  buzz-jb.us-east-2.elasticbeanstalk.com/getCityList
let goodCityList = [
  "New York",
  "London",
  "Moscow",
  "Osaka",
  "Paris",
  "Los Angeles",
  "Chicago",
  "Dallas",
  "Philadelphia",
  "San Francisco",
  "Sydney",
  "Seoul",
  "Mumbai",
  "Boston",
  "Frankfurt",
  "Tokyo",
  "San Jose",
  "Toronto",
  "Singapore",
  "Seattle",
  "Las Vegas"
]

function isRealValue(obj)
{
 return obj && obj !== 'null' && obj !== 'undefined';
}

// TODO: handle rejection StatusCodeError: 400
router.post('/', function(req, res) {
  var placeNameList = req.body.placeName.split(', '); // 'Los Angeles, CA, USA' --> ['Los Angeles', 'CA', 'USA']
  placeNameList.push('world'); // --> ['Los Angeles', 'CA', 'USA', 'world']



  var options_java = {
    url: "http://buzz-jb.us-east-2.elasticbeanstalk.com/getAccumlatedCityBuzz",
    method: 'GET',
    qs: {
      'city' : placeNameList[0]
    }
  };
  if (isRealValue(placeNameList[0]) && goodCityList.indexOf(placeNameList[0]) >= 0) {


    request(options_java, function (error, response, body) {
      if (error || response.statusCode != 200) {
        res.send(null);
        return;
      };
      var tmpObj = [];
      var tmpObjInner = new Object();
      tmpObjInner.trends = JSON.parse(body);
      tmpObj[0] = tmpObjInner;
      res.send(tmpObj);
      res.end();
      return;
    });

  } else {

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
      console.log("query count is");
      var isCountry = true;


      if (data.query.count != "1" && isRealValue(data.query.results.place[0].country))
      {
        country_woeid = data.query.count == "1" ? data.query.results.place.country.woeid : data.query.results.place[0].country.woeid;
        isCountry = data.query.results.place[0].placeTypeName.content == "Country" ? true : false;
      }
      else if (data.query.count == "1" && isRealValue(data.query.results.place.country)) {
        country_woeid = data.query.count == "1" ? data.query.results.place.country.woeid : data.query.results.place[0].country.woeid;
        isCountry = data.query.results.place.placeTypeName.content == "Country" ? true : false;

      }
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

      var options3 = {
        url: 'https://api.twitter.com/1.1/trends/place.json',
        method: 'GET',
        headers: headers,
        qs: {'id': country_woeid}
      };  // options for the parent area
      
      request(options3, function (error3, response3, body3) {

        if (error3 || response3.statusCode != 200) {
          res.send(null);
          return;
        };
        var bodyData3 = JSON.parse(body3);
        var testName = bodyData3[0].trends[0].name;
        var set = new Set();
        if (!isCountry) {
          bodyData3[0].trends.forEach(function(value){
            set.add(value.name);
          });
        }
        console.log(testName);
        request(options2, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("country woeid is ");
            console.log(country_woeid);
            found = true;
            var bodyData = JSON.parse(body);
            bodyData[0].trends = bodyData[0].trends.filter(function(value, index, arr){
              return !set.has(value.name);
            });
            res.send(bodyData);
            res.end();
            return;
          } else {
            next(index + 1);
          }
        });

      }); 

    });
  })(0);
}});

module.exports = router;
