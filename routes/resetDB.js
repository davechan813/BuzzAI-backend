var express = require('express');
var mongoose = require('mongoose');
var influencers = require('../data/Influencer_list'); // import json file (name to Influencer_list.json)
var db_url = require('../keys').db_url;

var router = express.Router();
router.get('/', function(req, res, next) {
  mongoose.connect(db_url);
  
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("connected to db in resetDB.js");
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

  // let 'True' can be parsed to true: https://mongoosejs.com/docs/schematypes.html#booleans
  mongoose.Schema.Types.Boolean.convertToTrue.add('True');
  mongoose.Schema.Types.Boolean.convertToFalse.add('False');

  var Influencer = mongoose.model('Influencer', influencerSchema);
  
  for (var i of influencers) {
    var i_object = new Influencer({
      Username: i.Username,
      Topic: i.Topic,
      FullName: i.FullName,
      Followers: i.Followers,
      Followees: i.Followees,
      Posts: i.Posts,
      Email: i.Email,
      Phone: i.Phone,
      ExternalURL: i.ExternalURL,
      Business: i.Business,
      Business_category: i.Business_category,
      Language: i.Language,
      Profile_pic: i.Profile_pic,
      Biography: i.Biography		
    });

    i_object.save(function (err, i_object) {
      if (err) return console.error(err);
      console.log("saved:", i_object);
    });
  }

  // Influencer.find({ Username: /^052aa/ }, function (err, influencers) {
  //   if (err) return console.log(err);
  //   console.log(influencers);
  // })
});
  
module.exports = router;
