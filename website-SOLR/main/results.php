<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

  <!-- include the header -->
  <?php include 'header.php' ?>

  <!-- Leaflet.markercluster -->
  <link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css" rel="stylesheet">
  <!-- Default is not used. custom Marker is used
  <link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css" rel="stylesheet">
  -->
  <link href="css/customMarker.css" rel="stylesheet">

  <!-- Leaflet Minimap-->
  <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.css' rel='stylesheet' />
  <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.js'></script>

  
  <script src="../assets/js/jquery.js"></script>
  <script src="../assets/js/jQuery-1.10.3/jquery-ui.js"></script>
  
  <!-- Leaflet.markercluster -->
  <script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
  <!-- Datatable -->
  <link href="https://cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css" rel="stylesheet">
  <script src="https://cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>

  <script src="javascript/Query.js" type="text/javascript"></script>
  <script src="javascript/Map.js" type="text/javascript"></script>
  <script src="javascript/result.js"></script>

  <?php 
	// select the file for the buttons helping to draw and delete a bounding box on the map according to the current language
		switch ($lang) {
		  case 'en':
		  echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_en.js'></script>";
		  break;

		  case 'de':
		 echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_de.js'></script>";
		  break;

		  default:
		  echo "<script type='text/javascript' src='../assets/leaflet-draw/leaflet.draw_de.js'></script>";

		}
	 ?>
  
  <body>

	 <?php 
	 // specify the current page
	 $_SESSION['current_page'] = "results";
	 include 'banner/banner.php';
	 ?>
    
	<div class="container-fluid"> 

		<div class="row-fluid" style= "padding-top: 13%;">
			<!-- container for the result form (the result form is on the left hand-side) -->
			<div class="pull-left" style = "width:50%"> 

				<!--<h1>Thesaurus Search Results</h1>-->
				<p><?php echo $lang['RESULT_FILTER']; ?></p>
						 <span style="padding-left:  0pt"><a href="#" onclick="history.go(-1);return false;">&lt;&lt; <?php echo $lang['RESULT_GO_BACK']; ?></a></span>
						 <span style="padding-left:  20pt"><a href="search.php">&lt;&lt; <?php echo $lang['RESULT_START_NEW']; ?></a></span>
				<div id="error" style="color:red; display:none;"><br/><br/><?php echo $lang['RESULT_NO_RESULT']; ?></div>
				
				<div id="loadingDiv"><img src="images/ajax-loader.gif"></div>
				<div id="resultdiv" style="width:100%; height:400px; overflow-y:auto;"></div>
				<span style="text-align:center">
				<p>
				<!--
				<button id="exportButton" class="btn btn-primary btn-mini" style="display:none;" onclick="displaySelectedResultsAsHTML()"><?php echo $lang['RESULT_EXPORT']; ?></button> -->
				    <div id="exportButton" class="btn-group" style="display:none;" >
						<button class="btn btn-primary btn-mini"><?php echo $lang['RESULT_EXPORT']; ?></button>
						<button class="btn btn-primary btn-mini dropdown-toggle" data-toggle="dropdown">
						<span class="caret"></span>
						</button>
						<ul class="dropdown-menu"> 
							<!-- dropdown menu links -->
							<li><a tabindex="-1" href="#" onclick="displaySelectedResultsAsHTML()"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?> HTML</a></li>
							<li class="divider"></li>
							<li><a tabindex="-1" href="#"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?>...</a></li>
							<li class="divider"></li>
							<li><a tabindex="-1" href="#"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?>...</a></li>
						</ul>
					</div>
			 	&nbsp; 	&nbsp;
				<button id="printButton" class="btn btn-primary btn-mini" style="display:none;" onclick="printResults()"><?php echo $lang['RESULT_PRINT']; ?></button>
				</p>
				</span>
				<!-- this span element is used to store the title (in german or in english) of the additional window displayed when the results are exported as HTML -->
				<span id="titleExportedResults" style="display:none"><?php echo $lang['TITLE_EXPORTED_RESULTS']; ?></span> 
	 
				 
			</div>
			
			 <!-- container for the map (the map is on the right hand-side) -->
			 <div id="map" class="pull-right" ></div>
		</div>
	
	</div>
	
	<!-- include the footer -->
	<?php include 'footer.php'; ?>
		   

	
    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
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
