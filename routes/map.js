var express = require('express');
var router = express.Router();

var conn = require('../db');

var geo = require('mapbox-geocoding');

geo.setAccessToken('pk.eyJ1Ijoiam9obmRvaTIwMjQiLCJhIjoiY2p1cHlyaWx2MDNqaTN5bnk4MDRweXBudSJ9.K3k37HXcDI5hMP-Y-DgpFA');



var projectsGrab 

setTimeout(function() { 
  projectsGrab = grabProjects()
}, 0);




var funder_names
setTimeout(() => {

 funder_names = grabFunderNames()
  
}, 0);


function extracter(businesses){
    const newbusiness = businesses.filter(Boolean);
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
  /*
  *grabProjects() called from countries.hbs,
  *send extracted organisation_names to the mapbox geocoder
  *send the object to the route.get('/') call
  */
  function grabProjects() {
    sql = 'SELECT o.Name, o.Project_Type, o.sDate, o.eDate, p.Role, p.Project_Org_Address, p.Project_Org_Name,p.Country_Name, p.Country_Name, f.Funder_Name, per.Person_Name FROM project_name_table o INNER JOIN project_collaborators p ON o.Project_ID = p.Project_ID INNER JOIN project_funders f ON f.Project_ID = o.Project_ID INNER JOIN person per ON o.person_fk = per.Person_ID GROUP BY o.Project_ID LIMIT 20'
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
          result.Project_Type,
          result.sDate,
          result.eDate,
          result.Role,
          geoPromise(result.Project_Org_Address),
          result.Project_Org_Name,
          geoPromise(result.Country_Name),
          result.Country_Name,
          result.Funder_Name,
          result.Person_Name
  
        ])
  
      );
  
      Promise.all(promises)
        .then((values) => {
        
          
          let pNames = values.map(elmt => elmt[0])
          let pType = values.map(elmt => elmt[1])
          let sDate = values.map(elmt => elmt[2])
          let eDate = values.map(elmt => elmt[3])
          let roles = values.map(elmt => elmt[4])
          let projects = values.map(elmt => elmt[5])
          let collabNames = values.map(elmt => elmt[6])
          let countryNames = values.map(elmt => elmt[7])
          let countryProjects = values.map(elmt => elmt[8])
          let names = values.map(elmt => elmt[9])
          let person_name = values.map(elmt => elmt[10])

          projectsArray.push(pNames, pType, sDate, eDate, roles, projects, collabNames, countryNames, countryProjects, names, person_name)
       
          
        })
  
       
    });

   
  


    return projectsArray
  
  
  
  }






router.get('/',function(req,res){

 
var XFRAME_WHITELIST = [ 'https://linton59.co.uk/test/', 'https://y.com' ];
// If the domain matches, allow iframes from that domain
if (XFRAME_WHITELIST.indexOf(req.query.domain) !== -1) {
    res.header('X-FRAME-OPTIONS', 'ALLOW-FROM ' + req.query.domain);
}


    // let sql = "SELECT o.Organisation_Name, o.Country_Name,a.Output_Title_Name,o.Output_Author_Name AS author_names FROM output_author_country o INNER JOIN outputlist a ON o.Output_ID_fk = a.Output_ID LIMIT 20;"
    let sql = "SELECT DISTINCT l.Organisation_Address, l.Country_Name,a.Output_Title_Name, o.Output_Author_Name AS author_names, l.Organisation_Name,a.Handle FROM test o INNER JOIN outputlist a ON o.Output_ID = a.Output_ID INNER JOIN organisations l ON o.Organisation_ID = l.ID LIMIT 250"
    // let sql = "SELECT distinct a.Organisation_Name, a.Country_Name,o.Output_Title_Name, a.Output_Author_Name as author_names from complete_holding_table a INNER JOIN outputlist o ON a.Paper_ID = o.Output_ID";


    // let sql1 = '  SELECT o.Output_Title_Name, a.Output_Author_Name, a.Organisation_Name, a.Country_Name, p.Person_Name from complete_holding_table a INNER JOIN outputlist o ON a.Paper_ID = o.Output_ID INNER JOIN person p ON a.Person_ID = p.Person_ID'
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
        geoPromise(result.Organisation_Address),
        result.Output_Title_Name,
        result.author_names,
        result.Organisation_Name,
        result.Handle
      ])

    );

   

   
    Promise.all(promises)
      .then((values) => {

        let countries = values.map(elmt => elmt[0])

        let businesses = values.map(elmt => elmt[1]);


        let names = values.map(elmt => elmt[2]);

        let authors = values.map(elmt => elmt[3]);

        let placename = values.map(elmt => elmt[4])

        let handle = values.map(elmt => elmt[5])

        
    //TODO:FIX NULL VALUES ERROR

    try{
        var extractedValues = extracter(businesses)
    }
    catch(e){
      console.log(e, 'probably getting a null within the mapbox geocode result return')
    }



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

        for (i = 0; i < businesses.length; i++) {


          
           var place_name = businesses[i].place_name
          var newgeo = businesses[i].geometry.coordinates.toString();
          var geo = businesses[i].geometry.type

          

          var fields = newgeo.split(',')

          lat = fields[0].substring(0, 7)
          long = fields[1].substring(0, 7)

     

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
          newObj.features[i].properties.businessName = placename[i]
          newObj.features[i].properties.handle = handle[i]
          authorValues[i]["authors"] = authorTitle;


          i++;
        }
        

       
     projectsToGrab = projectsGrab

  
    var namesObj = projectsToGrab[0].map((i) => (i));

    var pType = projectsGrab[1].map((i) => (i));
    var sDate = projectsGrab[2].map((i) => (i));
    var eDate = projectsGrab[3].map((i) => (i));
    var rolesObj = projectsToGrab[4].map((i) => (i));
    
     var collabOrg = projectsToGrab[5].map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));
     var collabNamesObj = projectsGrab[6].map((i) => (i));
     var countryProjects = projectsGrab[7].map(({ type, geometry, place_name }) => ({ type, geometry, place_name }));
     var countriesNames = projectsToGrab[8].map((i) => (i));
     var funderOrg = projectsToGrab[9].map((i) => (i));
     var personName = projectsGrab[10].map((i) => (i))

     resultsCountryProjects = groupByProp(countryProjects, 'place_name')
 
      var i = 0;
         while (projectsToGrab[1].length > 0 && i < projectsToGrab[1].length) {
           var properties = {};
           properties.names = namesObj[i]
           properties.type = pType[i]
           properties.sDate = sDate[i]
           properties.eDate = eDate[i]
           properties.roles = rolesObj[i]
            properties.collabNames = collabNamesObj[i]
            properties.funder_title = funderOrg[i];
            properties.Country_Names = countriesNames[i];
           properties.Person_Name = personName[i]
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