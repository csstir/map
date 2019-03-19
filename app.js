var countryGet = require('./routes/map'); // Imports routes for the products
var projectGet = require('./routes/projects'); // Imports routes for the products
var paperGet = require('./routes/search'); // Imports routes for the products
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var mysql = require('mysql')

var routes = require('./routes/map');
const rateLimit = require("express-rate-limit");

var app = express();

// view engine setus

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.enable("trust proxy"); 

// const limiter = rateLimit({
//   windowMs: 0.2 * 60 * 1000, // 15 minutes
//   max: 2 // limit each IP to 100 requests per windowMs
// });
 
// //  apply to all requests
// app.use(limiter);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/js')));
app.use('/', countryGet, projectGet, paperGet)



//Create connection
const conn = mysql.createConnection({
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'b5c7a17152b9dc',
  password: 'ae054300',
  database: 'heroku_6fce93063dc3f54'
});
//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

var geo = require('mapbox-geocoding');

geo.setAccessToken('pk.eyJ1IjoiZ3JlZzE5OTIyIiwiYSI6ImNqcGs1MzFkYTAzMWozcHQ2d3U2dW1yNjYifQ.Lx8JpJQhuTYFTWiVUL5kAg');









app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});










// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var port = process.env.PORT || 3306;

app.listen(port, function() {
  console.log("Listening on " + port);
});


