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
		img {
			max-width: none
		}

    </style>
    
     <style>
        .ui-autocomplete-loading {
            background: white url('images/ajax-loader.gif') right center no-repeat;
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

     <link rel="stylesheet" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css" />

    
     <script src="query.js" type="text/javascript"></script>
    <script>

		function init() {

			// set up the map
			map = new L.Map('map');

			L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
				maxZoom : 18,
				attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
			}).addTo(map);

			map.setView(new L.LatLng(51.966667, 7.633333), 9);
			map.on('click', onMapClick);

		}

		/*function test(id, content) {
		 $(id).value=content;
		 }*/

		function goToResults() {
			var person = document.getElementById('person').value;
			//var publication = document.getElementById('publication').value;
			var place = document.getElementById('place').value;
			var beginDate = document.getElementById('beginDate').value;
			var endDate = document.getElementById('endDate').value;
			var occ = document.getElementById('occ').value;
			//var author = document.getElementById('author').value;
			//var subject = document.getElementById('subject').value;
			var lat;
			var lon;
			if (marker!=null){
				lat=marker.getLatLng().lat;
				lon=marker.getLatLng().lng;
			} else {
				lat="";
				lon="";
			}
			
			console.log(lat);
			console.log(lon);
			location.href = "results.php?person=" + person + "&place=" + place + "&beginDate=" + beginDate + "&endDate=" + endDate + "&author=" + "&lat=" + lat + "&lon=" + lon + "&occ=" + occ;
		}
		
        document.onkeydown = function(event) {
             if (event.keyCode == 13) {
                goToResults();
             }
        }
        
        var marker;
 
		function onMapClick(e) {
			try {
				map.removeLayer(marker);
			} catch (e){
				console.log('no marker yet');
			}
			console.log(e.latlng.lat);
			console.log(e.latlng.lng);
			
			marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
		    

			var s = document.createElement('script');
			s.src = 'http://nominatim.openstreetmap.org/reverse?format=json&json_callback=cb&lat=' + e.latlng.lat + '.&lon=' + e.latlng.lng + '';
			document.getElementsByTagName('head')[0].appendChild(s);

		}

		function cb(json) {
			//do what you want with the json
			console.log(json.address.city);
			document.getElementById('place').value = json.address.city;
			marker.bindPopup("Place: "+json.address.city).openPopup();
		}

    </script>



    <script>
		dojoConfig = {
			parseOnLoad : true
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
               <li class="active"><a href="#"><?php echo $lang['MENU_SEARCH']; ?></a></li>
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
      </div>
    </div>

	<div class="container">
		
	<?php echo $lang['SEARCH_MAP']; ?>
	</div>
	
	 <div id="map"></div>
	
    <div class="container">
	<?php echo $lang['SEARCH_FORM']; ?>

			<form>
				<fieldset>
				<legend><?php echo $lang['SEARCH_TITLE']; ?></legend>
				<!--<label><?php echo $lang['SEARCH_SUBJECT']; ?></label>
				<input id="subject" type="text" placeholder="<?php echo $lang['SEARCH_SUBJECT2']; ?>">-->
				<label><?php echo $lang['SEARCH_POI']; ?></label>
				<input id="person" type="text" placeholder="<?php echo $lang['SEARCH_POI2']; ?>">
				<I>&nbsp;<?php echo $lang['SEARCH_FOREXAMPLE:']; ?>Adenauer, Konrad</I>
				<label><?php echo $lang['SEARCH_OCC']; ?></label>
				<input id="occ" type="text" placeholder="<?php echo $lang['SEARCH_OCC2']; ?>">
				<I>&nbsp;<?php echo $lang['SEARCH_FOREXAMPLE:']; ?>Politiker / Lehrer </I>
				<!--<input type="text" placeholder="Insert text here...">
				<label>Event</label>
				<input type="text" placeholder="Event description">
				<input type="text" placeholder="Happened at which location?">
				<input type="text" placeholder="Insert timestamp or event here">-->
				<!--<label><?php echo $lang['SEARCH_AUTHOR']; ?></label>
				<input id="author" type="text" placeholder="<?php echo $lang['SEARCH_AUTHOR2']; ?>">-->
				<!--<input type="text" placeholder="Co-Author">-->
				<!--<label><?php echo $lang['SEARCH_PUB']; ?></label>
				<input id="publication" type="text" placeholder="<?php echo $lang['SEARCH_PUB2']; ?>">-->
				<label><?php echo $lang['SEARCH_PLACE']; ?></label>
				<input id="place" type="text" placeholder="<?php echo $lang['SEARCH_PLACE2']; ?>">
				<I>&nbsp;<?php echo $lang['SEARCH_FOREXAMPLE:']; ?>K&ouml;ln</I>
				<label><?php echo $lang['SEARCH_TIME']; ?></label>
	            <select name="beginDate" id="beginDate"></select> 
                -
                <select name="endDate" id="endDate"></select>     
                <I>&nbsp;<?php echo $lang['SEARCH_FOREXAMPLE:']; ?>1850-1980</I>				
				</fieldset>
			</form>
	<button class="btn btn-primary" onclick="goToResults()"><?php echo $lang['SEARCH_SUBMIT']; ?></button>
			
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

    <script src="//code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
    <script src="search_autocomplete.js" type="text/javascript"></script>
    

 

<script>
 $(function() {
	 for (i = new Date().getFullYear(); i > 0; i--)
		{
			$('#endDate').append($('<option />').val(i).html(i));
		}
		
	for (i = 1; i < new Date().getFullYear(); i++)
		{
			$('#beginDate').append($('<option />').val(i).html(i));
		}
	
	
});
</script>



  </body>
</html>
