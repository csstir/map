var express = require('express');
var router = express.Router();

var mysql = require('mysql')
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


// Require the controllers WHICH WE DID NOT CREATE YET!!
var product_controller = require('../controllers/product');

var projectsGrab 

setTimeout(function() { 
  projectsGrab = grabProjects()
}, 0);




var funder_names
setTimeout(() => {

 funder_names = grabFunderNames()
  
}, 0);


function extracter(businesses){
    return businesses.map(({ type, geometry, place_name }) => ({ type, geometry,place_name }));
  }
  
  
  function grabFunderNames(){
    var data=[];
    sql = 'SELECT Distinct Funder_Name FROM project_funders';
  
    let query = conn.query(sql, (err, results) => {
    if (err) throw err;
   
    for(i=0;i<results.length;i++)
    {
    data.push(results[i].Funder_Name);
    }
  
 
    
    })
    return data
  
  }
  function grabProjects() {
    sql = 'SELECT o.Name, p.Role, p.Project_Org_Name, p.Project_Org_Name,p.Country_Name, p.Country_Name, f.Funder_Name FROM project_holding_table o INNER JOIN project_collaborators p ON o.ID = p.Project_ID INNER JOIN project_funders f ON f.Project_ID = o.ID GROUP BY o.ID LIMIT 20'
  projectsArray = []
  
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
          result.Name,
          result.Role,
          geoPromise(result.Project_Org_Name),
          result.Project_Org_Name,
          geoPromise(result.Country_Name),
          result.Country_Name,
          result.Funder_Name
  
        ])
  
      );
  
      Promise.all(promises)
        .then((values) => {
          
          let pNames = values.map(elmt => elmt[0])
          let roles = values.map(elmt => elmt[1])
          let projects = values.map(elmt => elmt[2])
          let collabNames = values.map(elmt => elmt[3])
          let countryNames = values.map(elmt => elmt[4])
          let countryProjects = values.map(elmt => elmt[5])
          let names = values.map(elmt => elmt[6])
  
  
  
          // res.send(JSON.stringify(data))
          projectsArray.push(pNames, roles,projects,collabNames,countryNames, countryProjects, names)
   
        })
  
       
    });
  
    return projectsArray
  
  
  
  }


router.get('/',function(req,res){

 
    let sql = "SELECT o.Organisation_Name,o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 20;";

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

       
     projectsToGrab = projectsGrab
  
    var namesObj = projectsToGrab[0].map((i) => (i));
    var rolesObj = projectsToGrab[1].map((i) => (i));

     var collabOrg = projectsToGrab[2].map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));

     var collabNamesObj = projectsGrab[3].map((i) => (i));
     var countryProjects = projectsGrab[4].map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));
     var countriesNames = projectsToGrab[5].map((i) => (i));
     var funderOrg = projectsToGrab[6].map((i) => (i));

     resultsCountryProjects = groupByProp(countryProjects, 'place_name')
     console.log(resultsCountryProjects)
 
      var i = 0;
         while (projectsToGrab[1].length > 0 && i < projectsToGrab[1].length) {
           var properties = {};
           properties.names = namesObj[i]
           properties.roles = rolesObj[i]
            properties.collabNames = collabNamesObj[i]
            properties.funder_title = funderOrg[i];
            properties.Country_Names = countriesNames[i]
           collabOrg[i]["properties"] = properties;
           i++;
         }     
 
 
     projectsObj = {
       type: "FeatureCollection",
       features: collabOrg
     }


       
  
        res.render('layouts/countries', {
          //need to also send paper names, otherwise what's the point
          countryNames:JSON.stringify(countries),
          countries: JSON.stringify(resultsCountry),
          businesses: JSON.stringify(newObj),
          names: JSON.stringify(names),
          projects: JSON.stringify(projectsObj),
          test:resultsCountry,
          test2:projectsObj,
          funder_names: funder_names,
          resultsCountryProjects:JSON.stringify(resultsCountryProjects),
          resultsCountries: resultsCountryProjects

        });







      });

  });

  
 


})



module.exports = router;