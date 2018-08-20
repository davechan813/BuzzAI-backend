var express = require('express');
const googleTrends = require('google-trends-api');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BuzzAI' });
});

googleTrends.interestOverTime({keyword: 'UCLA'})
.then(function(results){
  console.log('These results are awesome', results);
})
.catch(function(err){
  console.error('Oh no there was an error', err);
});

module.exports = router;
