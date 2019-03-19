var countryGet = require('./routes/map'); // Imports routes for the products
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

// view engine setus

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
app.use('/', countryGet)



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

;



function extracter(businesses){
  return businesses.map(({ type, geometry, place_name }) => ({ type, geometry,place_name }));
}





app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/search',function(req,res){

  conn.query('SELECT Output_Author_Name from output_author_country WHERE Output_Author_Name like "%'+req.query.key+'%"',
  function(err, rows, fields) {
  if (err) throw err;
  var data=[];
  for(i=0;i<rows.length;i++)
  {
  data.push(rows[i].Output_Author_Name);
  }


  res.send(JSON.stringify(data))
  });
  });


  function convertStr (input) {
    var datePart = input.match(/\d+/g),

    year = datePart[0].substring(0,4), // get only two digits
  
    month = datePart[1], day = datePart[2];
  
    return day+'/'+month+'/'+year;
  }

  
  app.get('/dateAuthor',function(req,res){


    sDate = req.query.sday;
    eDate = req.query.eday;
    startDate = convertStr(sDate)
    endDate = convertStr(eDate)


    sql1 = 'SELECT a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID where Output_Pub > "'+sDate+'" AND Output_OutPub < "'+eDate+'" LIMIT 20'



    let query = conn.query(sql1, (err, results) => {

      if (err) throw err;
  
  

      const promises = results.map(result =>
  
        Promise.all([
         
          result.author_names,
          result.Output_Title_Name
   
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
          let authors = values.map(elmt => elmt[0])

          let names = values.map(elmt => elmt[1]);
  
         
          var namesArray = []
          var i = 0;
          while (names.length > 0 && i < names.length) {
            var properties = {};
            namesArray.push({name: names[i], author: authors[i]})
         console.log(namesArray[i].name)
 
            i++;
          }     

          

    res.send(namesArray)
        })
  
  
  
  
  
    });


  })

  app.get('/dateProject',function(req,res){


    sDate = req.query.sday;
    eDate = req.query.eday;


    sql1 = 'SELECT Name, DATE(sDate) as "start", DATE(eDate) as "end", p.Project_Org_Name from project_name_table o INNER JOIN project_collaborators p ON p.Project_Id = o.Project_ID where sDate > "'+sDate+'" AND eDate < "'+eDate+'" LIMIT 20'
    
    

    let query = conn.query(sql1, (err, results) => {

      if (err) throw err;
  
  
   
      const promises = results.map(result =>
  
        Promise.all([
         
          result.Name,
          result.start,
          result.end,
          result.Project_Org_Name
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
  
          
          let namesTitle = values.map(elmt => elmt[0]);
          
          let sDate = values.map(elmt => elmt[1]);
          
          let eDate = values.map(elmt => elmt[2]);

          let projectOrg = values.map(elmt => elmt[3])
         
  
          var namesArray = []
          var i = 0;
          while (namesTitle.length > 0 && i < namesTitle.length) {
            var properties = {};
            namesArray.push({name: namesTitle[i], projectOrgs: projectOrg[i]})
         console.log(namesArray[i].name)
 
            i++;
          }     

  
          res.send(namesArray)

          
 
        })
  
  
  
  
  
    });


  })

  app.get('/searchOrganisation', function(req,res){


    conn.query('SELECT Organisation_Name from output_author_country WHERE Organisation_Name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Organisation_Name);
    }
  
  
    res.send(JSON.stringify(data))
  
    });

  })

  app.get('/searchProjects', function(req,res){

console.log('FIRE',req.query.key)
    conn.query('SELECT Funder_Name from project_funders WHERE Funder_Name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Funder_Name);
    }
  
  
    res.send(JSON.stringify(data))
  
    });

  })

  app.get('/searchCollabs', function(req,res){

 
        conn.query('SELECT Project_Org_Name from project_collaborators WHERE Project_Org_Name like "%'+req.query.key+'%"',
        function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++)
        {
        data.push(rows[i].Project_Org_Name);
        }
      
      
        res.send(JSON.stringify(data))
      
        });
    
      })
    


  
app.get('/organisationGet', function (req, res) {



  sql1 = 'SELECT a.Organisation_Name, a.Country_Name, o.Output_Title_Name, a.Output_Author_Name as author_names from complete_holding_table a INNER JOIN outputlist o ON a.Paper_ID = o.Output_ID WHERE a.Organisation_Name = "' + req.query.typeaheadGet + '" LIMIT 20'

  let query = conn.query(sql1, (err, results) => {

    if (err) throw err;

    const promises = results.map(result =>

      Promise.all([

        result.Organisation_Name,
        result.Country_Name,
        result.Output_Title_Name

      ])

    );



    Promise.all(promises)
      .then((values) => {



        let businesses2 = values.map(elmt => elmt[0]);
        let country = values.map(elmt => elmt[1]);
        let names = values.map(elmt => elmt[2]);




        var namesArray = []
        var i = 0;
        while (names.length > 0 && i < names.length) {
          var properties = {};
          namesArray.push({ businessName: businesses2[i], countryName: country[i], names:names[i] })
          i++;
        }



        res.send(namesArray)
      })





  });


})

  app.get('/projectFundersGet',function(req,res){



    let sql = 'SELECT o.Name, p.Project_Org_Name,p.Country_Name, f.Funder_Name FROM project_holding_table o INNER JOIN project_collaborators p ON o.ID = p.Project_ID INNER JOIN project_funders f ON f.Project_ID = o.ID WHERE f.Funder_Name = "'+req.query.typeaheadGet+'" GROUP BY o.ID LIMIT 20'
    

    let query = conn.query(sql, (err, results) => {

      if (err) throw err;
  
  
  
      const promises = results.map(result =>
  
        Promise.all([
         
          result.Name,
         result.Project_Org_Name,
          result.Country_Name,
          result.Funder_Name
       
        ])
  
      );
  
  
  
      Promise.all(promises)
        .then((values) => {
      
  
          
          let names = values.map(elmt => elmt[0]);
          let org_names = values.map(elmt => elmt[1]);
          let results = values.map(elmt => elmt[2]);
          let funders = values.map(elmt => elmt[3])
  
    
          var namesArray = []
          var i = 0;
          while (names.length > 0 && i < names.length) {
            var properties = {};
            namesArray.push({ businessName: org_names[i], countryName: results[i], names:names[i], funderNames: funders[i] })
            i++;
          }
  
  
  
          res.send(namesArray)

        })
  
  
  
  
  
    });


  })


  app.get('/projectCollabs',function(req,res){

  


    
    conn.query('SELECT p.Role,p.Project_Org_Name,f.Funder_Name,o.Name FROM project_holding_table o INNER JOIN project_collaborators p ON o.ID = p.Project_ID INNER JOIN project_funders f ON f.Project_ID = o.ID WHERE p.Project_Org_Name = "'+req.query.typeaheadCollabs+'" GROUP BY o.ID LIMIT 20',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Role)
    data.push(rows[i].Project_Org_Name);
    data.push(rows[i].Funder_Name)
    data.push(rows[i].Name)
 
    }
  
  
    res.send(JSON.stringify(data))
  
    });

  
  
  
  
  



  })

  app.get('/searchPerson', function(req,res){


    conn.query('SELECT Person_Name from person_holding_table WHERE Person_Name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Person_Name);
    }
  
  
    res.send(JSON.stringify(data))
  
    });

  })

  app.get('/searchPersonProject', function(req,res){

    console.log(req.query.key)

    conn.query('SELECT Person_Name from fns_projects WHERE Person_Name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Person_Name);
    }
  
  
    res.send(JSON.stringify(data))
  
    });

  })


  app.get('/getPerson', function(req,res){

    console.log('key is' + req.query.typeaheadPersonGet)
    console.log(req.query.typeaheadPersonGet)

    conn.query('SELECT DISTINCT a.Output_Title_Name, p.Person_Name from person_holding_table p INNER JOIN complete_holding_table c ON c.Person_ID = p.Person_ID INNER JOIN outputlist a ON  a.Output_ID = c.Paper_ID WHERE p.Person_Name like "%'+req.query.typeaheadPersonGet+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Output_Title_Name)
    data.push(rows[i].Person_Name);
    }
  
    console.log('data', data)
  
    res.send(JSON.stringify(data))
  
    });

  })

  app.get('/getPersonProject', function(req,res){
console.log('firedfired')
    console.log('key is' + req.query.typeaheadPersonProjectGet)
    console.log(req.query.typeaheadPersonGet)

    conn.query('SELECT Distinct Name, p.Person_Name FROM project_name_table INNER JOIN fns_projects p ON person_fk = p.Person_ID WHERE p.Person_Name like "%'+req.query.typeaheadPersonProjectGet+'%"',
    function(err, rows, fields) {
    if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i].Name)
    data.push(rows[i].Person_Name);
    }
  
    console.log('data', data)
  
    res.send(JSON.stringify(data))
  
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


var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});


