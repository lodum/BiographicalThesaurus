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
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
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
              <li class="active"><a href="#"><?php echo $lang['MENU_HOME']; ?></a></li>
               <li><a href="search.php"><?php echo $lang['MENU_SEARCH']; ?></a></li>
               <li><a href="explore.php"><?php echo $lang['MENU_EXPLORE']; ?></a></li>
               <li><a href="results.html"><?php echo $lang['MENU_RESULTS']; ?></a></li>
			  <li><a href="sparql.php">SPARQL</a></li>
<!--
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
-->
<!--
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li class="divider"></li>
                  <li class="nav-header">Nav header</li>
                  <li><a href="#">Separated link</a></li>
                  <li><a href="#">One more separated link</a></li>
                </ul>
              </li>
-->
            </ul>
			<div style="padding: 10px 20px 10px;" align="right" class="text"><?php echo $lang['SELECT LANGUAGE']; ?> <a href="?lang=de"><img src="languages/flags/de.png" alt="Deutsch"/></a> <a href="?lang=en"><img src="languages/flags/gb.png" alt="English"/></a></div>
<!--
            <form class="navbar-form pull-right">
              <input class="span2" type="text" placeholder="Email">
              <input class="span2" type="password" placeholder="Password">
              <button type="submit" class="btn">Sign in</button>
            </form>
-->
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Main hero unit for a primary marketing message or call to action -->
      <div class="hero-unit">
        <h1><?php echo $lang['STIS_HERO_HEADER']; ?></h1>
        <p><?php echo $lang['STIS_HERO_TEXT']; ?></p>
		<table>
			<tr>
				<td>
					<p><a class="btn btn-primary btn-large" href="search.php"><?php echo $lang['STIS_HERO_BUTTON1']; ?></a></p>
				</td>
				<td style='width: 100px'>
					<p>   </p>
				</td>
				<td>
					<p><?php echo $lang['STIS_HERO_FREE_SEARCH']; ?></p>
					<input type="text" size="25" value="<?php echo $lang['STIS_HERO_FREE_SEARCH_TEXT']; ?>">
					<p><a class="btn btn-primary btn-large" href="results.php"><?php echo $lang['STIS_HERO_BUTTON2']; ?></a></p>
				</td>
			</tr>
		</table>
        
      </div>

      <!-- Example row of columns -->
      <div class="row">
		<div class="span4">
			<?php echo $lang['STIS_EXPLORE']; ?>

          
        </div>
        <div class="span4">
			<?php echo $lang['STIS_HELP']; ?>

        </div>
        <div class="span4">
			<?php echo $lang['STIS_ULB']; ?>

        </div>
      </div>
        <div class="row">
		<div class="span4">
			<?php echo $lang['STIS_SPARQL']; ?>
        </div>
        <div class="span4">
			<?php echo $lang['STIS_CHILDREN']; ?>
        </div>
        <div class="span4">
			<?php echo $lang['STIS_TAG_CLOUD']; ?>
        </div>
      </div>

      <hr>

      <footer>
        <p>&copy; ULB 2012</p>
      </footer>

    </div> <!-- /container -->

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
