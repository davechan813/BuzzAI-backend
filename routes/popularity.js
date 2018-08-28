var express = require('express');
var router = express.Router();
const googleTrends = require('google-trends-api');

router.post('/', function(req, res1) {
  console.log(req.body);
  googleTrends.interestByRegion({
    keyword: req.body.keyword,
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    geo: req.body.geo,
    resolution: req.body.resolution
  })
  .then((res2) => {
    console.log(res2);
    res1.send(res2);
  })
  .catch((err) => {
    console.log(err);
  })
});

module.exports = router;
