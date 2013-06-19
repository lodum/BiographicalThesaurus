BIOGRAPHICAL THESAURUS NRW
Created by Jakob Moellers

Folder Structure
----------------

data/
	unprocessed-nwbib.zip
		Title data from NWBib.
	processed-gnd.tar.gz
		Converted persons ready for insertion.

Concept Group/
	Lobid Extractor for downloading and inserting person data.
		extractorScript.sh
			Shell script that 
				1. reads the title-data
				2. downloads persons from GND
				3. uploads persons to triplestore
website/
	Important files:
		query.js: Includes all functionality to query triple store and handle response
		build*Index.php: Build lucene index for full text search (this is not completed yet)
		get*FromIndex.php: Returns IDs from the lucene index (this is also not included)
		search_autocomplete: Code for the autocomplete-functions
		*.json: Dumps of index
		index_* folders: Folders that contain the generated lucene index

Obsolete:

	Concept Maps/
		Old folder with obsolete concept maps.

	examples/
		Some examples how to connect php to a triple store.



New Concept Mapf for stis:Person concept
----------------------------------------
This has to be added with the Sesame Workbench Add function to create gnd:Person and stis:Person.

@prefix stis:    <http://localhost/default#>.
@prefix gnd:     <http://d-nb.info/standards/elementset/gnd#>.
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.

gnd:DifferentiatedPerson
      rdfs:subClassOf gnd:Person .

gnd:UndifferentiatedPerson
      rdfs:subClassOf gnd:Person .

gnd:Person
      rdf:type owl:Class ;
      rdfs:subClassOf stis:Person .

stis:Person
      rdf:type owl:Class .



Ideas and future goals for the biographical thesaurus [to be extended!]
-----------------------------------------------------

-derive events from the data
-what influenced a person/writing process (which historic events etc.)?
-link historic maps to the person and the time and the place this person lived... cool idea :-)
-can you outsource the process of linking resources to the user? maybe the user could use a tool to annotate the resources... like the Wikipedia concept
-generate hypothesis from the data ("We assume that there was a person X in Münster at time YYYY") and present this to the user... maybe this is interesting for research/scientists of the domain (but: how to represent a hypothesis in RDF, what is a fact etc.)
