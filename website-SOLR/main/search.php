<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

   <!-- include the header -->
  <?php include 'header.php' ?>
 	
  	<!-- Leaflet.markercluster -->
  <link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css" rel="stylesheet">
  <link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css" rel="stylesheet">

    <script src="../assets/js/jquery.js"></script>
	<script src="../assets/js/jQuery-1.10.3/jquery-ui.js"></script>
	<!-- Leaflet.markercluster -->
  	<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
  	<script src="javascript/Map.js" type="text/javascript"></script>
  	<script src="javascript/search.js"></script>
  	<script src="javascript/Query.js"></script>
  	<script src="javascript/Suggester.js"></script>
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
	
	<link rel="stylesheet" href="../assets/leaflet-draw/leaflet.draw.css" type="text/css"/>

    <script>
		dojoConfig = {
			parseOnLoad : true
		}
	</script>
  
  <body>
	
	 <!-- include the banner -->
	 <?php 
	 // specify the current page
	 $_SESSION['current_page'] = "search";
	 include 'banner/banner.php';
	 ?>
 
     <!-- specific content for the current page -->
	<div class="container-fluid"> 

		<div class="row-fluid" style="padding-top: 13%;">
			<!-- container for the search form (the search form is on the left hand-side) -->
			<div class="pull-left" >  
 					<form id="searchform" style="width:100%; height:80%;">
						
						<fieldset>
							<legend><?php echo $lang['SEARCH_TITLE']; ?></legend>
							
							<label><?php echo $lang['SEARCH_POI']; ?></label>
							<input id="person" type="text" placeholder="<?php echo $lang['SEARCH_POI2']; ?>">
							<a href="#" rel="tooltip" title="Adenauer, Konrad"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a> <br/><br/> 
					 
							<label><?php echo $lang['SEARCH_OCC']; ?></label>
							<input id="occ" type="text" placeholder="<?php echo $lang['SEARCH_OCC2']; ?>">
							<a href="#" rel="tooltip" title="Politiker / Lehrer"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a> <br/> <br/>
	 
							<label><?php echo $lang['SEARCH_PLACE']; ?></label>				
							<input id="place" type="text" placeholder="<?php echo $lang['SEARCH_PLACE2']; ?>">
							<a href="#" rel="tooltip" title="K&ouml;ln"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a> <br/>
							<span id="checkboxes">
								<label class="checkbox inline">
									<input type="checkbox" id="box_birthplace" ><?php echo $lang['SEARCH_CHECK_BOX1:']; ?>  
								</label>
								<label class="checkbox inline">
									<input type="checkbox" id="box_deathplace" ><?php echo $lang['SEARCH_CHECK_BOX2:']; ?>  
								</label>
								<label class="checkbox inline">
									<input type="checkbox" id="box_activityplace" ><?php echo $lang['SEARCH_CHECK_BOX3:']; ?>  
								</label>
								<br/>
							</span>
							<br/> 
	 						<span><?php echo $lang['SEARCH_TIME']; ?></span><span id="currentTimeInterval"><?php echo $lang['SEARCH_TIME_LABEL']; ?></span> 
	 						<br/><br/><br/><br/>    
							<div id="slider"></div>
					
							<div id="box_slider" style="display: none;">
								<label class="checkbox inline"><input type="checkbox" id="checkbox_slider" onclick="hideSliderCheckbox()"><?php echo $lang['SEARCH_CHECK_BOX4:'];?></label>						
								<br/>
							</div>
						
							<br/>
							<label><?php echo $lang['SEARCH_ERA']; ?></label>
							<select id="eraSelector">
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][0];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][1];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][2];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][3];?></option>	 	
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][4];?></option>	 			
							</select>
						</fieldset>	
						<br/>
					</form>
					<button class="btn btn-primary" id="btn-search"><?php echo $lang['SEARCH_SUBMIT']; ?></button>
					<button class="btn btn-primary" type="reset" onclick="document.getElementById('searchform').reset(); hideSliderCheckbox();" ><?php echo $lang['SEARCH_RESET']; ?></button>
			</div>
	
			 <!-- container for the map (the map is on the right hand-side) -->
			 <div id="map" class="pull-right"></div>
	
		</div>
		
	</div>
	
	<!-- include the footer -->
	<?php include 'footer.php'; ?>
	
    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<!-- javascript files coming with the template of Twitter Bootstrap -->	
	
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

    <script src="javascript/search_autocomplete.js" type="text/javascript"></script>
 
	<!-- javascript file useful for the time slider -->
	<script src="javascript/jQEditRangeSlider-min.js"></script>  
  </body>
</html>
