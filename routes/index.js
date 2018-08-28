var express = require('express');
const googleTrends = require('google-trends-api');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BuzzAI' });
});

module.exports = router;
