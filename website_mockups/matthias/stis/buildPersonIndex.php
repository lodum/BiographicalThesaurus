<?php
/**
 * Making a SPARQL SELECT query
 *
 * This example creates a new SPARQL client, pointing at the
 * dbpedia.org endpoint. It then makes a SELECT query that
 * returns all of the countries in DBpedia along with an
 * english label.
 *
 * Note how the namespace prefix declarations are automatically
 * added to the query.
 *
 * @package    EasyRdf
 * @copyright  Copyright (c) 2009-2012 Nicholas J Humfrey
 * @license    http://unlicense.org/
 */
#echo get_include_path();
set_include_path('./vendor/easyrdf/easyrdf/examples/');
require_once "html_tag_helpers.php";
set_include_path('./vendor/easyrdf/easyrdf/lib/');
require 'vendor/autoload.php';
require_once "EasyRdf.php";
#require_once "html_tag_helpers.php";
include_once '/var/www/php/Zend/Loader.php';
Zend_Loader::registerAutoload();
//TODO set this to infinity
//Zend_Search_Lucene::setTermsPerQueryLimit(1000000);

//Get the triples

EasyRdf_Namespace::set('stis', 'http://localhost/default#');
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
EasyRdf_Namespace::set('gnd', 'http://d-nb.info/standards/elementset/gnd#');
$sparql = new EasyRdf_Sparql_Client('http://data.uni-muenster.de/bt/sparql');
//$result1 = $sparql->query('SELECT * WHERE {?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?name.} OFFSET 10000 LIMIT 20000');
$result = $sparql->query('select * where{ ?uri a stis:Person. ?uri gnd:preferredNameForThePerson ?name .} LIMIT 1000');

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

//Create placesOfDeath Index
$index = Zend_Search_Lucene::create('./index_persons');
foreach ($filteredResult as $name => $uri){
    #echo "<li>".link_to($row->label, $row->country)."</li>\n";
    #echo $row->a." ".$row->name."\n";
    $document = new Zend_Search_Lucene_Document();
    $document->addField(Zend_Search_Lucene_Field::UnIndexed('URI', $uri));
    $document->addField(Zend_Search_Lucene_Field::Text('person', $name));
    $index->addDocument($document);
}

$index->commit();

$index = Zend_Search_Lucene::open('./index_persons');
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
        $person=$result->person;
        #echo 'Score: ' . $result->score . "\n";
        //echo "\n";
        $posts[]=array('uri'=>$uri,'person'=>$person);
    }
    $response=array();
    $response['person']=$posts;
    $fp = fopen('person.json', 'w');
	fwrite($fp, json_encode($response));
	fclose($fp);
    
}
?>
