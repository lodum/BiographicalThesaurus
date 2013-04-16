<?php

/*
 * This script matches the persons from the DNB dataset
 * with a specific gnd-identifier to persons from
 * DBPedia who also have this identifier
 * 
 * DNB: gnd:gndIdentifier
 * 
 * select * where{
 * ?person a gnd:DifferentiatedPerson.
 * ?person gnd:gndIdentifier ?identifier.
 * } LIMIT 10
 * 
 * DBP: dbpprop:pnd
 * select * where {
 * ?person a dbpedia-owl:Person.
 * ?person dbpprop:pnd ?identifier
 * } LIMIT 10
 * 
 */

set_include_path('/var/www/php/stis/stis/vendor/easyrdf/easyrdf/examples/');
require_once "html_tag_helpers.php";
set_include_path('/var/www/php/stis/stis/vendor/easyrdf/easyrdf/lib/');
require '/var/www/php/stis/stis/vendor/autoload.php';
require_once "EasyRdf.php";

EasyRdf_Namespace::set('stis', 'http://localhost/default#');
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
EasyRdf_Namespace::set('gnd', 'http://d-nb.info/standards/elementset/gnd#');
$sparql = new EasyRdf_Sparql_Client('http://data.uni-muenster.de/bt/sparql');

/*
 * Step 1
 * Get all Persons from the lodum triple store with URI and gndIdentifier as an array.
 */

$result = $sparql->query('select * where {?person a gnd:DifferentiatedPerson. ?person gnd:gndIdentifier ?identifier.} LIMIT 10');
$rawResultBT = array(array(2));
$i=0;
foreach ($result as $row){
	$rawResultBT[$i][0]=$row->person;
	$rawResultBT[$i][1]=$row->identifier;
	$i++;
}
for($i=0;$i<sizeof($rawResultBT);$i++) {
	echo $rawResultBT[$i][0];
	echo "    ";
	echo $rawResultBT[$i][1];
	echo "\n";
}

/*
 * Step 2
 * For each person in the array, identify the DBPedia URI
 * Anette: 118527533
 */
EasyRdf_Namespace::set('dbpedia', 'http://dbpedia.org/ontology/');
EasyRdf_Namespace::set('dbpprop', 'http://dbpedia.org/property/');
$sparql = new EasyRdf_Sparql_Client('http://dbpedia.org/sparql');
$result = $sparql->query('select * where {?person a dbpedia:Person. ?person dbpprop:pnd ?identifier} LIMIT 10');
$rawResultDNB = array(array(2));
$i=0;
foreach ($result as $row){
	$rawResultDNB[$i][0]=$row->person;
	$rawResultDNB[$i][1]=$row->identifier;
	$i++;
}
for($i=0;$i<sizeof($rawResultDNB);$i++) {
	echo $rawResultDNB[$i][0];
	echo "    ";
	echo $rawResultDNB[$i][1];
	echo "\n";
}
 
/*
 * Step 3
 * Store a sameAs Triple in a Textfile
 */
 
/*
 * Step 4 (optional)
 * Load the Textfile into the Store
 */
 



?>
