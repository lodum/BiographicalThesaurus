<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

  <!-- include the header -->
  <?php include 'header.php' ?>
  
  <script src="tagcanvas.min.js" type="text/javascript"></script>
  
  <script type="text/javascript">
	  window.onload = function() {
		  // set colour of text and outline of active tag
		  TagCanvas.textColour = '#000000';
		  TagCanvas.outlineColour = '#ff9999';
		  TagCanvas.Start('myCanvas');
		try {
		  TagCanvas.Start('myCanvas');
		} catch(e) {
		  // something went wrong, hide the canvas container
		  document.getElementById('myCanvasContainer').style.display = 'none';
		}
	  };
  </script>


  <body onload="submitTagCloudQuery()">
  	<!-- include the banner -->
	 <?php 
	  // specify the current page
	  $_SESSION['current_page'] = "cloud";
	  include 'banner/banner.php'; 
	 ?>
  
	 <div class="container-fluid"> 
		   <!-- container for the form of the tag cloud -->
			<div class="container" style="padding-top: 12%;">
			<h1><?php echo $lang['CLOUD_TITLE']; ?></h1>
			</div>
			
			<div class="container">
			<?php echo $lang['CLOUD_HELP']; ?>
			</div>
			
			<div id="myCanvasContainer">
			 <canvas width="900" height="400" id="myCanvas">
			   <p>Anything in here will be replaced on browsers that support the canvas element</p>
				  <ul id="resultdiv"></ul>
			 </canvas>
			</div>
	</div>	
    <!-- include the footer -->
	<?php include 'footer.php'; ?>  
 
   <!--<ul>
		   <li><a href="#">Münster</a></li>
		   <li><a href="#">Annette von Droste-Hülshoff</a></li>
		   <li><a href="#">Westfalen</a></li>
		   <li><a href="#">Gedichte</a></li>
		   <li><a href="#">Erzählungen</a></li>
		   <li><a href="#">Geschichten</a></li>
		   <li><a href="#">Friedensvertrag</a></li>
		   <li><a href="#">30 Jähriger Krieg</a></li>
		   <li><a href="#">Dom</a></li>
		  </ul>-->

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
