<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

  <!-- include the header -->
  <?php include 'header.php' ?>  

  <body >
  	<!-- include the banner -->
	 <?php 
	  // specify the current page
	  $_SESSION['current_page'] = "explore";
	  include 'banner/banner.php'; 
	 ?>
  
	 <div class="container-fluid"> 
		   <!-- container for the form of the tag cloud -->
			<div class="container" style="padding-top: 12%;">
			<h1><?php echo $lang['EXPLORE_TITLE']; ?></h1>
			</div>
			
			<div class="container" style="margin-bottom: 50%">
			<?php echo $lang['EXPLORE_HELP']; ?>
			</div>

	</div>	
    <!-- include the footer -->
	<?php include 'footer.php'; ?>  
 

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
