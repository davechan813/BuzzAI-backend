var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db_url = require('../keys').db_url;

var router = express.Router();
// router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//database things
mongoose.connect(db_url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to db");
});

const ObjectId = mongoose.Types.ObjectId;

var realSchema = mongoose.Schema({
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
  // _id : Object,
  // socialId: String,
  // name : String,
  // link : String,
  // fullname : String,
  // followers : Number,
  // engagements : Number,
  // picture : String,
  // langs : String,
  // genders : String,
  // geoLocation : Object,//[{id: Number, title: String, type: String, countryCode: String}],
  // brandCategories : Object,//[{id : Number, title: String}],
  // audienceAges : Object,//{_18_24: Number, _25_34: Number, _35_44: Number},
  // audienceGenders : Object,
  // audienceGendersPerAge : Object,//{_18_24:{male:Number, female:Number}, _25_34:{male:Number, female:Number},_35_44:{male:Number, female:Number}},
  // audienceGeoLocation : Object,//[{id:Number, title:String, type:String, weight:Number, countryCode:String}],
  // emails : [String], //[String]
  // contacts : Object,//[{type:String, value:String, lastSeen:String}],
  // influencer : Object,//{ geoLocation:[{id:Number,title:String,type:String,countryCode:String}],
  //                 //   genders:String,
  //                 //   langs:String,
  //                 //   brands:[{id:Number,title:String}],
  //                 //   brandCategories:[{id:Number,title:String}]}
});


var Accounts = mongoose.model('new_accounts', realSchema)

router.post('/', function(req, res){
  var searchStr = req.body.value;
  var sortStr = req.body.sort;
  console.log(searchStr);

  var sortObj = {};
  if(sortStr == 'followersPlus') sortObj = {Followers : 1};
  if(sortStr == 'followersMinus') sortObj = {Followers : -1};
  if(sortStr == 'engagementPlus') sortObj = {Posts : 1};
  if(sortStr == 'engagementMinus') sortObj = {Posts : -1};
  

  Accounts.find({$text: {$search: searchStr}}).sort(sortObj).find(function (err, accounts) {
    if (err) return function(err) { console.log(err); };
    if (accounts) {
      res.send(accounts)
    }
  });
});

module.exports = router;