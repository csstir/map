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
app.use(express.static(path.join(__dirname, '/public')));



//Create connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test1'
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

var geo = require('mapbox-geocoding');

geo.setAccessToken('pk.eyJ1IjoiZ3JlZzE5OTIyIiwiYSI6ImNqcGs1MzFkYTAzMWozcHQ2d3U2dW1yNjYifQ.Lx8JpJQhuTYFTWiVUL5kAg');


//route for homepage
app.get('/', (req, res) => {


  response = {
    value: req.query.value
  }


  if(response.value === 'Authors'){
    
  let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 10";
  // let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,GROUP_CONCAT(o.Output_Author_Name) AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID GROUP BY o.Organisation_Name LIMIT 10"
   authorResult(res,sql)
    

  }
  else{
    let sql = "SELECT o.Organisation_Name, o.Country_Name, o.Output_Author_Name, a.Output_Title_Name FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 10"

    paperResult(res,sql)

  // let sql = "SELECT c.Organisation_Name,c.Country_Name,p.Person_Name, o.Output_Title_Name, a.Author_Names FROM output ao INNER JOIN outputlist o ON o.Output_ID = ao.Output_ID INNER JOIN output_author_country c ON ao.country_fk = c.Output_Author_ID INNER JOIN authors a ON ao.a_fk = a.Author_ID INNER JOIN person p ON ao.p_fk = p.Person_ID";

  
}
});

function paperResult(res,sql){
  let query = conn.query(sql, (err, results) => {

    if (err) throw err;


    const geoPromise = param => new Promise((resolve, reject) => {
      geo.geocode('mapbox.places', param, function (err, geoData) {
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
        result.Output_Title_Name,
        result.Output_Author_Name
      ])

    );



    Promise.all(promises)
      .then((values) => {
        let results = values.map(elmt => elmt[0]);
        console.log('resultsssss', JSON.stringify(results))
   
        let businesses = values.map(elmt => elmt[1]);


        let names = values.map(elmt => elmt[2]);

        let authors = values.map(elmt => elmt[3])

  
  

        function groupByProp(data, prop) {
          let objsByPlaceName = data.reduce((res, item) => {
                  if (!item[prop]) 
                      return res;
                  let existing = res[item[prop]],
                      amount = existing && existing.amount
                          ? existing.amount + 1
                          : 1,
                      newObj = (() => {
                          if (existing && existing.geometry) 
                              return {amount, geometry: existing.geometry};
                          if (item.geometry) 
                              return {amount, geometry: item.geometry};
                          return {amount};
                      })();
                  return Object.assign(res, {
                      [item[prop]]: newObj
                  })
              }, {})
      
          return {
              "type": "FeatureCollection",
              "features": Object.keys(objsByPlaceName).map(key=> {
                   let obj = objsByPlaceName[key];
                   return {
                      type: "Feature",
                      geometry: obj.geometry,
                      properties: {
                        name: key,
                        amount: obj.amount
                      }
                   }
              })
          }
      }
      
      
       
     resultsCountry = groupByProp(results, 'place_name')


   

        var extractedValues = extracter(businesses) 


        var authorValues = authors.map((i) => (i));

        newObj = {
          type: "FeatureCollection",
          features: extractedValues,
          properties: '',
          authors: ''




        };
        


        var i = 0;
        while (names.length > 0 && i < names.length) {
          var properties = {};
          properties.title = names[i];
          extractedValues[i]["properties"] = properties;
          i++;
        }     

        
        var i = 0;
        while (authors.length > 0 && i < authors.length) {
          var authorTitle = {};
          newObj.features[i].properties.authorTitle = authors[i];
          authorValues[i]["authors"] = authorTitle;

          
          i++;
        }     


     


        res.render('layouts/layout', {
          results: JSON.stringify(resultsCountry),
          businesses: JSON.stringify(newObj),
          names: JSON.stringify(names)

        });
      })





  });
}

function extracter(businesses){
  return businesses.map(({ type, geometry, place_name }) => ({ type, geometry,place_name }));
}

function authorResult(res,sql){

 

  let query = conn.query(sql, (err, results) => {
    if (err) throw err;




    const geoPromise = param => new Promise((resolve, reject) => {
      geo.geocode('mapbox.places', param, function (err, geoData) {
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
        result.Output_Title_Name,
        result.author_names
      ])

    );



    Promise.all(promises)
      .then((values) => {


        let businesses = values.map(elmt => elmt[0]);


        let names = values.map(elmt => elmt[1]);

        let authors = values.map(elmt => elmt[2])

        var extractedValues = extracter(businesses)



        var authorValues = authors.map((i) => (i));

        newObj = {
          type: "FeatureCollection",
          features: extractedValues,
          properties: '',
          authors: ''




        };



        var i = 0;
        while (names.length > 0 && i < names.length) {
          var properties = {};
          properties.title = names[i];
          extractedValues[i]["properties"] = properties;
          i++;
        }


        var i = 0;
        while (authors.length > 0 && i < authors.length) {
          var authorTitle = {};
          newObj.features[i].properties.authorTitle = authors[i];
          authorValues[i]["authors"] = authorTitle;


          i++;
        }








        res.render('layouts/business', {
          //need to also send paper names, otherwise what's the point

          businesses: JSON.stringify(newObj),
          names: JSON.stringify(names)

        });







      });

  });
}

app.post('/', function (req, res) {


  if(req.body.value === 'Authors'){
    let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,GROUP_CONCAT(o.Output_Author_Name) AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID GROUP BY a.Output_Title_Name LIMIT 10";
  //  let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,GROUP_CONCAT(o.Output_Author_Name) AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID GROUP BY o.Organisation_Name LIMIT 10"
   authorResult(res,sql)
  }




})



//   let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,GROUP_CONCAT(o.Output_Author_Name) AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID GROUP BY a.Output_Title_Name LIMIT 10";

//   let query = conn.query(sql, (err, results) => {
//     if (err) throw err;


//     const geoPromise = param => new Promise((resolve, reject) => {
//       geo.geocode('mapbox.places', param, function (err, geoData) {
//         if (err) return reject(err);
//         if (geoData) {
//           resolve(geoData.features[0])
//         } else {
//           reject('No result found');
//         }
//       });
//     });
//     const promises = results.map(result =>

//       Promise.all([
//         geoPromise(result.Organisation_Name),
//         result.Output_Title_Name,
//         result.author_names
//       ])

//     );



//     Promise.all(promises)
//       .then((values) => {


//         let businesses = values.map(elmt => elmt[0]);


//         let names = values.map(elmt => elmt[1]);

//         let authors = values.map(elmt => elmt[2])

//         var extractedValues = businesses.map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));


//         var authorValues = authors.map((i) => (i));

//         newObj = {
//           type: "FeatureCollection",
//           features: extractedValues,
//           properties: '',
//           authors: ''




//         };



//         var i = 0;
//         while (names.length > 0 && i < names.length) {
//           var properties = {};
//           properties.title = names[i];
//           extractedValues[i]["properties"] = properties;
//           i++;
//         }


//         var i = 0;
//         while (authors.length > 0 && i < authors.length) {
//           var authorTitle = {};
//           newObj.features[i].properties.authorTitle = authors[i];
//           authorValues[i]["authors"] = authorTitle;


//           i++;
//         }









//         res.render('layouts/business', {
//           //need to also send paper names, otherwise what's the point

//           businesses: JSON.stringify(newObj),
//           names: JSON.stringify(names)

//         });







//       });

//   });
  
// });

// app.get('/?value=Authors', (req,res) => {
  
//   response = {
//     value: req.query.value
//   }

//   console.log('test')

// })



conn.on('error', console.error.bind(console, 'MongoDB connection error:'));



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


var port = 1234;

app.listen(port, () => {
  console.log('Server is up and running on port numner ' + port);
});







