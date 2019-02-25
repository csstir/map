var product = require('./routes/map'); // Imports routes for the products
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var mysql = require('mysql')

var routes = require('./routes/map');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Create connection
const conn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'root',
database: 'test1'
});

//connect to database
conn.connect((err) =>{
if(err) throw err;
console.log('Mysql Connected...');
});

var geo = require('mapbox-geocoding');

geo.setAccessToken('pk.eyJ1IjoiZ3JlZzE5OTIyIiwiYSI6ImNqcGs1MzFkYTAzMWozcHQ2d3U2dW1yNjYifQ.Lx8JpJQhuTYFTWiVUL5kAg');


//route for homepage
app.get('/', (req, res) => {

  response = {
    value : req.query.value
  }

  let sql = "SELECT c.Organisation_Name,c.Country_Name,p.Person_Name, o.Output_Title_Name, a.Author_Names FROM output ao INNER JOIN outputlist o ON o.Output_ID = ao.Output_ID INNER JOIN output_author_country c ON ao.country_fk = c.Output_Author_ID INNER JOIN authors a ON ao.a_fk = a.Author_ID INNER JOIN person p ON ao.p_fk = p.Person_ID";

  let query = conn.query(sql, (err, results) => {

    if (err) throw err;

    
    const geoPromise = param => new Promise((resolve, reject) => {
      geo.geocode('mapbox.places', param, function(err, geoData) {
        if (err) return reject(err);
        if (geoData) {
          resolve(geoData.features[0])
        } else {
          reject('No result found');
        }
      });
    });

    const promises = results.map(result =>
    
      Promise.all([
        geoPromise(result.Country_Name),
        geoPromise(result.Organisation_Name),
        result.Output_Title_Name
      ])
   
      );

    

      Promise.all(promises)
      .then((values) => {
        let results = values.map(elmt => elmt[0]);
        let businesses = values.map(elmt => elmt[1]);
    
        let names = values.map(elmt => elmt[2]);
        res.render('layouts/layout', {
          results: JSON.stringify(results),
          businesses: JSON.stringify(businesses),
          names: JSON.stringify(names)
        });
    })





  });
});

app.post('/', function(req, res){
  response = {
    value : req.body.value
  }

  if(response.value === 'Places'){

    let sql = "SELECT c.Organisation_Name,c.Country_Name,p.Person_Name, o.Output_Title_Name, a.Author_Names FROM output ao INNER JOIN outputlist o ON o.Output_ID = ao.Output_ID INNER JOIN output_author_country c ON ao.country_fk = c.Output_Author_ID INNER JOIN authors a ON ao.a_fk = a.Author_ID INNER JOIN person p ON ao.p_fk = p.Person_ID";

    let query = conn.query(sql, (err, results) => {
  
      if (err) throw err;
  
      
      const geoPromise = param => new Promise((resolve, reject) => {
        geo.geocode('mapbox.places', param, function(err, geoData) {
          if (err) return reject(err);
          if (geoData) {
            resolve(geoData.features[0])
          } else {
            reject('No result found');
          }
        });
      });
  
      const promises = results.map(result =>
      
        Promise.all([
         
          geoPromise(result.Organisation_Name),
          
        ])
     
        );
  
      
  
        Promise.all(promises)
        .then((values) => {
          let businesses = values.map(elmt => elmt[0]);
      
          
          res.render('layouts/business', {
          //need to also send paper names, otherwise what's the point
            businesses: JSON.stringify(businesses)
          });
       
    
    
    
      
    
    
      });
    
    });
  }
});



conn.on('error', console.error.bind(console, 'MongoDB connection error:'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});







