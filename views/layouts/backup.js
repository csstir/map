<!DOCTYPE html>
<html>

<head>
  <meta charset='utf-8' />
  <title>Style circles with a data-driven property</title>
  <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.js'></script>
   <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.4.4/fuse.min.js"></script>
  <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css' rel='stylesheet' />
  <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet'>
  <link href='/stylesheets/stylesheets.css' type="text/css" rel='stylesheet'>

</head>

<body>
  <div class='sidebar' id="sidebar">
 
<button class="tablink" onclick="openPage('News', this, 'green');loadPapers();" id="defaultOpen">Papers</button>

<button class="tablink" onclick="openPage('Test', this, 'green'); loadProjects();">Projects</button>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>



    <script>


            var country_names = {{{countries}}}
     var results = {{{countries}}}
    var business1 = {{{ businesses }}}
     var projectsObj = {{{projects}}}
        

{{!-- 
        if (performance.navigation.type == 1) {
           console.log("Reloaded"); 
window.location = "http://localhost:1234/secondPage";
    }

        
        else{

           
     country_names = {{{countries}}}
     results = {{{countries}}}
     business1 = {{{ businesses }}}
     projectsObj = {{{projects}}}
        
       


        } --}}
        
  





 roleArray = []
 leadProjects = []
 collabProjects = []
 otherProjects = []
 partnerProjects = []

 
      
       

 for(i=0;i<projectsObj.features.length;i++){

   if(projectsObj.features[i].properties.roles === 'Collaborator'){
     collabProjects.push(projectsObj.features[i])
   }
   else if(projectsObj.features[i].properties.roles === 'Partner'){
     partnerProjects.push(projectsObj.features[i])
   }
   else if(projectsObj.features[i].properties.roles === 'Lead'){
     leadProjects.push(projectsObj.features[i])
   }
   else{
     otherProjects.push(projectsObj.features[i])
   }
     }
  
leadObj = {
     type: "FeatureCollection",
          features:leadProjects
}
partnerObj = {
    type: "FeatureCollection",
          features: partnerProjects
}
 collabObj = {
          type: "FeatureCollection",
          features: collabProjects

        }

        otherObj = {
              type: "FeatureCollection",
          features: otherProjects
        }

console.log(JSON.stringify(partnerObj))


resultsCountryProjects = {{{resultsCountryProjects}}}



let resultObject= business1.features.map(({ properties: { authorTitle, title }}) => 
            ({ authorTitle: authorTitle, title }));
            



    countryNames = {{{countryNames}}}

    names = {{{names}}}

 var lowResults = []
   var midResults = []
    var highResults = []

 obj = results

   obj = results
  let arrSorted = [];
    for(i=0;i<results.features.length;i++) {
      arrSorted.push(obj.features[i])
    
    }

   arrSorted.sort((a,b) => (a.properties.amount > b.properties.amount) ? -1 : 1)
    
   
  
 

    for(i=0;i<results.features.length;i++){
        const objLength = results.features[i].properties.amount
        if(objLength <=1){
            lowResults.push(results.features[i])
        }
              if((objLength >1) && (objLength <=3 )){
            midResults.push(results.features[i])
        }
              if(objLength > 3){
            highResults.push(results.features[i])
        }
    }

    

    lowResultsObj = {
               type: "FeatureCollection",
          features: lowResults
       
    }
      
    midResultsObj = {
         type: "FeatureCollection",
          features: midResults
    }
   
    highResultsObj = {
                 type: "FeatureCollection",
          features: highResults

    }
 
  {{!-- function loadPapers(){

       
        for(i=0;i<business1.features.length;i++){
           console.log(business1.features[i].geometry.coordinates)
     map.setPaintProperty('business_location11' + business1.features[i].geometry.coordinates, 'circle-color','#FF0000' )
      

               map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'none')
                map.setLayoutProperty('collabing' + i, 'visibility', 'none')
        }

      }

      function loadProjects(){

   for(i=0;i<business1.features.length;i++){
  console.log(business1.features[i].geometry.coordinates)
   map.setPaintProperty('business_location11' + business1.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )
        }

        for(i=0;i<projectsObj.features.length;i++){
               map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'visible')
                map.setLayoutProperty('collabing' + i, 'visibility', 'visible')
                  
   
        }

        
        

      } --}}
    

$(document).ready(function () {


     {{!-- $.ajax({
      type: "GET",
      url: "http://localhost:1234/grabProjects",
      crossDomain: true,
      dataType: "json",
         success: function(data){
           projectsArray.push(data)
        }
    }); --}}

  $("[name='value']").on('change', function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: "http://192.168.1.97:1234/",
      crossDomain: true,
      dataType: "json",
      data: $("#rati").serialize(),
    });
  });
});
    </script>


<div id="News" class="tabcontent">


     <div class='heading'>
      <h1>Papers</h1>
    </div>
      
      <div class="filter_options" id="filter_option">
         <h3>Select country</h3>
   <div class="filter_options_selections">
    
  {{#each test.features}}
  <label for={{this.properties.name}}>
  <input type="radio" name="country" class="checkboxSelect" value={{this.properties.name}} onClick="countryGrab(this.value)" >{{this.properties.name}}
  </label>
  {{/each}}
  </div>

        <div class="container_results">

  <form action="get" id="dateGet">
  Start Date: <input type="date" name="sday">
  End Date: <input type="date" name="eday">
  {{!-- <input type="submit"> --}}
  <button class="small blue button" value="Submit">Submit</button>
</form>

 
      
 

</div>


<div class="getPerson_container">
<form id="typeahead_person_submit" method="get">
         <input class="personGet tt-query" id="typeValue" spellcheck="false" autocomplete="off" name="typeaheadPersonGet" type="text" placeholder="Search for a Professor"/>
 
           <button class="small blue button" id="typeahead_person_submit" value="Submit">Submit</button>
           
         </form>

         </div>
    


<div class="getOrganisations_container">
<form id="typeahead_organisation_submit" method="get">
         <input class="organisationGet tt-query" id="typeValue" spellcheck="false" autocomplete="off" name="typeaheadGet" type="text" placeholder="Search for an Organisation" />
 
           <button class="small blue button" id="typeahead_organisation_submit" value="Submit">Submit</button>
           
         </form>

         </div>

         <div class="center_button" style="text-align: center;padding-top:3em;">

         <button class="large blue button" id="restButton" value="Submit">Reset</button>
         </div>


</div>






</div>



    <script type="text/javascript" src="/js/typeahead.min.js"></script>
    
  
    <script>

          
 

      $('input.personGet').typeahead({

      name: 'typeaheadPersonGet',
      remote: 'http://localhost:1234/searchPerson?key=%QUERY',
      limit: 2
    });
   


    $('input.organisationGet').typeahead({

      name: 'typeaheadGet',
      remote: 'http://localhost:1234/searchOrganisation?key=%QUERY',
      limit: 2
    });


  </script>
  


 <div class="paginination_container">

        <div id="listingTable"></div>

        {{!-- <button class="tablink_button" onclick="prevPage1()" id="btn_prev">Prev Page</button>
        <button class="tablink_button" onclick="nextPage1()" id="btn_next">Next Page</button>

  
        
        <div class="page_title_container">
        page:<span id="page"></span>
        </div> --}}
        
        </div>

        
<div id="Test" class="tabcontent">
<!--Projects-->

<div class="heading">
      <h1>Projects</h1>
    </div>

   

      <div class="filter_options_project" id="filter_option" style="color:black;">
      <h3>Select country</h3>
    
      <div class="filter_options_selections" >
        {{#each resultsCountries.features}}
        <label for={{this.properties.name}}>
          <input type="radio" name="projectCountries" class="projects_countries" value="{{this.properties.name}}"
            onclick="grabProjectCountries(this.value)">{{this.properties.name}}
        </label>
        {{/each}}
      </div>

          <div class="container_results">

  <form action="get" id="project_dGate">
  Start Date: <input type="date" name="sday">
  End Date: <input type="date" name="eday">
  {{!-- <input type="submit"> --}}
  <button class="small blue button" value="Submit">Submit</button>
</form>

 
      
 

</div>

    
  
<div class="searchBar_grouping">
<div class="getProject_container">
    <h3>Search for Funders</h3>
<form id="typeahead_project_submit" method="get">
         <input class="projectGet tt-query" id="typeValue" spellcheck="false" autocomplete="off" name="typeaheadGet" type="text" />
 
           <button class="small blue button" id="typeahead_project_submit" value="Submit">Submit</button>
           
         </form>

         </div>

         {{!-- <div class="center_button" style="text-align: center;padding-top:10px;">

         <button class="large blue button" id="restButton" value="Submit">Reset</button>
         </div> --}}
<div class="getCollab_container">
  <h3>Search for Collaborators</h3>
              <form id="typeahead_grab_collabs" method="get">
         <input class="collabsGet tt-query" id="typeValue" spellcheck="false" autocomplete="off" name="typeaheadCollabs" type="text" />
    
           <button class="small blue button" id="typeahead_grab_collabs" value="Submit">Submit</button>
         </form>
         </div>


         <div class="getPersonProject_container">
<form id="typeahead_personProject_submit" method="get">
         <input class="personProjectGet tt-query" id="typeValue" spellcheck="false" autocomplete="off" name="typeaheadPersonProjectGet" type="text" placeholder="Search for a Professor"/>
 
           <button class="small blue button" id="typeahead_personProject_submit" value="Submit">Submit</button>
           
         </form>

         </div>


         

         </div>

 <div class="center_button" style="text-align: center;padding-top:3em;">

         <button class="large blue button" id="restButtonProject" value="Submit">Reset</button>
         </div>
        
  
  </div>



</div>

    </div>

    


</div>

    <script type="text/javascript" src="/js/typeahead.min.js"></script>
   
<script>



  function grabProjectCountries(value){
  takeOffProjectHighlighter()

  value.toString().toUpperCase();
  var countriesProject = []
  
  for(i=0;i < projectsObj.features.length;i++){
    if(value.toString().toUpperCase() === projectsObj.features[i].properties.Country_Names){
              countriesProject.push(projectsObj.features[i].geometry.coordinates) 
    }
  }


  for(i=0;i<countriesProject.length;i++){
      map.setLayoutProperty('funding_locations' + countriesProject[i], 'visibility', 'visible')

  }

  createProjectCountryPop(value)

  
  }

  console.log(resultsCountryProjects )

  function createProjectCountryPop(countries){

    


      var popUps = document.getElementsByClassName('mapboxgl-popup');
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

      let titleSetting;
    titleSetting = countries;
    var amountSetting;
    var countryCoOrds;

    for(i=0;i<resultsCountryProjects.features.length;i++){
      if(countries ===  resultsCountryProjects.features[i].properties.name){
        amountSetting = resultsCountryProjects.features[i].properties.amount
        countryCoOrds = resultsCountryProjects.features[i].geometry.coordinates
    }
    }

   


             var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(countryCoOrds)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + amountSetting + '</h4>')
        .addTo(map);

  }

function countryGrab(value){
    takeoffHighlighter(business1)
    if(value === 'United'){
      value = 'United Kingdom'
    }
 
    countryPoints = []
    for(i=0;i<business1.features.length;i++){
      if(business1.features[i].properties.countries === value){
        countryPoints.push(business1.features[i].geometry.coordinates)
      }
    }
    for(i=0;i<countryPoints.length;i++){
             map.setPaintProperty('business_locations' + countryPoints[i], 'circle-color','#FF0000' )
    }
      flyToCountry(value)
      createCountryPop(value)
  }


    function projectsGrab(value) {

        takeOffProjectHighlighter()
        projectsPointArray = []

      for (i = 0; i < projectsObj.features.length; i++) {


        if (projectsObj.features[i].properties.funder_title === value) {
          projectsPointArray.push(projectsObj.features[i].geometry.coordinates)
     
         

        }

      }


        for(i=0;i<projectsPointArray.length;i++){
                map.setLayoutProperty('funding_locations' + projectsPointArray[i], 'visibility', 'visible')

        }


    }

    

      function collabHighlighter(geo) {

                    projectsPointArray = []
            takeOffProjectHighlighter()

              for (i = 0; i < projectsObj.features.length; i++) {
                  console.log(geo[1], geo[3])

                   if(geo[1] === projectsObj.features[i].properties.collabNames || geo[3] === projectsObj.features[i].properties.names ){
                     projectsPointArray.push(projectsObj.features[i].geometry.coordinates)
                   }
     
                    

        }

          for(i=0;i<projectsPointArray.length;i++){
                map.setLayoutProperty('funding_locations' + projectsPointArray[i], 'visibility', 'visible')

        }
  
   //BOUNCE FROM PLACE TO PLACE 
   



    }

    function projectHighlighter(data) {

            takeOffProjectHighlighter()
  
   //BOUNCE FROM PLACE TO PLACE 
    var filterArray = []
     var anotherArray = []
     for(i=0;i<projectsObj.features.length;i++){
       filterArray.push({collabs:projectsObj.features[i].properties.collabNames, coordinates: projectsObj.features[i].geometry.coordinates})
     }
for(i=0;i<data.length;i++){
       anotherArray.push(data[i].businessName)
     }


      console.log('filter', filterArray)
     console.log('arr', anotherArray)

 
res = filterArray.filter(f => anotherArray.includes(f.collabs));
     
for(i=0;i<res.length;i++){
                map.setLayoutProperty('funding_locations' + res[i].coordinates, 'visibility', 'visible')

        }


    }

    function takeOffProjectHighlighter(){

      for(i=0;i<projectsObj.features.length;i++){
              map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'none')
      }
    }

    function flyToCountry1(value){
      //TODO:CHANGE TO THE BOUND AROUND THING
           {{!-- map.flyTo({
        center: value,
        zoom: 3
      }); --}}

    }


  $(document).ready(function () {

//#JUMP



    $('#collab').on('click', function (e) {
      takeOffProjectHighlighter();
      var input = document.getElementById('collab');

      if (document.getElementById('collab').checked === true) {
        document.getElementById('collab').checked === false
        for (i = 0; i < collabObj.features.length; i++) {
 map.setLayoutProperty('collabing' + i, 'visibility', 'visible')


        }
      }
      else {
        document.getElementById('collab').checked === true
        for (i = 0; i < collabObj.features.length; i++) {
         
                    map.setLayoutProperty('collabing' + i, 'visibility', 'none')


        }
      }
  

})





    $('#lead').on('click', function (e) {
            takeOffProjectHighlighter();
      var input = document.getElementById('collab');

      if (document.getElementById('lead').checked === true) {
        document.getElementById('lead').checked === false
        for (i = 0; i < leadObj.features.length; i++) {
     map.setLayoutProperty('lead' + i, 'visibility', 'visible')

        }
      }
      else {
        document.getElementById('lead').checked === true
        for (i = 0; i < leadObj.features.length; i++) {
     
          map.setLayoutProperty('lead' + i, 'visibility', 'none')


        }
      }
  

})



    $('#partner').on('click', function (e) {
            takeOffProjectHighlighter();
      console.log('clicked', partnerObj.features.length)

      var input = document.getElementById('partner');

      if (document.getElementById('partner').checked === true) {
        document.getElementById('partner').checked === false
        for (a = 0; a < partnerObj.features.length; a++) {
   console.log('fuck')

          map.setLayoutProperty('partner' + a, 'visibility', 'visible')

        }
      }
      else {
        document.getElementById('partner').checked === true
        for (a = 0; a < partnerObj.features.length; a++) {
          map.setLayoutProperty('partner'+a, 'visibility', 'none')


        }
      }
  

})


    $('#other').on('click', function (e) {
            takeOffProjectHighlighter();
      var input = document.getElementById('other');

      if (document.getElementById('other').checked === true) {
        document.getElementById('other').checked === false
        for (i = 0; i < otherProjects.features.length; i++) {

          map.setLayoutProperty('other' + i, 'visibility', 'visible')

        }
      }
      else {
        document.getElementById('other').checked === true
        for (i = 0; i < otherProjects.features.length; i++) {
          map.setLayoutProperty('other' + i, 'visibility', 'none')


        }
      }
  

})


  
        $("#restButton").on('click', function (e) {
takeoffHighlight(business1)
takeoffHighlighter(business1)
removePop();
removeCheck();
  });


        $("#restButtonProject").on('click', function (e) {
console.log('rest fired')
removeChecker();
resetForms();

  });



  $('#typeahead_person_submit').on('submit', function(e){
    e.preventDefault();

         $.ajax({
        type: "GET",
        url: "http://localhost:1234/getPerson",
        crossDomain: true,
        dataType: "json",
        data: $("#typeahead_person_submit").serialize(),
       success: function(data){
        {{!-- takeoffHighlight(business1) --}}
takeoffHighlighter(business1)
          highlightPerson(data)
      
          {{!-- highlighter(data)
          removePop() --}}
        }
    
    });

  })

    $('#typeahead_personProject_submit').on('submit', function(e){
    e.preventDefault();

         $.ajax({
        type: "GET",
        url: "http://localhost:1234/getPersonProject",
        crossDomain: true,
        dataType: "json",
        data: $("#typeahead_personProject_submit").serialize(),
       success: function(data){
         console.log('firedaj')
          highlightPPerson(data)
        }
    
    });

  })
  $('#typeahead_organisation_submit').on('submit', function(e){
    e.preventDefault();

         $.ajax({
        type: "GET",
        url: "http://localhost:1234/organisationGet",
        crossDomain: true,
        dataType: "json",
        data: $("#typeahead_organisation_submit").serialize(),
       success: function(data){
        takeoffHighlight(business1)
         highlighterOrg(data)
          removePop()
        }
    
    });

  })

   $('#typeahead_project_submit').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();

         $.ajax({
        type: "GET",
        url: "http://localhost:1234/projectFundersGet",
        crossDomain: true,
        dataType: "json",
        data: $("#typeahead_project_submit").serialize(),
       success: function(data){
         takeOffProjectHighlighter();
         projectHighlighter(data)
        }
    
    });

  })

     $('#typeahead_grab_collabs').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();

         $.ajax({
        type: "GET",
        url: "http://localhost:1234/projectCollabs",
        crossDomain: true,
        dataType: "json",
        data: $("#typeahead_grab_collabs").serialize(),
       success: function(data){
         collabHighlighter(data)
        }
    
    });

  })


  

    $('input.typeahead').typeahead({

      name: 'typeahead',
      remote: 'http://localhost:1234/search?key=%QUERY',
      limit: 5
    });

    

 $("#typeaheadSubmitAuthor").on('click', function (e) {
 document.getElementById('result_author_container').innerHTML = ''
  });

    $("#typeaheadSubmitAuthor").on('submit', function (e) {
      
     
      e.preventDefault();

          $.ajax({
        type: "GET",
        url: "http://localhost:1234/authorGrab",
        crossDomain: true,
        dataType: "json",
        data: $("#typeaheadSubmitAuthor").serialize(),
       success: function(data){
        
          appendSearch(data)
        }
    
    });
   
    

  });

  function resetForms(){
    document.getElementById('project_dGate').reset();
    document.getElementById('typeahead_project_submit').reset();
    document.getElementById('typeahead_grab_collabs').reset();
    document.getElementById('typeahead_personProject_submit').reset();
    removePop();

    for(i=0;i<projectsObj.features.length;i++){
            map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'none')

    }
  }

  function removeChecker(){
    console.log('function check fired')
var checkSelect = document.getElementsByClassName('projects_countries');

console.log(checkSelect)

     for(i=0;i<checkSelect.length;i++){
       if(checkSelect[i].checked = true){
         checkSelect[i].checked = false;
       }
     }

  }

 
  function removeCheck(){


      var checkSelect= document.getElementsByClassName('checkboxSelect');

     
      
     for(i=0;i<checkSelect.length;i++){
       if(checkSelect[i].checked = true){
         checkSelect[i].checked = false;
  
               takeoffHighlighter(business1)
         
       }
     }
  }

    $("#dateGet").on('submit', function(e){
      removeCheck();
      removePop();
      e.preventDefault();
       $.ajax({
        type: "GET",
        url: "http://localhost:1234/dateAuthor",
        crossDomain: true,
        dataType: "json",
        data: $("#dateGet").serialize(),
       success: function(data){
          highlighter(data)
        
        }
    
    });
  });


   $("#project_dGate").on('submit', function(e){
      removePop();
      e.preventDefault();
       $.ajax({
        type: "GET",
        url: "http://localhost:1234/dateProject",
        crossDomain: true,
        dataType: "json",
        data: $("#project_dGate").serialize(),
       success: function(data){
         highlightDates(projectsObj, data)

    
        
     
        }
    
    });
  });






  });




   function highlightDates(projectsObj, arr) {
     takeOffProjectHighlighter()
     console.log(arr)
     var filterArray = []
     var anotherArray = []
     for(i=0;i<projectsObj.features.length;i++){
       filterArray.push({collabs:projectsObj.features[i].properties.collabNames, coordinates: projectsObj.features[i].geometry.coordinates})
     }
for(i=0;i<arr.length;i++){
       anotherArray.push(arr[i].projectOrgs)
     }


      console.log('filter', filterArray)
     console.log('arr', anotherArray)

 
res = filterArray.filter(f => anotherArray.includes(f.collabs));


console.log('res',res)

for(i=0;i<res.length;i++){
      map.setLayoutProperty('funding_locations' + res[i].coordinates, 'visibility', 'visible')

}


}





  

  function handleDate(data){

    
     var listings = document.getElementById('result_author_container').innerHTML = '';
  for(i=0;i<data.length;i++){
       var listings = document.getElementById('result_author_container');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.style = 'margin:15px;'
        // Create a new link with the class 'title' for each store
        // and fill it with the store address
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = data[i]

  }
  }

function appendSearch(resultsObj){
 var listings = document.getElementById('result_author_container').innerHTML = '';
  for(i=0;i<resultsObj.features.length;i++){

       var listings = document.getElementById('result_author_container');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.style = 'margin:15px;'
        // Create a new link with the class 'title' for each store
        // and fill it with the store address
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = resultsObj.features[i].properties.title

                link.addEventListener('click', function (e) {

             
          // when a title is clicked, go and compare it to the object titles-save the geopoints
          var clickedListing = resultsObj.features[this.dataPosition]
          {{!-- takeoffHighlight(business1)

          highlightMap(clickedListing, name) --}}

               flyToStore(clickedListing);
              // 2. Close all other popups and display popup for clicked store
              {{!-- createPopUp(marker); --}}

          // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          var activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }); 
  }
}
    
</script>




</div>

 <script type="text/javascript" src="/js/typeahead.min.js"></script>
 <Script>

       $('input.personProjectGet').typeahead({

      name: 'typeaheadPersonProjectGet',
      remote: 'http://localhost:1234/searchPersonProject?key=%QUERY',
      limit: 2
    });
    
       $('input.projectGet').typeahead({

      name: 'typeaheadGet',
      remote: 'http://localhost:1234/searchProjects?key=%QUERY',
      limit: 2
    });


        $('input.collabsGet').typeahead({

      name: 'typeaheadCollabs',
      remote: 'http://localhost:1234/searchCollabs?key=%QUERY',
      limit: 2
    });

</script>

<nav id='filter-group' class='filter-group'>


 
  <input type="checkbox" id="collab" >
 <label for="collab">Collaborators</label>


    <input type="checkbox" id="lead">
   <label for="lead">Lead</label>

 
  <input type="checkbox" id="partner">
 <label for="partner">Partner</label>

 
  <input type="checkbox" id="other" >
 <label for="other">Other</label>

</nav>

  <div id='map' class='map pad2'></div>

  <script>

   

    function checkboxGrab(value){

      var updatedListingArray = []

    

     if(value === 'United'){
       value = 'United Kingdom'
     }

//TODO: bug of infinite loops here
     for(i=0;i<results.features.length;i++){
       if(results.features[i].properties.name === value){
         updatedListingArray.push(results.features[i])
           updateListing(value, updatedListingArray)
           break;
         
       }


      

    
     }

     

    }

    function updateListing(value, array){

      var currentListing = document.getElementsByClassName('item');
    document.getElementById('paperContainer').innerHTML = ''

      for(i=0;i < currentListing.length;i++){
        currentListing[i].innerHTML = ''

      }

          var namesArray = []
          var properties = []
              var name = array[0].properties.name
   
    


      for(i=0;i<business1.features.length;i++){
         
         if(business1.features[i].properties.countries === name){

           namesArray.push(business1.features[i].properties.title)
           properties.push(business1.features[i].properties)
         }
 
      

      }

      var unique;
var uniqueTitltes = []



if(namesArray.length >= 1){
var unique = onlyUnique(namesArray);

}
else{
  unique = names;
}



 
     var amount = unique.length

        var listings = document.getElementById('title_listings_container');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.style = 'margin:15px;'
        listing.id = 'listing-' + i;
        // Create a new link with the class 'title' for each store
        // and fill it with the store address
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.innerHTML = name + '<br/>' + amount




    

for(i=0;i<unique.length;i++){
  
  var paperName = unique[i];

        var papersContainer = document.getElementById('paperContainer')
            var container= papersContainer.appendChild(document.createElement('div'));
             container.className = 'item';
            container.style = 'margin-top:5px;'
            var paperLink = container.appendChild(document.createElement('a'))
            paperLink.style = 'margin:15px; font-size:10px;'
            paperLink.href = '#'
            paperLink.dataPosition = i;
            paperLink.innerHTML = paperName + '&nbsp;';



 
           // Add an event listener for the links in the sidebar listing
        paperLink.addEventListener('click', function (e) {

             
          // when a title is clicked, go and compare it to the object titles-save the geopoints
          var clickedListing = unique[this.dataPosition];
          takeoffHighlight(business1)

          highlightMap(clickedListing, name)

          // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          var activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }); 

       



       


      }
      {{!-- var listingUpdated = document.getElementById('listings');
      listingUpdated.innerHTML = value --}}

    

    }

    function onlyUnique(a) { 
   return Array.from(new Set(a));
}

 

    function openPage(pageName, elmnt, color) {
        // Hide all elements with class="tabcontent" by default */
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove the background color of all tablinks/buttons
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
        }

        // Show the specific tab content
        document.getElementById(pageName).style.display = "block";

        // Add the specific color to the button used to open the tab content
        elmnt.style.backgroundColor = color;
    }

    // Get the element with id="defaultOpen" and click on it
    {{!-- document.getElementById("defaultOpen").click(); --}}



   

   

    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGdyZWcxIiwiYSI6ImNqdHI5bWZhaDBkMDk0ZnFuaWFwYjhpbjcifQ.ndWDzBIkftUfqaoyNOe1Pg';
    // This adds the map to your page
    var map = new mapboxgl.Map({
      // container id specified in the HTML
      container: 'map',
      // style URL
      style: 'mapbox://styles/mapbox/streets-v9',
      // initial position in [lon, lat] format
      center: [-3.9206, 56.144],
      // initial zoom
      zoom: 5
    });

    var current_page1 = 1;
    var records_per_page1 = 5;
    var zoomthreshold = 4;
{{!-- changePage1(1) --}}


    map.on("load", function (e) {

           map.loadImage('stylesheets/marker2.png', function(error, image) {
if (error) throw error;
map.addImage('cat', image);
      })

      //CLICK FOR LEGEND




for(i=0;i<collabObj.features.length;i++){



  map.addLayer({
            id: 'collabing'+i,
            type: 'symbol',



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: collabProjects[i]
            },
            layout: {

              'icon-image': 'cat',
              'icon-allow-overlap': true,
              'visibility': 'none'

            }

          })


 

}




for(i=0;i<leadObj.features.length;i++){



  map.addLayer({
            id: 'lead'+i,
            type: 'symbol',



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: leadProjects[i]
            },
            layout: {

              'icon-image': 'resteraunt-15',
              'icon-allow-overlap': true,
              'visibility': 'none'

            }

          })


 

}


for(i=0;i<partnerObj.features.length;i++){

console.log('PARTNER', partnerObj.features.length)
console.log('partner'+i)


  map.addLayer({
            id: 'partner'+i,
            type: 'symbol',



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: partnerProjects[i]
            },
            layout: {

              'icon-image': 'cat',
              'icon-allow-overlap': true,
              'visibility': 'none'

            }

          })


 

}





for(i=0;i<otherObj.features.length;i++){



  map.addLayer({
            id: 'other'+i,
            type: 'symbol',



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: otherProjects[i]
            },
            layout: {

              'icon-image': 'marker-stroked-11',
              'icon-allow-overlap': true,
              'visibility': 'none'

            }

          })


 

}


   


console.log('NEWNEWNEW', leadProjects.length)
      

        for (j = 0; j < leadProjects.length; i++) {
          geoP = leadProjects[j].geometry.coordinates

          map.addLayer({
            id: 'lead_collabs' + geoP,
            type: 'symbol',
            minzoom:zoomthreshold,



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: leadProjects[i]
            },
            layout: {

              'icon-image': 'square-stroked-15',
              'icon-allow-overlap': true,
              'visibility': 'none'
            }

          })

        }

console.log('NEWNEWNEW', collabProjects.length)

        for (k = 0; k < collabProjects.length; k++) {


          geoP = collabProjects[k].geometry.coordinates
          console.log('COLLAB', geoP)

          map.addLayer({
            id: 'collab_collabs' + geoP,
            type: 'symbol',



            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: collabProjects[k]
            },
            layout: {

              'icon-image': 'cat',
              'icon-allow-overlap': true,
              'visibility': 'none'

            }

          })

        }



        for (l = 0; l < partnerProjects.length; l++) {

 geoP = partnerProjects[l].geometry.coordinates

 console.log('PARTNER', geoP)
          map.addLayer({
            id: 'partner_collabs' + geoP,
            type: 'symbol',
  


            // Add a GeoJSON source containing place coordinates and information.
            source: {
              type: 'geojson',
              data: partnerProjects[l]
            },
            layout: {

              'icon-image': 'restaurant-15',
              'icon-allow-overlap': true,
              'visibility': 'none'


            }

          })

        }


    
      

      for (i = 0; i < projectsObj.features.length; i++) {

        var geoP = projectsObj.features[i].geometry.coordinates
        var gp = projectsObj.features[i]

      

        map.addLayer({
          id: 'funding_locations' + geoP,
           type: 'symbol',
           maxzoom:9,
           
      
          // Add a GeoJSON source containing place coordinates and information.
          source: {
            type: 'geojson',
            data: gp
          },
             layout: {
        
      'icon-image': 'cat',
      'icon-allow-overlap': true,
      'visibility':'none',
      'icon-size': 1
      
    }

        })

      }

          map.addLayer({
          id: 'projects_locations',
           type: 'symbol',
           minzoom:10,
      
          // Add a GeoJSON source containing place coordinates and information.
          source: {
            type: 'geojson',
            data: projectsObj
          },
             layout: {
        
      'icon-image': 'cat',
      'icon-allow-overlap': true,
      'visibility':'visible',
      'icon-size': 3
      
    }

        })
      


  for(i=0;i<business1.features.length;i++){
        
        clickedPoints = business1.features[i]

        //get the clickedListing
        //go and get the other listings with the same title
        //apply css

          map.addLayer({
        id: 'business_locations' + clickedPoints.geometry.coordinates,
         type: 'circle',
      
         maxzoom:zoomthreshold,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: clickedPoints
        },
           paint: {
        "circle-radius": 8,
        "circle-color": "#E6ECC5",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#E6ECC5"
      } 
   })
       } 

             map.addLayer({
        id: 'specific_location',
         type: 'circle',
         minzoom:10,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: business1
        },
           paint: {
        "circle-radius": 8,
        "circle-color": "#008000",
        
        "circle-stroke-width": 2,
        "circle-stroke-color": "#008000"
      } 
   })
       


      // Add the data to your map as a lyer
  for(i=0;i<business1.features.length;i++){
        
        clickedPoints = business1.features[i]

        //get the clickedListing
        //go and get the other listings with the same title
        //apply css

          map.addLayer({
        id: 'business_location11' + clickedPoints.geometry.coordinates,
         type: 'circle',
         minzoom:zoomthreshold,
         maxzoom:8,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: clickedPoints
        },
           paint: {
        "circle-radius": 8,
        "circle-color": "#E6ECC5",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#E6ECC5"
      } 
   })
       } 

       

 for(i=0;i<lowResultsObj.features.length;i++){
 



     if(lowResultsObj.features[i].properties.amount <=1){
              clickedPoints = lowResultsObj.features[i]



         //add layer < 1
                map.addLayer({
        id: 'countries_location1' + clickedPoints.geometry.coordinates,
         type: 'circle',
           maxzoom: zoomthreshold,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: lowResultsObj
        },
           paint: {
        "circle-radius": 5,
        "circle-color": "#FF0000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FF0000"
      
      }
   })

          let radius = 5;

     setInterval(() => {
      map.setPaintProperty('countries_location1' + clickedPoints.geometry.coordinates, 'circle-radius', radius);
      radius = ++radius % 30
    }, 100);
     }

 }

 for(i=0;i<midResultsObj.features.length;i++){



    if((midResultsObj.features[i].properties.amount >1) && (midResultsObj.features[i].properties.amount <=3)){
   
             clickedPoints1 = midResultsObj.features[i]
         // layer >1 < 3
         let radius =10

                map.addLayer({
        id: 'countries' + clickedPoints1.geometry.coordinates,
         type: 'circle',
        maxzoom: zoomthreshold,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: midResultsObj
        },
           paint: {
        "circle-radius": 10,
        "circle-color": "#0000FF",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#0000FF"
      
      }
   })

     setInterval(() => {
      map.setPaintProperty('countries' + clickedPoints1.geometry.coordinates, 'circle-radius', radius);
      radius = ++radius % 30
    }, 100);



     }
    }

    for(i=0;i<highResultsObj.features.length;i++){
      if(highResultsObj.features[i].properties.amount > 3){
              clickedPoints2 = highResultsObj.features[i]
       
       let radius = 20;


        //get the clickedListing
        //go and get the other listings with the same title
        //apply css

          map.addLayer({
        id: 'countries_large' + clickedPoints2.geometry.coordinates,
         type: 'circle',
     maxzoom: zoomthreshold,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: highResultsObj
        },
           paint: {

        "circle-color": "#FFFFFF",
                "circle-radius": 5,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FFFFFF"
 
      
      }
   })

     setInterval(() => {
      map.setPaintProperty('countries_large' + clickedPoints2.geometry.coordinates, 'circle-radius', radius);
      radius = ++radius % 30
    }, 100);
  

   
     }
    }

      

     
       
 for(i=0;i<results.features.length;i++){
        
        clickedPoints = results.features[i]

        //get the clickedListing
        //go and get the other listings with the same title
        //apply css

          map.addLayer({
        id: 'countries_text1' + clickedPoints.geometry.coordinates,
         type: 'symbol',
        maxzoom: zoomthreshold,

        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: clickedPoints
        },
layout: {
  
            'icon-allow-overlap': true,
            'text-field': "{amount}",
            'text-offset':[0,0.6],
            'text-anchor':'top'
          }
   })
       } 


    })
    

 {{!-- for(i=0;i<data.length;i++){
    dataLimbo(arrSorted[i])
 }

    function dataLimbo(data){

      let radius = 1

        setInterval(() => {
      map.setPaintProperty('countries_location1'+ data.geometry.coordinates, 'circle-radius', radius);
      radius = ++radius % 30
    }, 50);
 
    
    } --}}

        function flyToCountry(countryFeature) {


     
      for(i=0;i<results.features.length;i++){
         if(countryFeature === results.features[i].properties.name){
      countryFeature = results.features[i].geometry.coordinates

            map.flyTo({
        center: countryFeature,
        zoom: 3
      });
      break;
    
         }
      }

    }


    function flyToStore(currentFeature) {


      var markerFeature;
      var countryFeature;

      for(i=0;i<results.features.length;i++){
         if(currentFeature === results.features[i].properties.name){
      countryFeature = results.features[i].geometry.coordinates

            map.flyTo({
        center: countryFeature,
        zoom: 8
      });
      break;
    
  }

 



      }
      
      for(i=0; i<business1.features.length;i++){
  if(currentFeature.title === business1.features[i].properties.title && currentFeature.authorTitle === business1.features[i].properties.authorTitle){
    markerFeature = business1.features[i].geometry.coordinates
  }
      }
 


      if(currentFeature.properties === undefined){
        currentFeature = markerFeature

              map.flyTo({
        center: markerFeature,
        zoom: 12
      });
      }
      else{
             map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 12
      });
      }

      



    }

    function removePop(){

         var popUps = document.getElementsByClassName('mapboxgl-popup');
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

    }

       function createCountryPop(currentFeature) {
         console.log('createpop',currentFeature)

      var popUps = document.getElementsByClassName('mapboxgl-popup');
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

      let titleSetting;
    titleSetting = currentFeature;
    var amountSetting;
    var countryCoOrds;

    for(i=0;i<results.features.length;i++){
      if(currentFeature ===  results.features[i].properties.name){
        amountSetting = results.features[i].properties.amount
        countryCoOrds = results.features[i].geometry.coordinates
    }
    }

   


             var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(countryCoOrds)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + amountSetting + '</h4>')
        .addTo(map);

      
    }

    function createPopUp(currentFeature) {

      var popUps = document.getElementsByClassName('mapboxgl-popup');
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

      let titleSetting;
    titleSetting = currentFeature.properties.name
    let amountSetting = currentFeature.properties.amount

      if(titleSetting != null){
  



      var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + amountSetting + '</h4>')
        .addTo(map);

      }

      else{

        let titleSetting;
     titleSetting = currentFeature.properties.title;
     let authorSetting;
     authorSetting = currentFeature.properties.authorTitle;

             var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + authorSetting + '</h4>')
        .addTo(map);

      }
    }


    function prevPage1() {

      if (current_page1 > 1) {
        current_page1--;
        changePage1(current_page1);
      }
    }

    function nextPage1() {


      if (current_page1 < numPages1(result)) {
        current_page1++;
        changePage1(current_page1);
      }
    }

    function changePage1(page) {

      data = arrSorted
    



      result = arrSorted
      var btn_next = document.getElementById("btn_next1");
      var btn_prev = document.getElementById("btn_prev1");
      var listing_table = document.getElementById("listings");
      var page_span = document.getElementById("page1");

      // Validate page
      if (page < 1) page = 1;
      if (page > numPages1(result)) page = numPages1(result);
      listing_table.innerHTML = "";
      for (var i = (page - 1) * records_per_page1; i < (page * records_per_page1) && i < arrSorted.length; i++) {
        // Iterate through the list of stores
        var currentCountry = arrSorted[i].properties.name;
        var currentCountryAmount = arrSorted[i].properties.amount

        //TODO:Order countries by amount .sort array



        // Shorten data.feature.properties to just `prop` so we're not
        // writing this long form over and over again.

        // Select the listing container in the HTML and append a div
        // with the class 'item' for each store
        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.style = 'margin-top:15px;'
        listing.id = 'listing-' + i;
        // Create a new link with the class 'title' for each store
        // and fill it with the store address
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.namePosition = i;
        link.innerHTML = currentCountry + '<br/>' + currentCountryAmount



        // Add an event listener for the links in the sidebar listing
        link.addEventListener('click', function (e) {
          // when a title is clicked, go and compare it to the object titles-save the geopoints
          var clickedListing = arrSorted[this.dataPosition];
          {{!-- takeoffHighlight(results)

          highlightMap(clickedListing) --}}
          // 1. Fly to the point associated with the clicked link
          flyToStore(clickedListing);
          // 2. Close all other popups and display popup for clicked store
          createPopUp(clickedListing);
          // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          var activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        });
      }


      {{!-- if (page == 1) {
        btn_prev.style.display = "none";
      } else {
        btn_prev.style.display = "inline-block";
      }

      if (page == numPages1(result)) {
        btn_next.style.display = "none";
      } else {
        btn_next.style.display = "inline-block";
      } --}}
    }

    function takeoffHighlighter(data){
         for(i=0;i<data.features.length;i++){
        map.setPaintProperty('business_locations' + data.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )
          map.setPaintProperty('business_locations1' + data.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )
            map.setPaintProperty('business_locations11' + data.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )

      }
    }

   function takeoffHighlight(data){
      for(i=0;i<data.features.length;i++){
        map.setPaintProperty('business_location11' + data.features[i].geometry.coordinates, 'circle-color','#4B0082' )

      }
    }

      function highlightPPerson(data) {
        console.log('fired')

        takeOffProjectHighlighter()

        var filterArray = []
        var anotherArray = []

        for (i = 0; i < projectsObj.features.length; i++) {
          filterArray.push({ collabNames: projectsObj.features[i].properties.names, coordinates: projectsObj.features[i].geometry.coordinates })
        }

        for (i = 0; i < data.length; i++) {
          anotherArray.push(data[i])
        }


        console.log('filter', JSON.stringify(filterArray))
        console.log('arr', JSON.stringify(anotherArray))


        res = filterArray.filter(f => anotherArray.includes(f.collabNames));


        console.log('res', res)

        for (i = 0; i < res.length; i++) {
          map.setLayoutProperty('funding_locations' + res[i].coordinates, 'visibility', 'visible')

        }



      }

    function highlightPerson(data){
  
      personPapers = []

      console.log('new data', data)

      for(i=0;i<business1.features.length;i++){
        if(business1.features[i].properties.title === data[i]){
          personPapers.push(business1.features[i].geometry.coordinates)
        }
      }

      console.log(personPapers)

      for(i=0;i<personPapers.length;i++){
        
                map.setPaintProperty('business_location11' + personPapers[i], 'circle-color','#FF0000' )

      }
    }

    function highlighterOrg(data) {
    //dateauthor check

  

    var filterArray = []
    var anotherArray = []

 

    for (i = 0; i < business1.features.length; i++) {
      filterArray.push({ titleName: business1.features[i].properties.title, businessName:business1.features[i].properties.businessName, coordinates: business1.features[i].geometry.coordinates })
    }
    for (i = 0; i < data.length; i++) {

      anotherArray.push(data[i].businessName)
    }

  


    res = filterArray.filter(f => anotherArray.includes(f.businessName));

    console.log('res is', res)
    for (i = 0; i < res.length; i++) {
      map.setPaintProperty('business_location11' + res[i].coordinates, 'circle-color', '#FF0000')
    }
  }


  function highlighter(data) {
    //dateauthor check

  
    console.log('datadata', data)
    console.log('business', business1)

    var filterArray = []
    var anotherArray = []

    for (i = 0; i < business1.features.length; i++) {
      filterArray.push({ titleName: business1.features[i].properties.title, coordinates: business1.features[i].geometry.coordinates })
    }
    for (i = 0; i < data.length; i++) {

      anotherArray.push(data[i].name)
    }



    res = filterArray.filter(f => anotherArray.includes(f.titleName));

    console.log('res is', res)
    for (i = 0; i < res.length; i++) {
      map.setPaintProperty('business_location11' + res[i].coordinates, 'circle-color', '#FF0000')
    }
  }

    function highlightMap(clickedListing, clickedCountry) {




  var titleToMatch = clickedListing
  var countryName = clickedCountry;
var geoPoints = []

for(i=0; i<business1.features.length;i++){
  if(titleToMatch === business1.features[i].properties.title && countryName === business1.features[i].properties.countries){
    geoPoints.push(business1.features[i].geometry.coordinates)

    
  }
  else{
  }
}
  for(i=0;i<geoPoints.length;i++){
      map.setPaintProperty('business_location11' + geoPoints[i] ,'circle-color','#FF0000' )
  }

     
      

    }

    

    function numPages1(result) {


      return Math.ceil(result.length / records_per_page1);
    }

      map.on('click', function (e) {
           var newFeatures
      // Query all the rendered points in the view
      var features = map.queryRenderedFeatures(e.point, { layers: ['projects_locations'] });

      for(i=0;i<projectsObj.features.length;i++){
             newFeatures = map.queryRenderedFeatures(e.point);
         
      }
      var selectedFeatureIndex;


     if (features.length) {

        var clickedPoint = features[0];
        var clickedPlace = features[0].place_name



       var clickedName = clickedPoint.properties.funder_title

 

       // 1. Fly to the point
       flyToProjects(clickedPoint);
       // 2. Close all other popups and display popup for clicked store
       {{!-- createProjectPop(clickedPoint, clickedName) --}}
     }

     if(newFeatures.length){

       
        var clickedPoint = newFeatures[0];

 


       var clickedName = clickedPoint.properties.funder_title
       var geo = clickedPoint.geometry.coordinates

       

       // 1. Fly to the point
       flyToProjects(clickedPoint);
       // 2. Close all other popups and display popup for clicked store
       createProjectPop(clickedPoint, clickedName, geo)
       
     }




    });
    

   map.on('click', function (e) {
      // Query all the rendered points in the view
      var features = map.queryRenderedFeatures(e.point, { layers: ['business_location'] });
      var selectedFeatureIndex;


      var objValues = business1






      if (features.length) {

        var clickedPoint = features[0];



        var clickedName = clickedPoint.properties.title




        // 1. Fly to the point
        flyToStore(clickedPoint);
        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedPoint, clickedName);
      

      }

    });

    map.on('click', function (e) {
      // Query all the rendered points in the view
      var features = map.queryRenderedFeatures(e.point, { layers: ['specific_location'] });
      var selectedFeatureIndex;


      var objValues = business1






      if (features.length) {

        var clickedPoint = features[0];



        var clickedName = clickedPoint.properties.title




        // 1. Fly to the point
        flyToStore(clickedPoint);
        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedPoint, clickedName);
        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        // Find the index of the store.features that corresponds to the clickedPoint that fired the event listener
        var selectedFeature = clickedPoint._geometry.coordinates;



        for (var i = 0; i < objValues.features.length; i++) {
          arr1 = objValues.features[i].geometry.coordinates
          arr2 = selectedFeature

          if (arraysEqual(arr1, arr2) === true) {
            selectedFeatureIndex = i;

            var listing = document.getElementById('listing-' + selectedFeatureIndex);
            listing.classList.add('active');


          }


          // Select the correct list item using the found index and add the active class

        }

      }



    });


    function arraysEqual(a1, a2) {


      for (i = 0; i < a1.length; i++) {
        replacer = a1[i].toString().substring(0, 4)
        a1[i] = replacer;
      }

      for (i = 0; i < a2.length; i++) {
        replacer = a2[i].toString().substring(0, 4)
        a2[i] = replacer;
      }



      if (arr1[0] === arr2[0] && arr1[1] === arr2[1]) {
        return true
      }



      /* WARNING: arrays must not contain {objects} or behavior may be undefined */
      return false
    }


function flyToProjects(clickedProject){

   var projectFeature =  clickedProject.geometry.coordinates

            map.flyTo({
        center: projectFeature,
        zoom: 8
      });
      
    
  }




function createProjectPop(clickedProject, clickedName,geo){

      var popUps = document.getElementsByClassName('mapboxgl-popup');
      var lat;
      var long;
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

     
    titleSetting = clickedProject.properties.funder_title
    var amountSetting;

    var newgeo = geo.toString();

    var fields = newgeo.split(',')

    var pGeo
    var comparisonProjectGeo
    
 for(i=0;i<geo.length;i++){
   lat = fields[0].substring(0,3)
   long = fields[1].substring(0,3)
 }

 var comparisonGeo = lat + ','+long
    for(i=0;i<projectsObj.features.length;i++){

      pGeo = projectsObj.features[i].geometry.coordinates.toString();
     newFields = pGeo.split(',')

      pLat = newFields[0].substring(0,3)
      pLong = newFields[1].substring(0,3)
      comparisonProjectGeo = pLat + ','+pLong



      if(titleSetting === projectsObj.features[i].properties.funder_title && comparisonGeo === comparisonProjectGeo){
        amountSetting = projectsObj.features[i].place_name
      }
    }


  
      var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(clickedProject.geometry.coordinates)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + amountSetting + '</h4>')
        .addTo(map);

      


}


  </script>

</body>

</html>