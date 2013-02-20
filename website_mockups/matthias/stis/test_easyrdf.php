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
#    require_once "html_tag_helpers.php";

    // Setup some additional prefixes for DBpedia
    EasyRdf_Namespace::set('stis','http://localhost/default#');
    EasyRdf_Namespace::set('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    EasyRdf_Namespace::set('gnd','http://d-nb.info/standards/elementset/gnd#');

    $sparql = new EasyRdf_Sparql_Client('http://data.uni-muenster.de/bt/sparql');
    $result = $sparql->query(
      'SELECT * WHERE {'.
      '  ?deathEntity ?btLiteralIndex "Dortmund" .'.
      '} LIMIT 75'
    );
    foreach ($result as $row) {
        #echo "<li>".link_to($row->label, $row->country)."</li>\n";
	echo $row->deathEntity;
    }
?>
