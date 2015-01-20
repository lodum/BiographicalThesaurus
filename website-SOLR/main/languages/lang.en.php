<?php
/* 
------------------
Language: English
------------------
*/

$lang = array();

// Menu links:
$lang['MENU_HOME'] = 'Home';
$lang['MENU_SEARCH'] = 'Search';
$lang['MENU_RESULTS'] = 'Results';
$lang['MENU_EXPLORE'] = 'Explore';
$lang['MENU_TAG'] = 'Tag Cloud';
$lang['MENU_SPARQL'] = 'SPARQL Endpoint';

//home.php
$lang['STIS_LANGUAGE'] = '<meta http-equiv="language" content="en">';
$lang['STIS_PAGE_TITLE'] = 'Biographical Thesaurus NRW';
$lang['STIS_HERO_HEADER'] = 'Welcome';
$lang['STIS_HERO_TEXT'] = 'This is the Biographical Thesaurus NRW. Here, you will find information on persons which have connections to North Rhine-Westphalia (NRW)';
$lang['STIS_HERO_BUTTON1'] = 'Go to map and search form! &raquo;';
$lang['STIS_HERO_FREE_SEARCH'] = 'Try the free text search:';
$lang['STIS_HERO_FREE_SEARCH_TEXT'] = 'Enter your search string here';
$lang['STIS_HERO_BUTTON2'] = 'Start free text search! &raquo;';
$lang['SELECT LANGUAGE'] = 'Language: ';
$lang['STIS_EXPLORE'] = '<h2>Explore dataset</h2><p>How can the biographical thesaurus be used? What can I find? Can I trust the information I receive? Where can I find more information?</p><p><a class="btn" href="explore.php">Explore &raquo;</a></p>';

$lang['STIS_HELP'] =  '<h2>Help</h2><p>How can the biographical thesaurus be used? What can I find? Can I trust the information I receive? Where can I find more information?</p><p><a class="btn" href="#">View details &raquo;</a></p>';

$lang['STIS_ULB'] =  '<h2>ULB</h2>
          <p>What other services does the ULB offer to me? How can I visit the ULB? </p>
          <p><a class="btn" href="http://www.ulb.uni-muenster.de/" target="_blanc">View details &raquo;</a></p>';
		  
$lang['STIS_SPARQL'] = '<h2>Expert interface</h2>
          <p>SPARQL endpoint to browse and explore the data directly via SPARQL.</p>
          <p><a class="btn" href="sparql.php">SPARQL Endpoint &raquo;</a></p>';
		  
$lang['STIS_CHILDREN'] = '<h2>Childrens access</h2>
          <p>Play around with the data and explore the world of historical Westphalia!</p>
          <p><a class="btn" href="#">Let\'s play! &raquo;</a></p>';

$lang['STIS_TAG_CLOUD'] = '<h2>Tag cloud</h2>
          <p>Explore a tagcloud that features prominent persons in the data.</p>
          <p><a class="btn" href="tag_cloud.php">Show me the cloud &raquo;</a></p>';

//search.php		   
$lang['SEARCH_TITLE'] = 'Search form';
$lang['SEARCH_SUBJECT'] = 'Subject / Field of interest';
$lang['SEARCH_SUBJECT2'] = 'Enter a subject';
$lang['SEARCH_POI'] = 'Person';
$lang['SEARCH_POI2'] = 'Name of the person';
$lang['SEARCH_AUTHOR'] = 'Name of an author';
$lang['SEARCH_AUTHOR2'] = 'Author';
$lang['SEARCH_PUB'] = 'Publication title';
$lang['SEARCH_PUB2'] = 'Title';
$lang['SEARCH_TIME'] = 'Time period (or era) that is of interest to you: ';
$lang['SEARCH_TIME_LABEL'] = '[ no indication for the moment ]';
$lang['SEARCH_ERA'] = 'Era';
$lang['SEARCH_ERA_CHOICES'] = array('...', 'Industrial/Modern (1800 +)', 'Post-medieval Period (1500-1800)', 'Medieval Period (800-1500)', 'Early Medieval Period (400-800)');
$lang['SEARCH_PLACE'] = 'Place';
$lang['SEARCH_PLACE2'] = 'Place of interest';
$lang['SEARCH_OCC'] = 'Occupation';
$lang['SEARCH_OCC2'] = 'Occupation of a person';
$lang['SEARCH_SUBMIT'] = 'Submit';
$lang['SEARCH_RESET'] = 'Reset';
$lang['SEARCH_FOREXAMPLE:'] = 'Example ';
$lang['SEARCH_CHECK_BOX1:'] = 'Birthplace ';  
$lang['SEARCH_CHECK_BOX2:'] = 'Deathplace ';  
$lang['SEARCH_CHECK_BOX3:'] = 'Place of activity ';
$lang['SEARCH_CHECK_BOX4:'] = 'Remove time period ';    
$lang['warning_slider'] = 'Please specify at least a person, or an occupation, or a place, or a time period...';
$lang['warning_place'] = 'Please select a type of place...';

//explore.php
$lang['EXPLORE_TITLE'] = 'Indexes ';
$lang['EXPLORE_HELP'] = 'This page displays the list of all indexes available in the dataset. ';
	  
//sparql.php
$lang['SPARQL_TOP'] = '<h1>Thesaurus SPARQL Endpoint</h1><br/><h3>Query Submission Form</h3>';
$lang['SPARQL_SUBMIT'] = 'Submit Query';

$lang['result_status_success'] = 'Query returned successfully';
$lang['result_status_error'] = 'Invalid query...';

//results.php
$lang['RESULT_FILTER'] = 'The following results were found according to the data that you entered in the search form.';
$lang['RESULT_RESULTSNUMBER'] = 'Results per page:';
$lang['RESULT_NUMBER_OF_RESULTS'] = 'Number of Results: ';
$lang['RESULT_GO_BACK'] = 'go back';
$lang['RESULT_START_NEW'] = 'start new search';
$lang['RESULT_EXPORT'] = "Export";
$lang['RESULT_EXPORT_DROPDOWN'] = "as ";
$lang['RESULT_PRINT'] = "Print";
$lang['RESULT_BACK_ALL_RESULTS'] = "back to all results";
$lang['TITLE_EXPORTED_RESULTS'] = "Exported Results";
$lang['RESULT_NO_RESULT'] = "No result "; 
$lang['warning_selected_results'] = 'Please select at least one result...';

//tag_cloud.php
$lang['CLOUD_TITLE'] = 'Tag Cloud';
$lang['CLOUD_HELP'] = 'The tag cloud displays the authors with the most publications that are stored in the database. Click on their name to receive information on them.';

?>

