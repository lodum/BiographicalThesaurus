<?php
include 'common.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Biographical Thesaurus NRW</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

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
  
  
  <script src="tagcanvas.min.js" type="text/javascript"></script>
  <script src="query.js" type="text/javascript"></script>
  
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
	</head>  

  <body onload="submitTagCloudQuery()">

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#">Biographical Thesaurus NRW</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
               <li><a href="stis.php"><?php echo $lang['MENU_HOME']; ?></a></li>
               <li><a href="search.php"><?php echo $lang['MENU_SEARCH']; ?></a></li>
               <!--<li><a href="explore.php"><?php echo $lang['MENU_EXPLORE']; ?></a></li>-->
               <li class="active"><a href="#"><?php echo $lang['MENU_TAG']; ?></a></li>
			   <li><a href="sparql.php"><?php echo $lang['MENU_SPARQL']; ?></a></li>
<!--
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
-->
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

	<div class="container">
		<h1>Tag Cloud</h1>
	</div>
	<div id="myCanvasContainer">
	 <canvas width="900" height="400" id="myCanvas">
	   <p>Anything in here will be replaced on browsers that support the canvas element</p>
		  <ul id="resultdiv"></ul>
	 </canvas>
	</div>
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
