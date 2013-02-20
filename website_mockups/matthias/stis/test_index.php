<?php
 
include_once 'Zend/Loader.php';
Zend_Loader::registerAutoload();
 
$index = Zend_Search_Lucene::open('./index_test');
 
$queries = array('Dortmund','Essen');
 
foreach ($queries as $query) {
    $results = $index->find(
            Zend_Search_Lucene_Search_QueryParser::parse($query)
    );
    echo "Suche: " . $query . "\n";
    echo count($results) . " Ergebnisse \n\n";
    foreach ($results as $result) {
	echo 'URI: ' . $result->URI . "\n";
        echo 'Place Of Death: ' . $result->placeOfDeath . "\n";
        #echo 'Score: ' . $result->score . "\n";
        echo  "\n";
    }
}

?>
