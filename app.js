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
app.use(express.static(path.join(__dirname, '/js')));



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

geo.setAccessToken('pk.eyJ1IjoidGVzdGdyZWciLCJhIjoiY2pzcWswamg2MDJ1dDRhcXF3MGZvdTlheCJ9.Cha04H1vaqHHDCs9mNrgLg');


//route for homepage
app.get('/', (req, res) => {


  response = {
    value: req.query.value
  }


  if(response.value === 'Authors'){
    
  let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 20";
  // let sql = "SELECT o.Organisation_Name,a.Output_Title_Name,GROUP_CONCAT(o.Output_Author_Name) AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID GROUP BY o.Organisation_Name LIMIT 10"
   authorResult(res,sql)
    

  }

  if(response.value === 'countries'){
    let sql = "SELECT o.Organisation_Name,o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 20";
    countryResult(res,sql)
  }
 
  else{
    let sql = "SELECT o.Organisation_Name, o.Country_Name, o.Output_Author_Name, a.Output_Title_Name FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 20"

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


function countryResult(res,sql){

 

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
        result.author_names
      ])

    );



    Promise.all(promises)
      .then((values) => {

        let countries = values.map(elmt => elmt[0])

        let businesses = values.map(elmt => elmt[1]);


        let names = values.map(elmt => elmt[2]);

        let authors = values.map(elmt => elmt[3])

        var extractedValues = extracter(businesses)



        var authorValues = authors.map((i) => (i));

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
      
      
       
     resultsCountry = groupByProp(countries, 'place_name')
     

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
       
          properties.countries = countries[i].place_name
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


          console.log(JSON.stringify(resultsCountry))
          console.log(resultsCountry.features.length)
          console.log(newObj.features.length)

        res.render('layouts/countries', {
          //need to also send paper names, otherwise what's the point
          countryNames:JSON.stringify(countries),
          countries: JSON.stringify(resultsCountry),
          businesses: JSON.stringify(newObj),
          names: JSON.stringify(names),
          test:resultsCountry

        });







      });

  });
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/search',function(req,res){

  console.log(req.query.key)
  conn.query('SELECT Output_Author_Name from output_author_country WHERE Output_Author_Name like "%'+req.query.key+'%"',
  function(err, rows, fields) {
  if (err) throw err;
  var data=[];
  for(i=0;i<rows.length;i++)
  {
  data.push(rows[i].Output_Author_Name);
  }


  res.send(JSON.stringify(data))
  console.log(JSON.stringify(data))
  });
  });

  function getTitleObject(data){
    console.log(data)
  }

  function convertStr (input) {
    var datePart = input.match(/\d+/g),

    year = datePart[0].substring(0,4), // get only two digits
  
    month = datePart[1], day = datePart[2];
  
    return day+'/'+month+'/'+year;
  }

  // app.get('/dateAuthor',function(req,res){

  //   sDate = req.query.sday;
  //   eDate = req.query.eday;
  //   startDate = convertStr(sDate)
  //   endDate = convertStr(eDate)

  //   console.log(startDate, endDate)

  //   conn.query('SELECT Output_Title_Name FROM outputlist WHERE Output_Pub between "'+startDate+'" and "11/03/2019" && Output_OutPub between "'+endDate+'" and "11/03/2019" LIMIT 20',
  //   function(err, rows, fields) {
  //   if (err) throw err;
  //   var data1=[];
  //   for(i=0;i<rows.length;i++)
  //   {
  //   data1.push(rows[i].Output_Title_Name);
  //   }

  //   res.send(JSON.stringify(data1))
  //   console.log(JSON.stringify(data1))

  
  //   });

  
  

  // });

  app.get('/dateAuthor',function(req,res){

    sDate = req.query.sday;
    eDate = req.query.eday;
    startDate = convertStr(sDate)
    endDate = convertStr(eDate)

    console.log(sDate,eDate)

    sql1 = 'SELECT o.Organisation_Name,o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID WHERE a.Output_Pub between "'+startDate+'"  and "11/03/2019" && a.Output_OutPub between "'+endDate+'" and "11/03/2019" LIMIT 20'
    

    let query = conn.query(sql1, (err, results) => {

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
          geoPromise(result.Country_Name),
          result.Output_Title_Name,
          result.Output_Author_Name
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
  
          
          let businesses = values.map(elmt => elmt[0]);
          let results = values.map(elmt => elmt[1]);
  
  
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
  
          
       
  
  
       
  
  
    console.log(JSON.stringify(newObj))
    res.send(JSON.stringify(newObj))
        })
  
  
  
  
  
    });


  })

  app.get('/searchOrganisation', function(req,res){

    console.log('search got1')
    console.log(req.query.key)
    conn.query('SELECT Organisation_Name from output_author_country WHERE Organisation_Name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Organisation_Name);
    }
  
  
    res.send(JSON.stringify(data))
    console.log(JSON.stringify(data))
    });

  })


  app.get('/authorGrab', function(req,res){

    console.log('org',req.query.typeahead)

    let sql = 'SELECT o.Organisation_Name,o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID WHERE o.Output_Author_Name = "'+req.query.typeahead+'" LIMIT 20'
     searchGrab(res,sql)
  })

  function searchGrab(res,sql){


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
          geoPromise(result.Country_Name),
          result.Output_Title_Name,
          result.Output_Author_Name
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
  
          
          let businesses = values.map(elmt => elmt[0]);
          let results = values.map(elmt => elmt[1]);
  
  
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
  
  
        
  
          newObj = {
            type: "FeatureCollection",
            features: extractedValues,
        
  
  
  
  
          };
          
  
  
          var i = 0;
          while (names.length > 0 && i < names.length) {
            var properties = {};
            properties.title = names[i];
            extractedValues[i]["properties"] = properties;
            i++;
          }     
  
          
       
  
  
       
  
  
    console.log(JSON.stringify(newObj))
    res.send(JSON.stringify(newObj))
        })
  
  
  
  
  
    });


  }
  
  app.get('/organisationGet',function(req,res){

    console.log('org',req.query.typeaheadGet)
    

    sql1 = 'SELECT o.Organisation_Name,o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID WHERE o.Organisation_Name = "'+req.query.typeaheadGet+'" LIMIT 20'
    

    let query = conn.query(sql1, (err, results) => {

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
          geoPromise(result.Country_Name),
          result.Output_Title_Name,
          result.Output_Author_Name
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
  
          
          let businesses = values.map(elmt => elmt[0]);
          let results = values.map(elmt => elmt[1]);
  
  
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
  
  
        
  
          newObj = {
            type: "FeatureCollection",
            features: extractedValues,
        
  
  
  
  
          };
          
  
  
          var i = 0;
          while (names.length > 0 && i < names.length) {
            var properties = {};
            properties.title = names[i];
            extractedValues[i]["properties"] = properties;
            i++;
          }     
  
          
       
  
  
       
  
  
    console.log(JSON.stringify(newObj))
    res.send(JSON.stringify(newObj))
        })
  
  
  
  
  
    });


  })


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







