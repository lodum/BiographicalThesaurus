<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="de">

  <!-- include the header -->
  <?php include 'header.php' ?>
<body> 
  
   	 <?php 
	 // specify the current page
	 $_SESSION['current_page'] = "endpoint";
	 include 'banner/banner.php';
	 ?>
    
	<!-- specific content for the current page -->
	<div id="queryresultsdiv" class="container-fluid" style = "padding-top: 12%;"> 
	    <div class="container">				
		<?php echo $lang['SPARQL_TOP']; ?>
		<textarea id="sparqlQuery" rows="15" class="field span12">
prefix stis:    <http://localhost/default#>
prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix gnd:     <http://d-nb.info/standards/elementset/gnd#>

select * where
{
	?a a gnd:DifferentiatedPerson.
}
		</textarea><br/>
		
		<button type="submit" class="btn btn-primary" onclick="submitQuery()"><?php echo $lang['SPARQL_SUBMIT']; ?></button><br/><br><div id="loadingDiv"><img src="images/ajax-loader.gif"></div><br/> 
		<div id="resultsPerPageContainer" align="right" style="display:none">
			Results per page:
			<select id="resultsPerPage" style="width: 50pt" onchange="gotoPage(1)">
				<option>10</option>
				<option selected>20</option>
				<option>30</option>
				<option>40</option>
				<option>50</option>
			</select>
		</div>
		<div id="pagesContainer" align="center" style="display:none">
					<?php echo $lang['RESULT_NUMBER_OF_RESULTS'];?> <span id="pages"></span>
		 </div>
		<div id="resultdiv"></div>
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
