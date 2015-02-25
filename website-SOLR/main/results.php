<?php
	include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

	<!-- include the header -->
	<?php include 'header.php' ?>

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
	<!-- Leaflet Minimap-->
	<link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.css' rel='stylesheet' />
	<!-- Datatable -->
	<link href="https://cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css" rel="stylesheet">

	<!-- Custom files -->
	<link href="css/customMarker.css" rel="stylesheet">	
	<link href="css/biothe.css" rel="stylesheet" type="text/css" />

	<body>
		<?php 
			// specify the current page
			$_SESSION['current_page'] = "results";
			include 'banner/banner.php';
		?>

		<div class="container-fluid"> 

			<div class="row" style= "padding-top: 9%;">
				<!-- container for the result form (the result form is on the left hand-side) -->
				<div id="result-container" class="col-xs-6 col-md-6 pull-left"> 

					<!--<h1>Thesaurus Search Results</h1>-->
					<p>
						<?php echo $lang['RESULT_FILTER']; ?>
						<div class="pull-right">
							<select id="coreSelector">
								<option>gnd</option>
								<option>gnd2</option>
							</select>
							<button id="btn-toggle-map" >></button>
						</div>
					</p>
					<span style="padding-left:  0pt"><a href="#" onclick="history.go(-1);return false;">&lt;&lt; <?php echo $lang['RESULT_GO_BACK']; ?></a></span>
					<span style="padding-left:  20pt"><a href="search.php">&lt;&lt; <?php echo $lang['RESULT_START_NEW']; ?></a></span>
					<div id="error" style="color:red; display:none;"><br/><br/><?php echo $lang['RESULT_NO_RESULT']; ?></div>

					<div id="loadingDiv"><img src="images/ajax-loader.gif"></div>
					<div id="resultdiv" style="height:400px;"></div>
					<!-- this span element is used to store the title (in german or in english) of the additional window displayed when the results are exported as HTML -->
					<span id="titleExportedResults" style="display:none"><?php echo $lang['TITLE_EXPORTED_RESULTS']; ?></span> 
				</div>
				<!-- container for the map (the map is on the right hand-side) -->
				<div id="map" class="col-xs-6 col-md-6 pull-right" data-spy="affix" data-offset-top="0" class="col-xs-6 col-md-6 pull-right"></div>
			</div>
			<span style="text-align:left">
				<p>
					
					<button id="exportButton" class="btn btn-primary btn-mini"><?php echo $lang['RESULT_EXPORT']; ?></button>
					<!--
					<div id="exportButton" class="btn-group">
						<button class="btn btn-primary btn-mini"><?php echo $lang['RESULT_EXPORT']; ?></button>
						<button class="btn btn-primary btn-mini dropdown-toggle" data-toggle="dropdown">
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu"> 
							<li><a tabindex="-1" href="#"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?> HTML</a></li>
							<li class="divider"></li>
							<li><a tabindex="-1" href="#"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?>...</a></li>
							<li class="divider"></li>
							<li><a tabindex="-1" href="#"><?php echo $lang['RESULT_EXPORT_DROPDOWN']; ?>...</a></li>
						</ul>
					</div>
					-->
					<button id="printButton" class="btn btn-primary btn-mini"><?php echo $lang['RESULT_PRINT']; ?></button>
				</p>
			</span>
		</div>

		<!-- include the footer -->
		<?php include 'footer.php'; ?>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<!-- jQuery -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<!-- jQuery.ui -->
		<script src="../assets/js/jQuery-1.10.3/jquery-ui.js"></script>
		<!-- Bootstrap -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
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
		<script src="../assets/js/bootstrap-affix.js"></script>
		<!-- Leaflet -->
		<script src="../assets/leaflet-0.6.4/leaflet.js"></script>
		<!-- Leaflet Minimap -->
		<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-minimap/v1.0.0/Control.MiniMap.js'></script>
		<!-- Leaflet.markercluster -->
		<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v0.4.0/leaflet.markercluster.js"></script>
		<!-- jQuery.dataTables -->
		<script src="https://cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>

		<!-- Custom files -->
		<script src="javascript/Query.js" type="text/javascript"></script>
		<script src="javascript/Map.js" type="text/javascript"></script>
		<script src="javascript/result.js"></script>
		<script src="javascript/details.js"></script>

	</body>
</html>
