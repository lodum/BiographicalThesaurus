<?php
/**
 * This Script selects all occupations from the triplestore and
 * inserts the touple (uri,occupationName) into the lucene index
 * "index_occupations".
 */

set_include_path('./vendor/easyrdf/easyrdf/examples/');
require_once "html_tag_helpers.php";
set_include_path('./vendor/easyrdf/easyrdf/lib/');
require 'vendor/autoload.php';
require_once "EasyRdf.php";
include_once '/var/www/php/Zend/Loader.php';
Zend_Loader::registerAutoload();
//TODO set this to infinity
//Zend_Search_Lucene::setTermsPerQueryLimit(1000000);

//Get the triples
EasyRdf_Namespace::set('stis', 'http://localhost/default#');
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
EasyRdf_Namespace::set('gnd', 'http://d-nb.info/standards/elementset/gnd#');
$sparql = new EasyRdf_Sparql_Client('http://data.uni-muenster.de/bt/sparql');
$result = $sparql->query('select * where{ ?a gnd:professionOrOccupation ?uri.  ?uri gnd:preferredNameForTheSubjectHeading ?name .} LIMIT 1000');

//Filter results for duplicates
//[][0] name; [][1]uri

$rawResult = array(array(2));
$i=0;
foreach ($result as $row){
	$rawResult[$i][0]=$row->name;
	$rawResult[$i][1]=$row->uri;
	$i++;
}
$filteredResult = array();
for($i=0;$i<sizeof($rawResult);$i++) {
	$name=$rawResult[$i][0];
	$uri=$rawResult[$i][1];
	$filteredResult[''.$name.'']=$uri;
}

//Create occupation Index
$index = Zend_Search_Lucene::create('./index_occupations');
foreach ($filteredResult as $name => $uri){
    #echo "<li>".link_to($row->label, $row->country)."</li>\n";
    #echo $row->a." ".$row->name."\n";
    $document = new Zend_Search_Lucene_Document();
    $document->addField(Zend_Search_Lucene_Field::UnIndexed('URI', $uri));
    $document->addField(Zend_Search_Lucene_Field::Text('occupation', $name));
    $index->addDocument($document);
}
$index->commit();

//Write content of occupation index to a json-file (occupation.json)
$index = Zend_Search_Lucene::open('./index_occupations');
$queries = array(
    '*'
);
foreach ($queries as $query) {
	Zend_Search_Lucene_Search_Query_Wildcard::setMinPrefixLength(0);
    $results = $index->find(Zend_Search_Lucene_Search_QueryParser::parse($query));
    echo "Suche: " . $query . "\n";
    echo count($results) . " Ergebnisse \n\n";
    $posts=array();
    foreach ($results as $result) {
        //echo 'URI: ' . $result->URI . "\n";
		$uri=$result->URI;
        //echo 'Person: ' . $result->person . "\n";
        $occupation=$result->occupation;
        #echo 'Score: ' . $result->score . "\n";
        //echo "\n";
        $posts[]=array('uri'=>$uri,'occupation'=>$occupation);
    }
    $response=array();
    $response['occupation']=$posts;
    $fp = fopen('occupation.json', 'w');
	fwrite($fp, json_encode($response));
	fclose($fp);
}
?>
