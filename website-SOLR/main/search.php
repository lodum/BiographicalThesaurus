<?php
	include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

	<!-- include the header -->
	<?php include 'header.php' ?>
	
	<meta charset="UTF-8">
		<!-- external css files from Twitter Bootstrap. They are useful for a responsive design -->
    <link href="../assets/css/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="../assets/css/bootstrap-responsive.css" rel="stylesheet" type="text/css" />

	<!-- Include Stylesheets -->
	<!-- jQuery.ui -->
	<link rel="stylesheet" href="../assets/css/jQuery-1.10.3/jquery-ui.css" type="text/css" /> 
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">
	
	<!-- Leaflet -->
	<link rel="stylesheet" href="../assets/leaflet-0.6.4/leaflet.css" type="stylesheet"/>
	<!-- Leaflet.markercluster -->
	<link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.css" rel="stylesheet">
	<link href="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/MarkerCluster.Default.css" rel="stylesheet">
	<!-- Leaflet.draw -->
	<link rel="stylesheet" href="../assets/leaflet-draw/leaflet.draw.css" type="text/css"/>
	<!-- jQEditRangeSlider -->
	<link href="css/iThing.css" rel="stylesheet" type="text/css" />
	<!-- Custom files -->
	<link href="css/biothe.css" rel="stylesheet" type="text/css" />

	<script>
		dojoConfig = {
			parseOnLoad : true
		}
	</script>
	<!-- include the banner -->
	<?php 
		// specify the current page
		$_SESSION['current_page'] = "search";
		include 'banner/banner.php';
	?>
	<body>
		<div class="container-fluid" style="padding-top: 13%;">
		    <div class="row">
		        <div class="col-xs-6 col-md-4 pull-left">
		            <form id="searchform">		
						<fieldset>

							<legend><?php echo $lang['SEARCH_TITLE']; ?></legend>
								
							<p><label><?php echo $lang['SEARCH_POI']; ?></label></p>
							<input id="person" type="text" placeholder="<?php echo $lang['SEARCH_POI2']; ?>">
							<a href="#" rel="tooltip" title="Adenauer, Konrad"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a>
						 
							<p><label><?php echo $lang['SEARCH_OCC']; ?></label></p>
							<input id="occ" type="text" placeholder="<?php echo $lang['SEARCH_OCC2']; ?>">
							<a href="#" rel="tooltip" title="Politiker / Lehrer"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a>
		 
							<p><label><?php echo $lang['SEARCH_PLACE']; ?></label></p>			
							<input id="place" type="text" placeholder="<?php echo $lang['SEARCH_PLACE2']; ?>">
							<a href="#" rel="tooltip" title="K&ouml;ln"><span class="label label-info"><?php echo $lang['SEARCH_FOREXAMPLE:']; ?></span> </a>
								
							<p>
								<div class="row" id="checkboxes">
									<div class="col-md-4">
										<input type="checkbox" id="box_birthplace" ><?php echo $lang['SEARCH_CHECK_BOX1:']; ?>
									</div>
									<div class="col-md-4">
										<input type="checkbox" id="box_deathplace" ><?php echo $lang['SEARCH_CHECK_BOX2:']; ?>
									</div>
									<div class="col-md-4">
										<input type="checkbox" id="box_activityplace" ><?php echo $lang['SEARCH_CHECK_BOX3:']; ?>
									</div>
								</div>
							</p>	

							<p>
	 							<span><b><?php echo $lang['SEARCH_TIME']; ?></b></span>
	 						</p>

	 						<p>
								<div id="slider"></div>							

							</p>

							<label><?php echo $lang['SEARCH_ERA']; ?></label>
							<select id="eraSelector">
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][0];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][1];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][2];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][3];?></option>	 	
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][4];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][5];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][6];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][7];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][8];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][9];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][10];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][11];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][12];?></option>
								<option><?php echo $lang['SEARCH_ERA_CHOICES'][13];?></option>	 			
							</select>
						</fieldset>	
					</form>
					<button class="btn btn-primary" id="btn-search"><?php echo $lang['SEARCH_SUBMIT']; ?></button>
					<button class="btn btn-primary" type="reset" onclick="document.getElementById('searchform').reset(); hideSliderCheckbox();" ><?php echo $lang['SEARCH_RESET']; ?></button>
				</div>
		        <div id="map" class="col-xs-6 col-md-8 pull-right"></div>
		    </div>
		</div>

		<!-- include the footer -->
		<?php include 'footer.php'; ?>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->

		<!-- jQuery -->
		<script src="../assets/js/jquery.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!-- jQuery.ui -->
		<script src="../assets/js/jQuery-1.10.3/jquery-ui.js"></script>
		<!-- Bootstrap 
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
		-->
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
		<!-- jQEditRangeSlider -->
		<script src="javascript/jQAllRangeSliders-withRuler-min.js"></script>
		<!-- Leaflet -->
		<script src="../assets/leaflet-0.6.4/leaflet.js"></script>
		<!-- Leaflet.markerCluster -->
		<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
		<!-- Leaflet.draw -->
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

		<!-- Custom files -->
		<script src="javascript/Map.js" type="text/javascript"></script>
		<script src="javascript/search.js"></script>
		<script src="javascript/Query.js"></script>
		<script src="javascript/Suggester.js"></script>
		<script src="javascript/search_autocomplete.js" type="text/javascript"></script>

	</body>
</html>                 