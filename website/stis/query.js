/*
 * 
 * This file contains all the javascript functions to query the triplestore
 * and return the results.
 * 
 */

/*
 * General items
 */

var searchResults;
var currentPage;
var map;
var point1lat;
var point1lon;
var point2lat;
var point2lon;

//A missing console causes errors in Internet Explorer, this line of code fixes the issue:
if (!window.console) console = {log: function() {}}; 
 
function gotoPage(number){
	currentPage=number;
	displayResults();
}

function replaceURLWithHTMLLinks(text) {
	// var exp = /(\b(https?|ftp|file):\/\/\b(lobid.org)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	// text = text.replace(exp, "<a href='http://giv-stis-2012.uni-muenster.de:8080/openrdf-workbench/repositories/stis/explore?resource=%3C$1%3E' target=\"_blank\">$1</a>");
	// if (text.indexOf("<a href") == 0){
		// return text;
	// }else{
		var exp = /(\b(https?|ftp|file):\/\/\b[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		text = text.replace(exp, "<a href='$1' target=\"_blank\">$1</a>");
	// }
	return text;
}

function getParam(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

/*
 * Query functions
 */
 
//Fucntion that submits the query in the "text"-parameter to the endpoint.
function submitCustomQuery(text){
		var endpoint="http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
		//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
		var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
		var request = { accept : 'application/sparql-results+json' };
		//get sparql query from textarea
		request.query=text;
		console.log('Start Ajax');
		//sent request
		$.ajax({
			dataType: "jsonp",
			//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
			beforeSend: function(xhrObj){xhrObj.setRequestHeader("Accept","application/sparql-results+json");},
			data: request,
			url: queryUrl,
			success: callbackFuncResults,
			error: function (request, status, error) {
		        //alert(request.responseText);
					$('#loadingDiv').hide();
					$('#result_error').slideDown().delay(3000).slideUp();
					$("#error").html(request.responseText);
		    }
		});
	};
 
/*
 * Callback functions
 */
 
//handles the ajax response
function callbackFuncResults(results) {
	console.log('start callback');	
	$('#loadingDiv').hide();
	$('#result_success').slideDown().delay(3000).slideUp();
	searchresults=results;
	gotoPage(1);
};

//Adds marker of place to map
function cb_place(json) {
		try{
		var marker = L.marker([json[0].lat, json[0].lon]).addTo(map);
		point1lat=json[0].lat;
		point1lon=json[0].lon;
		//marker.bindPopup("Birth place").openPopup();
		}catch(e){console.log('Place cannot be displayed');}	
};

//Adds marker of birth place to map
function cb1(json) {
		try{
			var marker = L.marker([json[0].lat, json[0].lon]).addTo(map);
			point1lat=json[0].lat;
			point1lon=json[0].lon;
			marker.bindPopup("Birth place").openPopup();
			
			//TODO: does cb2 zoom to the extent? if yes, include this function in cb1!!!
			
		}catch(e){console.log('Birth place cannot be displayed')}
			
};

//Adds marker of death place to map
function cb2(json) {
		try{
		var marker = L.marker([json[0].lat, json[0].lon]).addTo(map);
		point2lat=json[0].lat;
		point2lon=json[0].lon;
		marker.bindPopup("Death place").openPopup();
		
		console.log(point1lat);
		console.log(point1lon);
		var point1=new L.LatLng(point1lat,point1lon);
		var point2=new L.LatLng(point2lat,point2lon);
		var bounds=new L.LatLngBounds(point1,point2);
		map.fitBounds(bounds);
		
		}catch(e){
			console.log('Death place cannot be displayed');
		}
};

//Displays the results of a query in an html table. In addition, this function does the geocoding for the locations
function displayResults() {
    if(searchresults==undefined)
       return;
    var results = searchresults;
	var respp = document.getElementById("resultsPerPage");	
	var resppValue = parseInt(respp.options[respp.selectedIndex].text);
	var minIndex = (currentPage-1)*resppValue;
	var pagesHtml = results.results.bindings.length+"<br\>";
	var numberOfPages = Math.ceil(results.results.bindings.length / resppValue);
	
	var i = 1;
	var j= numberOfPages;
	if(numberOfPages > 20){
		i = Math.max(1,currentPage-9);
		j = Math.min(i+19,numberOfPages)
		if(i > 1){
			pagesHtml +="... ";
		}
	}
		
	for (; i <= j; i++) {
		
	  if(i==currentPage){
	  	pagesHtml += "<b><a href=\"javascript:gotoPage("+i+")\"> "+i+"</a></b>";
	  }else
	  	pagesHtml += "<a href=\"javascript:gotoPage("+i+")\"> "+i+"</a>";
	};
	
	if(j < numberOfPages)
		pagesHtml +=" ...";
	     
	$("#pages").html(pagesHtml);
	$("#pagesContainer").show();
	
	$("#resultdiv").empty();
	//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	htmlString = "<table class=\"table table-striped table-condensed\">";
	//write table head
	htmlString += "<tr>";
	$.each(results.head.vars, function(index2, value2) {

		htmlString += "<th>" + value2 + "</th>";
	});
	htmlString += "</tr>";

	//write table body
	for (var i = minIndex, j = Math.min(resppValue*currentPage, results.results.bindings.length); i < j; i++) {
		htmlString += "<tr>";
		for (var k = 0, l = results.head.vars.length; k < l; k++) {
			var valueObject = results.results.bindings[i];
			valueObject = valueObject[results.head.vars[k]];
			if (valueObject != undefined) {
				htmlString += "<td>" + replaceURLWithHTMLLinks(valueObject.value) + "</td>";
			} else {
				htmlString += "<td></td>";
			}

		};
		htmlString += "</tr>";
	}

	htmlString += "</table>";
	console.log(htmlString);
	$("#resultdiv").html(htmlString);
	
	//Geocoding
	 
	try{
		var td = htmlString.split("</td>");
		console.log(td);
		if (htmlString.search('birthPlace')!=-1){
			console.log('Birthplace found');
			var l=td.length;
			
			birth=td[l-6];
			var birthPlace = birth.split(">");
			console.log('Birth place '+birthPlace[1]);
			
			//get coordinates for birthplace
			
			var s = document.createElement('script');
			s.src = 'http://nominatim.openstreetmap.org/search?q='+birthPlace[1]+'&format=json&json_callback=cb1';
			document.getElementsByTagName('head')[0].appendChild(s);
			
			death=td[l-5];
			var deathPlace = death.split(">");
			console.log('Death place '+deathPlace[1]);
			
			//get coordinates for deathplace
			
			var s = document.createElement('script');
			s.src = 'http://nominatim.openstreetmap.org/search?q='+deathPlace[1]+'&format=json&json_callback=cb2';
			document.getElementsByTagName('head')[0].appendChild(s);
			
		}
	} catch(e) {
		console.log('no places found');
	}
	
};
 
/*
 * Tag cloud functions
 */
 
//submits the query for the tag cloud
function submitTagCloudQuery() {
	
	//TODO: Does not work because there are no stis:Publication anymore
	
	var endpoint = "http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	request.query = "prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select  distinct ?personUri ?name ?count where{ ?personUri gnd:preferredNameForThePerson ?name{ select ?personUri (count(?personUri) as ?count)  where{{  ?a a stis:Publication; <http://purl.org/dc/elements/1.1/creator> ?personUri. }} GROUP BY ?personUri ORDER BY DESC(?count) limit 10} } ORDER BY DESC(?count) limit 10";
	console.log('Start Ajax');
	//sent request
	$.ajax({
		dataType : "jsonp",
		//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
		beforeSend : function(xhrObj) {
			xhrObj.setRequestHeader("Accept", "application/sparql-results+json");
		},
		data : request,
		url : queryUrl,
		success : callbackTag,
		error : function(request, status, error) {
			//alert(request.responseText);
			$("#error").html(request.responseText);
		}
	});
};

//handles the ajax response of the tag-cloud query
function callbackTag(results) {
	console.log('start tag-callback');
	$("#resultdiv").empty();
	//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	htmlString = "";
	//write table body
	$.each(results.results.bindings, function(index1, value1) {
		htmlString += "<li>";
		//console.log(index1);
		//console.log(value1);
		$.each(results.head.vars, function(index2, value2) {
			
			if (value1[value2] != undefined) {
				//console.log(index2);
				if (index2==0)
					htmlString += '<a href\=\"'+value1[value2].value+'\">';
				if (index2==1)
					htmlString += value1[value2].value;
				//htmlString += "<a href\=\"\#\">" + replaceURLWithHTMLLinks(value1[value2].value) + "</a>";
			}/*else{
			 htmlString+="<td></td>";
			 }*/
		});
		htmlString += "</li>";
	});

	//htmlString+="</ul>";
	console.log('String= ' + htmlString);
	$("#resultdiv").html(htmlString);
	reloadCloud();
}

function reloadCloud() {
	console.log('reloadCloud');
	// set colour of text and outline of active tag
	TagCanvas.textColour = '#000000';
	TagCanvas.outlineColour = '#ff9999';
	TagCanvas.dragControl = true;
	
	TagCanvas.Start('myCanvas');
	try {
		TagCanvas.Start('myCanvas');
	} catch(e) {
		// something went wrong, hide the canvas container
		document.getElementById('myCanvasContainer').style.display = 'none';
	}
  }
 
/*
 * Sparql endpoint functions
 */
 
//This function selects and executes a query depending on the user input
function startQuery(map2){
	
	//Loading div
	$('#loadingDiv').show();
	map=map2;
	var searchstring = getParam('searchstring');
	console.log('searchstring='+searchstring);
	var person = getParam('person');
	console.log('person='+person);
	var place = getParam('place');
	console.log('place='+place);
	var beginDate = getParam('beginDate');
	console.log('beginDate='+beginDate);
	var endDate = getParam('endDate');
	console.log('endDate='+endDate);
	var lat = getParam('lat');
	console.log('lat='+lat);
	var lon = getParam('lon');
	console.log('lon='+lon);
	var occ = getParam('occ');
	console.log('occ='+occ);
	
	if ((searchstring!="")&&(person=="")&&(place=="")&&(occ=="")){
		console.log(searchstring);
		searchstring=decodeURI(searchstring);
		console.log(searchstring);
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
	
	} else if ((searchstring=="")&&(person!="")&&(place=="")&&(occ=="")){
		console.log(person);
		person=decodeURI(person);
		console.log(person);
		person = getPersonURI(person);
	
	} else if ((searchstring=="")&&(person=="")&&(place!="")&&(occ=="")){
		console.log(place);
		place=decodeURI(place);
		console.log(place);
		if(lat!="" && lon!=""){ 
			var marker = L.marker([lat, lon]).addTo(map);
		}else{
		    var s = document.createElement('script');
			s.src = 'http://nominatim.openstreetmap.org/search?q='+place+'&format=json&json_callback=cb_place';
			document.getElementsByTagName('head')[0].appendChild(s);
		}
		
		//TODO: Only one place is shown
		
		place = getPlaceURI(place);
	
	} else if (((beginDate!="")&&(endDate!=""))&&(searchstring=="")&&(person=="")&&(place=="")&&(occ=="")){
		console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate. ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?c. ?c dbpedia-owl:birthDate ?birthDatedb. ?c dbpedia-owl:deathDate ?deathDatedb. } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate > '+beginDate+' && ?deathDateDate < '+endDate+') BIND (COALESCE(?birthDatedb, ?birthDate) AS ?birthDate) BIND (COALESCE(?deathDatedb, ?deathDate) AS ?deathDate) BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .} LIMIT 10');
		submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate. ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?c. ?c dbpedia-owl:birthDate ?birthDatedb. ?c dbpedia-owl:deathDate ?deathDatedb. } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate > '+beginDate+' && ?deathDateDate < '+endDate+') BIND (COALESCE(?birthDatedb, ?birthDate) AS ?birthDate) BIND (COALESCE(?deathDatedb, ?deathDate) AS ?deathDate) BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .} LIMIT 10');
	
	} else if ((searchstring=="")&&(person=="")&&(place=="")&&(occ!="")){
		console.log(occ);
		occ=decodeURI(occ);
		console.log(occ);
		occupation = getOccupationURI(occ);
	
	} else if ((searchstring=="")&&(person=="")&&(place!="")&&(occ!="")){
		console.log(occ);
		occ=decodeURI(occ);
		console.log(occ);
		console.log(place);
		place=decodeURI(place);
		console.log(place);
		getOccupationAndPlaceURI(occ,place);
		
		//TODO: Only one place is shown, not the other one
		
	} else {
		
		//TODO if the query fails, give an output to the user. right now, one does not see whether the system is working or if the query failed/returned no results
			console.log('No parameters');
	}
	
}

//This function sends the SPARQL query from the endpoint site to the endpoint
function submitQuery() {
var endpoint ="http://data.uni-muenster.de/bt/sparql"
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	request.query = $("#sparqlQuery").val();
	$('#loadingDiv').show();
	//sent request
	$.ajax({
		dataType : "jsonp",
		//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
		beforeSend : function(xhrObj) {
			xhrObj.setRequestHeader("Accept", "application/sparql-results+json");
		},
		data : request,
		url : queryUrl,
		success : callbackFuncResults,
		error : function(request, status, error) {
			$('#result_error').slideDown().delay(3000).slideUp();
			$('#loadingDiv').hide();
			//alert(request.responseText + error);
			$("#error").html(request.responseText + error);
		}
	});
};

//This function executes the query if the user entered a PLACE
function getPlaceURI(placename){
	$.ajax({
				type   :"GET",
				url    :'getNameFromIndex.php?name='+placename, 
				success: function(msg){
					var returnobject = JSON.parse(msg);
					console.log(returnobject);
                    
                    try{
                    	var place = returnobject.places[0].uri;
	                    console.log(place);
	                    
	                    //TODO remove the limit of 10 here by something more useful.

	                    //todo queries that run more than 30 seconds are returned unsuccessfully by the system... this has to be changed.

	                    console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dbpedia-owl:	<http://dbpedia.org/ontology/> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfBirth <'+place+'>	. <'+place+'> gnd:preferredName ?birthPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfDeath <'+place+'>	. <'+place+'> gnd:preferredName ?deathPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }} LIMIT 10');
	                    submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dbpedia-owl:	<http://dbpedia.org/ontology/> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfBirth <'+place+'>	. <'+place+'> gnd:preferredName ?birthPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfDeath <'+place+'>	. <'+place+'> gnd:preferredName ?deathPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }} LIMIT 10');
                    } catch(err) {
                    	console.log("No location specified.");
                    }
				}
			});
	}

//This function is executed if the user entered the name of a PERSON	
function getPersonURI(person){
	$.ajax({
				type   :"GET",
				url    :'getPersonFromIndex.php?name='+person, 
				success: function(msg){
					var returnobject = JSON.parse(msg);
					console.log(returnobject);
                    
                    try{
						
						// todo: do not only use one (the first) match but all matches...
						
                    	var person = returnobject.persons[0].uri;
	                    console.log(person);
	                    
	                    //TODO remove the limit of 10 here by something more useful.

	                    //todo queries that run more than 30 seconds are returned unsuccessfully by the system... this has to be changed.
	                    console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (<'+person+'> as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {<'+person+'> a stis:Person. <'+person+'> gnd:preferredNameForThePerson ?name . OPTIONAL {<'+person+'>  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. }OPTIONAL {<'+person+'> gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {<'+person+'> gnd:dateOfBirth ?birthDate. } OPTIONAL {<'+person+'> gnd:dateOfDeath ?deathDate. } OPTIONAL {<'+person+'> gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .}');
	                    submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (<'+person+'> as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {<'+person+'> a stis:Person. <'+person+'> gnd:preferredNameForThePerson ?name . OPTIONAL {<'+person+'>  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. }OPTIONAL {<'+person+'> gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {<'+person+'> gnd:dateOfBirth ?birthDate. } OPTIONAL {<'+person+'> gnd:dateOfDeath ?deathDate. } OPTIONAL {<'+person+'> gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {<'+person+'> owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .}');
	                    
                    } catch(err) {
                    	console.log("No person specified.");
                    }
				}
			});
}

//This function is executed if the user entered an OCCUPATION	
function getOccupationURI(occupation){
	$.ajax({
				type   :"GET",
				url    :'getOccupationFromIndex.php?name='+occupation, 
				success: function(msg){
					var returnobject = JSON.parse(msg);
					console.log(returnobject);
                    
                    try{
						
						// todo: do not only use one (the first) match but all matches...
						
                    	var occupation = returnobject.occupations[0].uri;
	                    console.log(occupation);
	                    
	                    console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . ?a gnd:professionOrOccupation <'+occupation+'>. <'+occupation+'> gnd:preferredNameForTheSubjectHeading ?occupationName . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace.  ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB .?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB .?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) .BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .} LIMIT 10');
	                    submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . ?a gnd:professionOrOccupation <'+occupation+'>. <'+occupation+'> gnd:preferredNameForTheSubjectHeading ?occupationName . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace.  ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB .?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB .?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) .BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .} LIMIT 10');
	                    
	                    
	                    
                    } catch(err) {
                    	console.log("No occupation specified.");
                    }
				}
			});
}

//This function is executed if the user entered a PLACE AND an OCCUPATION
function getOccupationAndPlaceURI(occupation,placename){
	$.ajax({
				type   :"GET",
				url    :'getOccupationFromIndex.php?name='+occupation, 
				success: function(msg){
					var returnobject = JSON.parse(msg);
					console.log(returnobject);
                    
                    try{
						
						// todo: do not only use one (the first) match but all matches...
						
                    	var occupation = returnobject.occupations[0].uri;
	                    console.log(occupation);
	                    
	                    
	                    $.ajax({
							type   :"GET",
							url    :'getNameFromIndex.php?name='+placename, 
							success: function(msg){
								var returnobject = JSON.parse(msg);
								console.log(returnobject);
								
								try{
									var placename = returnobject.places[0].uri;
									console.log(placename);
									
									//TODO remove the limit of 10 here by something more useful.

									//todo queries that run more than 30 seconds are returned unsuccessfully by the system... this has to be changed.
									
									console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name .?a  gnd:placeOfBirth <'+placename+'>	.<'+placename+'> gnd:preferredName ?birthPlace.OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a  gnd:placeOfDeath ?placeOfDeath	. ?placeOfDeath gnd:preferredName ?deathPlace.}OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . }OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . } UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name .?a  gnd:placeOfDeath <'+placename+'>	. <'+placename+'> gnd:preferredName ?deathPlace.OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a  gnd:placeOfBirth ?placeOfBirth	. ?placeOfBirth gnd:preferredName ?birthPlace.}  OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . }OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . } ?a gnd:professionOrOccupation <'+occupation+'>. <'+occupation+'> gnd:preferredNameForTheSubjectHeading ?occupationName . } LIMIT 2');
									submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name .?a  gnd:placeOfBirth <'+placename+'>	.<'+placename+'> gnd:preferredName ?birthPlace.OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a  gnd:placeOfDeath ?placeOfDeath	. ?placeOfDeath gnd:preferredName ?deathPlace.}OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . }OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . } UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name .?a  gnd:placeOfDeath <'+placename+'>	. <'+placename+'> gnd:preferredName ?deathPlace.OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a  gnd:placeOfBirth ?placeOfBirth	. ?placeOfBirth gnd:preferredName ?birthPlace.}  OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . }OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . } ?a gnd:professionOrOccupation <'+occupation+'>. <'+occupation+'> gnd:preferredNameForTheSubjectHeading ?occupationName . } LIMIT 2');

								} catch(err) {
									console.log("No location specified.");
								}
							}
						});
	                    
	                    
                    } catch(err) {
                    	console.log("No occupation specified.");
                    }
				}
			});
}
