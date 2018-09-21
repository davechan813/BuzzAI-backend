var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db_url = require('../keys').db_url;

var router = express.Router();
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.post('/', function(req, res){
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("connected to db in filter.js")
  });

  var influencerSchema = new mongoose.Schema({
    Username: String,
    Topic: String,
    FullName: String,
    Followers: Number,
    Followees: Number,
    Posts: Number,
    Email: String,
    Phone: String,
    ExternalURL: String,
    Business: Boolean,
    Business_category: String,
    Language: String,
    Profile_pic: String,
    Biography: String				
  });
  var Influencer = mongoose.model('Influencer', influencerSchema);

  var topic = req.body.topic;
  var followers = req.body.followers;
  var sort = req.body.sort; // followersPlus, followersMinus, engagementPlus, engagementMinus

  var topicObj = {};
  if (topic) topicObj = {"Topic": topic};

  var followersObj = {};
  if (followers) {
    var insideObj = new Object();
    var range = followers.split(' - ');
    insideObj.$gt = range[0];
    insideObj.$lt = range[1];
    followersObj = {"followers": insideObj};
  }

  var sortObj = null;
  if (sort == 'followersPlus') sortObj = {followers : 1};
  else if (sort == 'followersMinus') sortObj = {followers : -1};
  else sortObj = {};

  var queryObj = {$and: [topicObj, followersObj]};

  Influencer.find(queryObj).sort(sortObj).limit(400).find(function (err, influencers) {
    if (err) return function(err) { console.log(err); };
    if (influencers) {
      res.send(influencers);
    }
  });
});

//export this router to use in our index.js
module.exports = router;