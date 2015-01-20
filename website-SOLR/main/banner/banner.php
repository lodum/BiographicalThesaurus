<!-- The file contains logos as well as the different navigation tabs at the top of the website -->

<!-- container for links such as search, home, and so on -->
    <div class="navbar navbar-inverse navbar-fixed-top">
	  	<!-- Logos of the WWU and ULB-->   	
	    <div class="container" style="background-color:white; overflow:hidden; width:100%; margin:0">
        <div id="logo1"><a title="Startseite WWU" href="http://www.uni-muenster.de/" ><img src="../main/images/wwu_logo.gif" alt="Logo der Universität Münster (Link zur Startseite der Universität Münster)" title="Logo der Universität Münster (Link zur Startseite der Universität Münster)" width="278" height="60"/></a></div>
        <div id="logo2"><a title="ULB Münster" href="http://www.ulb.uni-muenster.de/"><img src="../main/images/logo.gif" alt="Logo der Universitäts- und Landesbibliothek Münster (Link zur Startseite der ULB)" title="Logo der Universitäts- und Landesbibliothek Münster (Link zur Startseite der ULB)"/></a></div>
        </div>	
	
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
			  	<?php
					// change the navigation tab according to the current page
					switch ($_SESSION['current_page'])
					{
						  case 'home':
						  include('banner_home.php');
						  break;

						  case 'search':
						  include('banner_search.php');
						  break;

						  case 'results':
						  include('banner_results.php');
						  break;  
						  
						  case 'explore':
						  include('banner_explore.php');
						  break; 
						  
						  case 'cloud':
						  include('banner_cloud.php');
						  break;
						  
						  case 'endpoint':
						  include('banner_endpoint.php');
						  break;
						 
						  default:
						  include('banner_home.php');
					}		
				  ?> 
            </ul>
			<div style="padding: 10px 20px 10px;" align="right" class="text"><?php echo $lang['SELECT LANGUAGE']; ?> 
                <a href="?lang=de"  title="Deutsch"><img src="languages/flags/de.png" alt="Deutsch"/></a> 
                <a href="?lang=en"  title="English"><img src="languages/flags/gb.png" alt="English"/></a>
			</div>
          </div>
        </div>
      </div>
	   	<!-- specific content for the current page -->
	   <div id="result_success">
		<?php echo $lang['result_status_success']; ?>
	   </div>
	   <div id="result_error">
		<?php echo $lang['result_status_error']; ?>
	   </div>
	   <div id="warning_slider" class="warning">
		<?php echo $lang['warning_slider']; ?>
	   </div>
	    <div id="warning_place" class="warning">
		<?php echo $lang['warning_place']; ?>
	   </div>
	   <div id="warning_selected_results" class="warning">
		<?php echo $lang['warning_selected_results']; ?>
	   </div>
	     		
    </div>
	
