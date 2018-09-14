var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var popularityRouter = require ('./routes/popularity');
var buzz10Router = require('./routes/buzz10')

var app = express();

var nocache = require('nocache')
app.use(nocache())

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  //'Content-Type': 'application/json',

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/popularity', popularityRouter)
app.use('/buzz10', buzz10Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

var request = require('request');


var options = {
  url: 'https://api.twitter.com/oauth2/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Authorization' : 'Basic M0FxbGVxOTNDUEttajFPaTlWeldqYzljQTpCTUFNN3Q3UWdtTTdEdzJBUEFPT3FmdTJZb3JXYk9WQXMwaE9EQWdpRUNraVFkcFFweg=='
  },
  body: "grant_type=client_credentials"
};

var store = require("store")

function callback(error, response, body) {

  if (!error && response.statusCode == 200) {
    console.log(body);

    store.set("key", JSON.parse(body).access_token)
    
     
  } else {
    console.log(error);
  }
}

request(options, callback);


// hardcoded version
// store.set("key", "AAAAAAAAAAAAAAAAAAAAAER18QAAAAAAuxBUIdgyeHHYJ42lNI%2FhjFINCKY%3DRsS6KTVpWCGU06S5wQNEkt06Awk08pPLVQsHvKs0nsyebn1zEF")


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
