var express = require('express');
var router = express.Router();

const googleTrends = require('google-trends-api');



var startTime, endTime, keyWord, geoString, resolution;


router.post('/', function(req, res, next) {

    startTime = req.body.startTime;
    endTime = req.body.endTime;
    keyWord = req.body.keyWord;
    geoString = req.body.geoString;
    resolution = req.body.resolution;
    console.log("hello")
    console.log(startTime);
    // startTime : 2011-11-21

    var startDate = new Date(startTime.split('-')[0], startTime.split('-')[1], startTime.split('-')[2]);
    var endDate = new Date(endTime.split('-')[0], endTime.split('-')[1], endTime.split('-')[2]);
    
    next();
    // now params are ready

    googleTrends.interestByRegion({keyword: keyWord, startTime: startDate, endTime: endDate, geo: geoString})
.then((res2) => {
  console.log(keyWord);

  router.post('/', function(req, res3, next) {


    console.log('get here');
    res3.send(res2);
  });
})
.catch((err) => {
  console.log(err);
})

});



module.exports = router;
