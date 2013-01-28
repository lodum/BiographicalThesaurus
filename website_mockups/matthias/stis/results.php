<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $lang['STIS_PAGE_TITLE']; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=9"/>
    <meta name="description" content="">
    <meta name="author" content="">
	<?php echo $lang['STIS_LANGUAGE']; ?>
	
    <!-- Le styles -->
    <link href="../assets/css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
    <style type="text/css">
      html, body, #map {
          width: 100%;
          height: 300px;
          margin: 0;
          
      }
      img {max-width:none}
	  	  #result_success{
		background-color: green;
		position: absolute;
		top: 40px;
		z-index: 20000;
		left: 0px;
		padding: 10px;
		display:none;
	  }
	  #result_error{
		background-color: red;
		position: absolute;
		top: 40px;
		z-index: 20000;
		left: 0px;
		padding: 10px;
		display:none;
	  }
	  
	  #loadingDiv{
		display:none;
	  }
		
    </style>
    <link href="../assets/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="shortcut icon" href="../assets/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
    
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.4/leaflet.css" />
	
	 <script src="http://cdn.leafletjs.com/leaflet-0.4/leaflet.js"></script>
	 
	 <script src="query.js" type="text/javascript"></script>

  
  
    <script>
      function init() {
         // set up the map
			map = new L.Map('map');

			 L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
                }).addTo(map);	

			map.setView(new L.LatLng(51.966667, 7.633333),9);
			
			//addResultMarker();
			
			startQuery(map);
			
			/*var str = getElementById('resultdiv').value;
			//console.log(str);
			var td = str.split("<td></td>");
			console.log(td.length);*/
			
			
			
      }
      
      function addResultMarker(){
		  var marker = L.marker([51.966667, 7.633333]).addTo(map);
		  marker.bindPopup("<b>Bernd Stelter</b><br><a href=\"#\">Link</a>").openPopup();
	  }
      
    </script>
    
    <script type="text/javascript">
		function showValue1(newValue)
		{
			document.getElementById("range1").innerHTML=newValue;
		}
		function showValue2(newValue)
		{
			document.getElementById("range2").innerHTML=newValue;
		}
		
	</script>
	
	  </head>

  <body onload="init();">

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#"><?php echo $lang['STIS_PAGE_TITLE']; ?></a>
          <div class="nav-collapse collapse">
            <ul class="nav">
               <li><a href="stis.php"><?php echo $lang['MENU_HOME']; ?></a></li>
               <li><a href="search.php"><?php echo $lang['MENU_SEARCH']; ?></a></li>
               <!--<li><a href="explore.php"><?php echo $lang['MENU_EXPLORE']; ?></a></li>-->
               <li><a href="tag_cloud.php"><?php echo $lang['MENU_TAG']; ?></a></li>
			   <li><a href="sparql.php"><?php echo $lang['MENU_SPARQL']; ?></a></li>
<!--
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
-->
            </ul>
			<div style="padding: 10px 20px 10px;" align="right" class="text"><?php echo $lang['SELECT LANGUAGE']; ?> 
			    <a href="?lang=de"  title="Deutsch"><img src="languages/flags/de.png" alt="Deutsch"/></a> 
                <a href="?lang=en"  title="English"><img src="languages/flags/gb.png" alt="English"/></a>
			    </div>			
          </div><!--/.nav-collapse -->
        </div>
		<div id="result_success">
			<? echo $lang['result_status_success']; ?>
		</div>
		<div id="result_error">
			<? echo $lang['result_status_error']; ?>
		</div>
      </div>
    </div>
	<div class="container">
		<h1><?php echo $lang['RESULT_HEADER']; ?></h1>
	</div>
    <div id="map"></div>
    <div class="container">
	<!--
	TIMESLIDER
	<table>
		<tr>
			<td> 
				<p>Earliest result:</p>
				<input type="range" min="1335" max="1965" value="1335" step="1" onchange="showValue1(this.value)" />
				<span id="range1">0</span>
			</td>
			<td>
				<p>Latest result:</p>
				<input type="range" min="1335" max="1965" value="1965" step="1" onchange="showValue2(this.value)" />
				<span id="range2">0</span>
			</td>
		</tr>
	</table>
	-->
		
    </div>
  

    <div class="container">

			<!--<h1>Thesaurus Search Results</h1>-->
			<p><?php echo $lang['RESULT_FILTER']; ?></p>
                     <span style="padding-left:  0pt"><a href="#" onclick="history.go(-1);return false;">&lt;&lt; <?php echo $lang['RESULT_GO_BACK']; ?></a></span>
                     <span style="padding-left:  20pt"><a href="search.php">&lt;&lt; <?php echo $lang['RESULT_START_NEW']; ?></a></span>
			<div id="resultsPerPageContainder" align="right" ">
                <?php echo $lang['RESULT_RESULTSNUMBER']; ?>
                <select id="resultsPerPage" style="width: 50pt" onchange="gotoPage(1)">
                      <option>10</option>
                      <option selected>20</option>
                      <option>30</option>
                      <option>40</option>
                      <option>50</option>
                 </select> 
             </div>
			<div id="error" style="color:red"></div>


			 <div id="loadingDiv"><img src="images/ajax-loader.gif"></div>
            <div id="pagesContainer" align="center" style="display:none">
                <?php echo $lang['RESULT_NUMBER_OF_RESULTS'];?> <span id="pages"></span>
            </div>
			<div id="resultdiv"></div>
			
    </div>
    
    

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="../assets/js/jquery.js"></script>
    <script src="../assets/js/bootstrap-transition.js"></script>
    <script src="../assets/js/bootstrap-alert.js"></script>
    <script src="../assets/js/bootstrap-modal.js"></script>
    <script src="../assets/js/bootstrap-dropdown.js"></script>
    <script src="../assets/js/bootstrap-scrollspy.js"></script>
    <script src="../assets/js/bootstrap-tab.js"></script>
    <script src="../assets/js/bootstrap-tooltip.js"></script>
    <script src="../assets/js/bootstrap-popover.js"></script>
    <script src="../assets/js/bootstrap-button.js"></script>
    <script src="../assets/js/bootstrap-collapse.js"></script>
    <script src="../assets/js/bootstrap-carousel.js"></script>
    <script src="../assets/js/bootstrap-typeahead.js"></script>

  </body>
</html>
