

      function loadProjects(){

   for(i=0;i<business1.features.length;i++){
    map.setPaintProperty('business_location', 'circle-color','#E6ECC5' )
   map.setPaintProperty('business_location11' + business1.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )
        }

        for(i=0;i<projectsObj.features.length;i++){
               map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'visible')
                map.setLayoutProperty('collabing' + i, 'visibility', 'visible')
                  
   
        }

        
        

      }
    

$(document).ready(function () {

  $("#paper-tab-just").on("click", function(){
    turnonPapers();
  });

    $("#project-tab-just").on("click", function(){
    turnoffPapers();
  });



    $("#topA").on("click", function(){
    $("#topDiv").toggleClass('hide')
  });


  $(".tt-query").focusin(function(){
    $("label[for='" + $(this).attr("id") + "']").hide(); //hide label of clicked item 
  });

    $(".tt-query").focusout(function(){
    $("label[for='" + $(this).attr("id") + "']").show();
  });



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
   



  function turnoffPapers(){


    map.setPaintProperty('business_location', 'circle-color','#E6ECC5' )
  

}

function turnonPapers(){


    map.setPaintProperty('business_location', 'circle-color','#4B0082' )
  

}




    
  
    

          

 
  

        

  

 
   





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

 


  $(document).ready(function () {

//#JUMP



    $('#collab').on('click', function (e) {
 
      takeOffProjectHighlighter();
      var input = document.getElementById('collab');

      if (document.getElementById('collab').checked === true) {
        document.getElementById('collab').checked === false
        for (i = 0; i < collabObj.features.length; i++) {
 map.setLayoutProperty('collabing' + i, 'visibility', 'visible')
            turnoffPapers();
 


        }
      }
      else {
        document.getElementById('collab').checked === true
        for (i = 0; i < collabObj.features.length; i++) {
                    turnonPapers();
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


      var input = document.getElementById('partner');

      if (document.getElementById('partner').checked === true) {
        document.getElementById('partner').checked === false
        for (a = 0; a < partnerObj.features.length; a++) {


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

removePop();
removeCheck();

  map.setPaintProperty('business_location', 'circle-color','#4B0082' )
  });


        $("#restButtonProject").on('click', function (e) {

removeCheck();

for(i=0; i<projectsObj.features.length;i++){
   map.setLayoutProperty('funding_locations' + projectsObj.features[i].geometry.coordinates, 'visibility', 'none')
                map.setLayoutProperty('collabing' + i, 'visibility', 'none')
}


  });

  





 
  function removeCheck(){


      var checkSelect= document.getElementsByClassName('tt-query');

     
      
     for(i=0;i<checkSelect.length;i++){
       
     
     checkSelect[i].value = ''
     }

    selectTags = document.getElementsByTagName("select")
    for(var i = 0; i < selectTags.length; i++) {
  selectTags[i].selectedIndex =0;
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

         checkDates(data);
        
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
        checkDates(data)

    
        
     
        }
    
    });
  });






  });


function checkDates(data){
      if(data.length === 0){
     
              swal({
  type: 'error',
  title: 'Oops...',
  text: 'The dates chosen do not yet have a corresponding paper'
})
         }
         else{
     
          highlighter(data)
         }
}

function checkPDates(data){
      if(data.length === 0){
     
              swal({
  type: 'error',
  title: 'Oops...',
  text: 'The dates chosen do not yet have a corresponding project'
})
         }
         else{
     
          highlightDates(projectsObj, data)
         }
}

   function highlightDates(projectsObj, arr) {
     takeOffProjectHighlighter()
   
     var filterArray = []
     var anotherArray = []
     for(i=0;i<projectsObj.features.length;i++){
       filterArray.push({collabs:projectsObj.features[i].properties.collabNames, coordinates: projectsObj.features[i].geometry.coordinates})
     }
for(i=0;i<arr.length;i++){
       anotherArray.push(arr[i].projectOrgs)
     }


 
res = filterArray.filter(f => anotherArray.includes(f.collabs));



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
   

               flyToStore(clickedListing);
              // 2. Close all other popups and display popup for clicked store
           

          // 3. Highlight listing in sidebar (and remove highlight for all other listings)
          var activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        }); 
  }
}
    


 

  

   

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




   

   
    var current_page1 = 1;
    var records_per_page1 = 5;
   




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

    function createOrgPop(res){
    
            var popUps = document.getElementsByClassName('mapboxgl-popup');
      // Check if there is already a popup on the map and if so, remove it
      if (popUps[0]) popUps[0].remove();

  
      for(i=0;i<res.length;i++){
 

         var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(res[i].coordinates)
        .setHTML('<h3 style="color:black">' + res[i].businessName + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + res[i].titleName + '</h4>')
        .addTo(map);
      }

     
      flyToOrg(res)
    }

    function flyToOrg(){
      


   var projectFeature = res[0].coordinates

            map.flyTo({
        center: projectFeature,
        zoom: 7
      });
      
    
  


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

     let handle = currentFeature.properties.handle;

     if(handle === null || handle === undefined){
       handle = 'N/A'
     }
     else{

             var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<div id="popupBox"><h4 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h5 style="color:black">' + authorSetting + '</h4>' +
          '<a href=https://dspace.stir.ac.uk/handle/'+handle+' target=_blank rel=noreferrer">Link</a>'+
          '</div>')
        .addTo(map);
     }

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



    }

    function takeoffHighlighter(data){
    
     


         for(i=0;i<data.features.length;i++){


            map.setPaintProperty('business_locations11' + data.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )

      }
    }

   function takeoffHighlight(data){
     
      map.setPaintProperty('business_location', 'circle-color', '#E6ECC5')

      for(i=0;i<data.features.length;i++){
        map.setPaintProperty('business_location11' + data.features[i].geometry.coordinates, 'circle-color','#E6ECC5' )

      }
    }

      function highlightPPerson(data) {

        takeOffProjectHighlighter()

        var filterArray = []
        var anotherArray = []

        for (i = 0; i < projectsObj.features.length; i++) {
          filterArray.push({ collabNames: projectsObj.features[i].properties.names, coordinates: projectsObj.features[i].geometry.coordinates })
        }

        for (i = 0; i < data.length; i++) {
          anotherArray.push(data[i])
        }



        res = filterArray.filter(f => anotherArray.includes(f.collabNames));


 

        for (i = 0; i < res.length; i++) {
          map.setLayoutProperty('funding_locations' + res[i].coordinates, 'visibility', 'visible')

        }



      }

    function highlightPerson(data){

      personPapers = []


      for(i=0;i<business1.features.length;i++){
        if(business1.features[i].properties.title === data[1]){
          personPapers.push(business1.features[i].geometry.coordinates)
        }
        else{
         swal({
  type: 'error',
  title: 'Oops...',
  text: 'The Professor has no research papers within the application!'
})
          break;
        }
      }

     



      for(i=0;i<personPapers.length;i++){
      
        
                map.setPaintProperty('business_location1' + personPapers[i], 'circle-color','#FF0000' )

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

    for (i = 0; i < res.length; i++) {
      map.setPaintProperty('business_location11' + res[i].coordinates, 'circle-color', '#FF0000')
    }

    createOrgPop(res)
  }


  function highlighter(data) {
    //dateauthor check

  


    var filterArray = []
    var anotherArray = []

    for (i = 0; i < business1.features.length; i++) {
      filterArray.push({ titleName: business1.features[i].properties.title, coordinates: business1.features[i].geometry.coordinates })
    }
    for (i = 0; i < data.length; i++) {

      anotherArray.push(data[i].name)
    }



    res = filterArray.filter(f => anotherArray.includes(f.titleName));


  
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

}
  for(i=0;i<geoPoints.length;i++){
      map.setPaintProperty('business_location11' + geoPoints[i] ,'circle-color','#FF0000' )
  }

     
      

    }

    

    function numPages1(result) {


      return Math.ceil(result.length / records_per_page1);
    }


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
    var titleofProject;

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
        titleofProject = projectsObj.features[i].properties.names
      }
    
    }


  
      var popup = new mapboxgl.Popup({ className: 'popups', closeOnClick: false })
        .setLngLat(clickedProject.geometry.coordinates)
        .setHTML('<h3 style="color:black">' + titleSetting + '</h3>' +
          '<div style="margin-top:10px"> </div>' +
          '<h4 style="color:black">' + amountSetting + '</h4>'+
          '<h5 style="color:black">'+ titleofProject + '</h5>')
        .addTo(map);

      


}



 