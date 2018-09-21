var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db_url = require('../keys').db_url;

var router = express.Router();
router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

router.post('/', function(req, res) {
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("connected to db in oid.js");
  });

  const ObjectId = mongoose.Types.ObjectId;
  var oid = new ObjectId(req.body.oid);
  console.log('oid:', oid);
  var queryObj = {_id: oid};

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
  
  Influencer.find(oid).find(function (err, influencers) {
    if (err) return function(err) { console.log(err); }
    if (influencers) {
      res.send(influencers);
    }
  });
});

module.exports = router;