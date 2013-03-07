<?php

/*
 * Returns a list of fitting names from the Lucene Index when the name argument is set.
 */
//ini_set('display_errors', 1);
//error_reporting(E_ALL);
 
//include_once '/var/www/php/Zend/Loader.php';
//Zend_Loader::registerAutoload();

$zendPath = realpath('stis/stis/Zend/');
set_include_path($zendPath.PATH_SEPARATOR.get_include_path());
include 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance(); 
 
$name     = $_GET["name"];
//echo $name;
//return $name;
//$name = "Bad \n";
//echo $name;



$index = Zend_Search_Lucene::open('./index_placesOfDeath');

$queries = array(
    $name
    
);

//echo $name;

foreach ($queries as $query) {
	Zend_Search_Lucene_Search_Query_Wildcard::setMinPrefixLength(0);
    $results = $index->find(Zend_Search_Lucene_Search_QueryParser::parse($query));
    //echo "Suche: " . $query . "\n";
    //echo count($results) . " Ergebnisse \n\n";
    $posts=array();
    foreach ($results as $result) {
        //echo 'URI: ' . $result->URI . "\n";
		$uri=$result->URI;
        //echo 'Place Of Death: ' . $result->placeOfDeath . "\n";
        $placeOfDeath=$result->placeOfDeath;
        #echo 'Score: ' . $result->score . "\n";
        //echo "\n";
        $posts[]=array('uri'=>$uri,'placeOfDeath'=>$placeOfDeath);
    }
    $response=array();
    $response['placesOfDeath']=$posts;
    echo json_encode($response);
}

?>
