var express = require('express');
var router = express.Router();
var conn = require('./db');


  
  
function extracter(businesses){
    return businesses.map(({ type, geometry, place_name }) => ({ type, geometry,place_name }));
  }
  
 
 router.get('/projectFundersGet',function(req,res){



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


  router.get('/projectCollabs',function(req,res){

  


    
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

  router.get('/searchPerson', function(req,res){


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

  router.get('/searchPersonProject', function(req,res){

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


  router.get('/getPerson', function(req,res){

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

  router.get('/getPersonProject', function(req,res){
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

  module.exports = router;