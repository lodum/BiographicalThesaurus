<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $lang['STIS_PAGE_TITLE']; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          height: 80%;
          margin: 0;
          
      }
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
	  
      img {max-width:none}
		
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
	
   <script src="query.js" type="text/javascript"></script>

  </head>

  <body> 
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
			   <li class="active"><a href="#"><?php echo $lang['MENU_SPARQL']; ?></a></li>
<!--	
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
-->
            </ul>
			<div style="padding: 10px 20px 10px;" align="right" class="text"><?php echo $lang['SELECT LANGUAGE']; ?> <a href="?lang=de"><img src="languages/flags/de.png" alt="Deutsch"/></a> <a href="?lang=en"><img src="languages/flags/gb.png" alt="English"/></a></div>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
		<div id="result_success">
		<? echo $lang['result_status_success']; ?>
		</div>
		<div id="result_error">
		<? echo $lang['result_status_error']; ?>
		</div>
			<?php echo $lang['SPARQL_TOP']; ?>
				<textarea id="sparqlQuery" rows="15" class="field span12">
prefix stis:    <http://localhost/default#>
prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix gnd:     <http://d-nb.info/standards/elementset/gnd#>

select * where{
 ?a a gnd:DifferentiatedPerson.
}
				</textarea><br/>
	<button type="submit" class="btn btn-primary" onclick="submitQuery()"><?php echo $lang['SPARQL_SUBMIT']; ?></button><br/><br><div id="loadingDiv"><img src="images/ajax-loader.gif"></div><br/>
	<div id="error" style="color:red"></div>
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
