<style>
    /* Set height of body and the document to 100% to enable "full page tabs" */
    body,
    html {
        height: 100%;
        margin: 0;
        font-family: Arial;
    }

    /* Style tab links */
    .tablink {
        background-color: #555;
        color: white;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        font-size: 17px;
        width: 50%;
    }

    .tablink_button {
        background-color: #376235;
    color: white;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 8px 7px;
    font-size: 10px;
    width: 16%;
    margin: 5px;
    }

    .page_title_container{
        background-color: white;
    color: black;
    border: none;
    outline: none;
    width: 16%;
    margin: 5px;
    }

    .tablink:hover {
        background-color: #777;
    }

    /* Style the tab content (and add height:100% for full page content) */
    .tabcontent {
        color: white;
        display: none;
        padding: 100px 20px;
        height: 100%;
    }


    #News {
        background-color: white;
        color: black;
    }

    #Contact {
        background-color: white;
    }

    #About {
        background-color: white;
        color: black;
    }


    .topicsToSearch {
        display: block;
        text-align: center;
        overflow: hidden;
    }

    .topic {
        float: left;
        width: 45%;
        margin: 0 3% 3% 0;
    }

    .topic a {
        display: block;
        min-height: 342px;
        padding: 20px;
        background-color: #F6F5F5;
        color: #42475A;
        text-decoration: none;

    }

    .icon {
        width: 52px;
        height: 52px;
        margin: 0 auto 10px auto;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .result1 {
        color: black;
    }

    .search {
        width: 100%;
        position: relative
    }

    .searchTerm {
        float: left;
        width: 100%;
        border: 3px solid #376235;
        padding: 5px;
        height: 36px;
        border-radius: 5px;
        outline: none;
        color: #9DBFAF;
    }

    .searchTerm:focus {
        color: 376235;
    }

    .searchButton {
        position: absolute;
        right: -50px;
        width: 40px;
        height: 36px;
        border: 1px solid #376235;
        background: #376235;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        font-size: 20px;
    }



    .search_container {
        width: 50%;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 15px;
        padding: 0 10px;
    }

    .result1 {
        flex: 1;
    }

    .search {
        flex: 1;
    }

    @media only screen and (max-width: 425px) {
        .search_container {
            width: 100%;
        }
    }
</style>

<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.3.0/fuse.min.js" type='text/javascript'></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="assets/templates/default-html5/js/searchCode.js" ></script>

</head>



<button class="tablink" onclick="openPage('News', this, 'green')" id="defaultOpen">Articles</button>
<button class="tablink" onclick="openPage('About', this, 'green')">Search</button>




<div id="News" class="tabcontent">
    <div class="deliveryPage_content_box">
        <h3 class="deliveryHeadings_titles">Articles</h3>
        <p class="content_box_paragraph">Most recent articles</p>



        <div id="listingTable"></div>

        <button class="tablink_button" onclick="prevPage()" id="btn_prev">Prev Page</button>
        <button class="tablink_button" onclick="nextPage()" id="btn_next">Next Page</button>
        
        <div class="page_title_container">
        page:<span id="page"></span>
        </div>


    </div>

</div>



<div id="About" class="tabcontent">
    <div class="deliveryPage_content_box">

        <div class="search_container">
            <div class="search">
                <form id="test" name="csv_input">
                    <input type="text" id="searchTextbox" class="searchTerm" placeholder="What are you looking for?">
                    <button type="submit" class="searchButton">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path style="fill:white"
                                d="M337.509 305.372h-17.501l-6.571-5.486c20.791-25.232 33.922-57.054 33.922-93.257C347.358 127.632 283.896 64 205.135 64 127.452 64 64 127.632 64 206.629s63.452 142.628 142.225 142.628c35.011 0 67.831-13.167 92.991-34.008l6.561 5.487v17.551L415.18 448 448 415.086 337.509 305.372zm-131.284 0c-54.702 0-98.463-43.887-98.463-98.743 0-54.858 43.761-98.742 98.463-98.742 54.7 0 98.462 43.884 98.462 98.742 0 54.856-43.762 98.743-98.462 98.743z" />
                            </svg>
                    </button>
                </form>
            </div>

        </div>



        <div id="result1">
        </div>
        <button class="tablink_button" onclick="prevPage1()" id="btn_prev1">Prev Page</button>
        <button class="tablink_button" onclick="nextPage1()" id="btn_next1">Next Page</button>
        
        <div class="page_title_container" id="page_container">
        <div id="pageTitle">page:</div> <span id="page1"></span>
        </div>
    </div>



</div>


<script>



    $("document").ready(function () {

        document.getElementById('btn_prev1').style.display = 'none';
        document.getElementById('btn_next1').style.display = 'none';
        document.getElementById('page_container').style.display = 'none';

        getSearchFromCsv();

        $('#test').on('submit', function (e) {
            e.preventDefault()
            searchBox();
        })



   

    });


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
    document.getElementById("defaultOpen").click();


</script>