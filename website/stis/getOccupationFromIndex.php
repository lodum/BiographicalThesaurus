<?php

/*
 * Returns a list (json encoded) of fitting OCCUPATIONnames and URIs 
 * from the Lucene Index when the name argument is set.
 */

$zendPath = realpath('stis/stis/Zend/');
set_include_path($zendPath.PATH_SEPARATOR.get_include_path());
include 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance(); 
 
$name     = $_GET["name"];
$index = Zend_Search_Lucene::open('./index_occupations');
$queries = array(
    $name
);
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
        $occupation=$result->occupation;
        #echo 'Score: ' . $result->score . "\n";
        //echo "\n";
        $posts[]=array('uri'=>$uri,'occupation'=>$occupation);
    }
    $response=array();
    $response['occupations']=$posts;
    echo json_encode($response);
}

?>
