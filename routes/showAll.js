var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db_url = require('../keys').db_url;

var router = express.Router();
// router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

mongoose.connect(db_url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to db");
});

// const ObjectId = mongoose.Types.ObjectId

// var realSchema = mongoose.Schema(
//     {
//         _id : Object,
//         socialId: String,
//         name : String,
//         link : String,
//         fullname : String,
//         followers : Number,
//         engagements : Number,
//         picture : String,
//         langs : String,
//         genders : String,
//         geoLocation : Object,//[{id: Number, title: String, type: String, countryCode: String}],
//         brandCategories : Object,//[{id : Number, title: String}],
//         audienceAges : Object,//{_18_24: Number, _25_34: Number, _35_44: Number},
//         audienceGenders : Object,
//         audienceGendersPerAge : Object,//{_18_24:{male:Number, female:Number}, _25_34:{male:Number, female:Number},_35_44:{male:Number, female:Number}},
//         audienceGeoLocation : Object,//[{id:Number, title:String, type:String, weight:Number, countryCode:String}],
//         emails : [String], //[String]
//         contacts : Object,//[{type:String, value:String, lastSeen:String}],
//         influencer : Object,//{ geoLocation:[{id:Number,title:String,type:String,countryCode:String}],
//                         //   genders:String,
//                         //   langs:String,
//                         //   brands:[{id:Number,title:String}],
//                         //   brandCategories:[{id:Number,title:String}]}
//     }
// )

//search by name, fullname, geoLoc, brandCat
// this is commented because indexes can be only setup once
// realSchema.index({name: 'text', fullname: 'text'});


var Accounts = mongoose.model('new_accounts');


router.post('/', function(req, res){
  var start = parseInt(req.body.start);
  var length = parseInt(req.body.length);
  var sortStr = req.body.sort;

  var sortObj = null;
  if(sortStr == 'followersPlus') sortObj = {Followers: 1};
  else if(sortStr == 'followersMinus') sortObj = {Followers: -1};
  else if(sortStr == 'engagementPlus') sortObj = {Engagements: 1};
  else if(sortStr == 'engagementMinus') sortObj = {Engagements: -1};
  else sortObj = {};

  Accounts.find().skip(start).limit(length).sort(sortObj).find(function (err, accounts) {
    if (err) return function(err){console.log(err)};
    if (accounts) {
      res.send(accounts);
    }
  });
});

module.exports = router;