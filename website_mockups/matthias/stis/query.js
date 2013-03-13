var searchResults;
var currentPage;
var map;

  //A missing console causes errors in Internet Explorer, this line of code fixes the issue:
 if (!window.console) console = {log: function() {}}; 
 
function gotoPage(number){
	currentPage=number;
	displayResults();
}

function submitQuery() {
//	var endpoint = "http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
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

/*function buildQuery(person){
	//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a gnd:DifferentiatedPerson.}');
	//var person = ($("#person").val());
	

	switch (person) {
		case '':
			//console.log('1 Person = ' + person);
			person = 'gnd:DifferentiatedPerson';
			console.log('1 Person = ' + person);
			submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a ' + person + '.}');
			break;

		case 'gnd:DifferentiatedPerson':
			console.log('2 Person = ' + person);
			submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a ' + person + '.}');
			break;

		default:
			console.log('I do not know this query yet.');
	}

	//Just for testing:
	/*if (person==''){
	 	person='gnd:DifferentiatedPerson';
	 }
	 console.log('Person = ' + person);

	 submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a '+person+'.}');
	 
}*/


function submitCustomQuery(text){
		var endpoint="http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
		// var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
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
	
/*function submitCustomQueryStartPage(text){
		var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
		// var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
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
					$("#error").html(request.responseText);
		    }
		});
	};*/
	


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


// //handles the ajax response
// function callbackFunc(results) {
	// console.log('start callback');
	// $('#loadingDiv').hide();
	// $('#result_success').slideDown().delay(3000).slideUp();
// 	
	// $("#resultdiv").empty();
	// //result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	// htmlString = "<table class=\"table table-striped table-condensed\">";
	// //write table head
	// htmlString += "<tr>";
	// $.each(results.head.vars, function(index2, value2) {
		// htmlString += "<th>?" + value2 + "</th>";
	// });
	// htmlString += "</tr>";
	// //write table body
	// $.each(results.results.bindings, function(index1, value1) {
		// htmlString += "<tr>";
		// $.each(results.head.vars, function(index2, value2) {
			// if (value1[value2] != undefined) {
				// htmlString += "<td>" + replaceURLWithHTMLLinks(value1[value2].value) + "</td>";
			// } else {
				// htmlString += "<td></td>";
			// }
		// });
		// htmlString += "</tr>";
	// });
// 
	// htmlString += "</table>";
	// $("#resultdiv").html(htmlString);
// }


//handles the ajax response
function callbackFuncResults(results) {
	console.log('start callback');	
	$('#loadingDiv').hide();
	$('#result_success').slideDown().delay(3000).slideUp();
	searchresults=results;
	gotoPage(1);
};
	

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

	// $.each(results.results.bindings, function(index1, value1) {
	// htmlString += "<tr>";
	// $.each(results.head.vars, function(index2, value2) {
	// if (value1[value2] != undefined) {
	// htmlString += "<td>" + replaceURLWithHTMLLinks(value1[value2].value) + "</td>";
	// } else {
	// htmlString += "<td></td>";
	// }
	// });
	// htmlString += "</tr>";
	// });

	htmlString += "</table>";
	console.log(htmlString);
	$("#resultdiv").html(htmlString);
	
	//EXPERIMENTAL: COMMENT THIS OUT IF NOT WORKING CORRECTLY!!!
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
	
	//END EXPERIMENTAL
};

var point1lat;
var point1lon;
var point2lat;
var point2lon;


function cb_place(json) {
		try{
		var marker = L.marker([json[0].lat, json[0].lon]).addTo(map);
		point1lat=json[0].lat;
		point1lon=json[0].lon;
		//marker.bindPopup("Birth place").openPopup();
		}catch(e){console.log('Place cannot be displayed');}	
};


function cb1(json) {
		try{
			var marker = L.marker([json[0].lat, json[0].lon]).addTo(map);
			point1lat=json[0].lat;
			point1lon=json[0].lon;
			marker.bindPopup("Birth place").openPopup();
		}catch(e){console.log('Birth place cannot be displayed')}
			
};

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
		
		/*map.fitBounds([
			[point1lat,point1lon],
			[point2lat,point2lon]
		]);
		*/
		
		/*var meanlat=((point1lat*1)+(point2lat*1))/2;
		var meanlon=((point1lon*1)+(point2lon*1))/2;
		
		console.log(meanlat + " " + meanlon);
		
		map.setView([meanlat,meanlon],8);*/
		}catch(e){
			console.log('Death place cannot be displayed');
		}
};


function submitTagCloudQuery() {
	var endpoint = "http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt";
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	//request.query = "prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a where{ ?c  gnd:surname ?a.} LIMIT 35";
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

//handles the ajax response
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
	
function startQuery(map2){
	//Loading div
	$('#loadingDiv').show();

	
	map=map2;
	var searchstring = getParam('searchstring');
	console.log('searchstring='+searchstring);
	var person = getParam('person');
	console.log('person='+person);
	//var publication = getParam('publication');
	//console.log('publication='+publication);
	//var publication = "";
	var place = getParam('place');
	console.log('place='+place);
	var beginDate = getParam('beginDate');
	console.log('beginDate='+beginDate);
	var endDate = getParam('endDate');
	console.log('endDate='+endDate);
	//var author = getParam('author');
	//var author = "";
	//console.log('author='+author);
	//var subject = getParam('subject');
	//var subject = "";
	//console.log('subject='+subject);
	var lat = getParam('lat');
	console.log('lat='+lat);
	var lon = getParam('lon');
	console.log('lon='+lon);
	var occ = getParam('occ');
	console.log('occ='+occ);
	
	//((searchstring=="")&&(person=="")&&(place=="")&&(occ==""))
	
	if ((searchstring!="")&&(person=="")&&(place=="")&&(occ=="")){
		console.log(searchstring);
		//searchstring=searchstring.replace(/%20/g," ");
		searchstring=decodeURI(searchstring);
		console.log(searchstring);
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
	} else if ((searchstring=="")&&(person!="")&&(place=="")&&(occ=="")){
		console.log(person);
		person=decodeURI(person);
		//person=person.replace(/%20/g," ");
		console.log(person);
		//buildQuery(person);
		/*
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person; gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i").?a gnd:placeOfBirth ?birthEntity.?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person; gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i").?a gnd:placeOfBirth ?birthEntity.?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.}');
		
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person; gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}');
		 
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person; gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}'); 
		
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#>  select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#>  select distinct ?a ?name ?birthPlace ?deathPlace where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}');
		
		console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}');
		submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i"). OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace. }}');
		*/
		//console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i").  OPTIONAL  {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.}  OPTIONAL  { ?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . }}');
		//submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i").  OPTIONAL  {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.}  OPTIONAL  { ?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . }}');
		console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?name, \"'+person+'\", "i").}');
		submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?name, \"'+person+'\", "i").}');
	/*} else if ((searchstring=="")&&(person=="")&&(publication!="")&&(place=="")&&(author=="")&&(subject=="")){
		console.log(publication);
		//publication=publication.replace(/%20/g," ");
		publication=decodeURI(publication);
		console.log(publication);
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b; } union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b; } union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');	
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?a as ?publicationUri) (?b as ?name) where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b;} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?a as ?publicationUri) (?b as ?name) where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b;} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');*/
	} else if ((searchstring=="")&&(person=="")&&(place!="")&&(occ=="")){
		console.log(place);
		place=decodeURI(place);
		//place=place.replace(/%20/g," ");
		console.log(place);
		if(lat!="" && lon!=""){ 
			var marker = L.marker([lat, lon]).addTo(map);
		}else{
		    var s = document.createElement('script');
			s.src = 'http://nominatim.openstreetmap.org/search?q='+place+'&format=json&json_callback=cb_place';
			//console.log(document);
			document.getElementsByTagName('head')[0].appendChild(s);
		}
		
		place = getPlaceURI(place);
		//console.log(place);
		
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?locationName where{{	?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName .}union{	?a gnd:placeOfBirth ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDeath ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfBusiness ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:associatedPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:characteristicPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfConferenceOrEvent ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:otherPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:place ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfManufacture ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfExile ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDiscovery ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfCustody ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfActivity ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.} FILTER regex(?locationName, \"'+place+'\",\"i\")}');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?locationName where{{	?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName .}union{	?a gnd:placeOfBirth ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDeath ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfBusiness ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:associatedPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:characteristicPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfConferenceOrEvent ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:otherPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:place ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfManufacture ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfExile ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDiscovery ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfCustody ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfActivity ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.} FILTER regex(?locationName, \"'+place+'\",\"i\")}');
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?a as ?locationUri) ?locationName where{{	?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName .}union{	?a gnd:placeOfBirth ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDeath ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfBusiness ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:associatedPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:characteristicPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfConferenceOrEvent ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:otherPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:place ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfManufacture ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfExile ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDiscovery ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfCustody ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfActivity ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.} FILTER regex(?locationName, \"'+place+'\",\"i\")}');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?a as ?locationUri) ?locationName where{{	?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName .}union{	?a gnd:placeOfBirth ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDeath ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfBusiness ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:associatedPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:characteristicPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfConferenceOrEvent ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:otherPlace ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:place ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfManufacture ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfExile ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfDiscovery ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfCustody ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.}union{	?a gnd:placeOfActivity ?location.        ?location gnd:preferredNameForThePlaceOrGeographicName ?locationName.} FILTER regex(?locationName, \"'+place+'\",\"i\")}');
		//console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL { ?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?birthPlace, \"'+place+'\", "i").}union{?a a stis:Person.?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL  {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?deathPlace, \"'+place+'\", "i").}}');
		//submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL { ?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?birthPlace, \"'+place+'\", "i").}union{?a a stis:Person.?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL  {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?deathPlace, \"'+place+'\", "i").}}');
		//console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?birthPlace, \"'+place+'\", "i") .} UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL { ?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?deathPlace, \"'+place+'\", "i") .}}	');
		//submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?birthPlace, \"'+place+'\", "i") .} UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL { ?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?deathPlace, \"'+place+'\", "i") .}}	');
	} else if (((beginDate!="")&&(endDate!=""))&&(searchstring=="")&&(person=="")&&(place=="")&&(occ=="")){
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dcterms:<http://purl.org/dc/terms/> select ?a ?name ?date where{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?name; dcterms:date ?b. BIND (xsd:decimal(?b) as ?date) Filter (?date <= '+endDate+' && ?date >= '+beginDate+')} ');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dcterms:<http://purl.org/dc/terms/> select ?a ?name ?date where{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?name; dcterms:date ?b. BIND (xsd:decimal(?b) as ?date) Filter (?date <= '+endDate+' && ?date >= '+beginDate+')} ');
		//console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate >= '+beginDate+' && ?deathDateDate <= '+endDate+')}');
		//submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate >= '+beginDate+' && ?deathDateDate <= '+endDate+')}');
		console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate. ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?c. ?c dbpedia-owl:birthDate ?birthDatedb. ?c dbpedia-owl:deathDate ?deathDatedb. } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate > '+beginDate+' && ?deathDateDate < '+endDate+') BIND (COALESCE(?birthDatedb, ?birthDate) AS ?birthDate) BIND (COALESCE(?deathDatedb, ?deathDate) AS ?deathDate) BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .}');
		submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate. ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a owl:sameAs ?c. ?c dbpedia-owl:birthDate ?birthDatedb. ?c dbpedia-owl:deathDate ?deathDatedb. } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } BIND (xsd:decimal(?birthDate) as ?birthDateDate). BIND (xsd:decimal(?deathDate) as ?deathDateDate). Filter (?birthDateDate > '+beginDate+' && ?deathDateDate < '+endDate+') BIND (COALESCE(?birthDatedb, ?birthDate) AS ?birthDate) BIND (COALESCE(?deathDatedb, ?deathDate) AS ?deathDate) BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .}');
	/*} else if ((searchstring=="")&&(person=="")&&(publication=="")&&(place=="")&&(author!="")&&(subject=="")){
		console.log(author);
		author=decodeURI(author);
		//author=author.replace(/%20/g," ");
		console.log(author);
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?title ?name where{{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?title} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?title.}{{?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://xmlns.com/foaf/0.1/name> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .} FILTER regex(?name, \"'+author+'\",\"i\")}}');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?title ?name where{{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?title} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?title.}{{?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://xmlns.com/foaf/0.1/name> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .} FILTER regex(?name, \"'+author+'\",\"i\")}}');
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?a as ?publicationUri) ?title ?name where{{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?title} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?title.}{{?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://xmlns.com/foaf/0.1/name> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .} FILTER regex(?name, \"'+author+'\","i")}}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct (?a as ?publicationUri) ?title ?name where{{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?title} union { ?a a stis:Publication; gnd:preferredNameForTheWork ?title.}{{?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://xmlns.com/foaf/0.1/name> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:variantNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredName ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p gnd:preferredNameForThePerson ?name .} union {	?a a stis:Publication .        ?a <http://purl.org/dc/elements/1.1/creator> ?p .        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .} FILTER regex(?name, \"'+author+'\","i")}}');*/
	/*} else if ((searchstring=="")&&(person=="")&&(publication=="")&&(place=="")&&(author=="")&&(subject!="")){
		console.log(subject);
		//subject=subject.replace(/%20/g," ");
		subject=decodeURI(subject);
		console.log(subject);
		//console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?subjectURI ?subjectName where{ ?a a stis:Publication . ?a <http://purl.org/dc/terms/subject> ?subjectURI. ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \"'+subject+'\", \"i\").}');
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?subjectURI ?subjectName where{ ?a a stis:Publication . ?a <http://purl.org/dc/terms/subject> ?subjectURI. ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \"'+subject+'\", \"i\").}');
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?publicationUri ?subjectURI ?subjectName where{ ?publicationUri a stis:Publication . ?publicationUri <http://purl.org/dc/terms/subject> ?subjectURI. ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \"'+subject+'\", "i").}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?publicationUri ?subjectURI ?subjectName where{ ?publicationUri a stis:Publication . ?publicationUri <http://purl.org/dc/terms/subject> ?subjectURI. ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \"'+subject+'\", "i").}');*/
	/*} else if ((searchstring=="")&&(person!="")&&(publication=="")&&(place!="")&&(author=="")&&(subject!="")){
		console.log(person);
		person=decodeURI(person);
		console.log(person);
		place=decodeURI(place);
		subject=decodeURI(subject);
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{ ?a ?b ?c . FILTER (?c  IN(\"'+person+'\", \"'+place+'\", \"'+subject+'\")) }');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{ ?a ?b ?c . FILTER (?c  IN(\"'+person+'\", \"'+place+'\", \"'+subject+'\")) }');*/
	} else if ((searchstring=="")&&(person=="")&&(place=="")&&(occ!="")){
		console.log(occ);
		place=decodeURI(occ);
		console.log(occ);
		//console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		//submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace.  ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . }OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB .?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB .?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) .BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where { ?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace.  ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate. } OPTIONAL {?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity. ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . }OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB .?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource .?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB .?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) .BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) .FILTER regex(?occupationName, \"'+occ+'\", "i").}');
	} else if ((searchstring=="")&&(person=="")&&(place!="")&&(occ!="")){
		console.log(occ);
		occ=decodeURI(occ);
		console.log(occ);
		console.log(place);
		place=decodeURI(place);
		console.log(place);
		//console.log('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL { ?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?birthPlace, \"'+place+'\", "i").}union{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?deathPlace, \"'+place+'\", "i").} FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		//submitCustomQuery('prefix stis:	<http://localhost/default#> prefix rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd: 	<http://d-nb.info/standards/elementset/gnd#>  select distinct (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName where {{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL { ?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?birthPlace, \"'+place+'\", "i").}union{?a a stis:Person. ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a gnd:placeOfBirth ?birthEntity. ?birthEntity gnd:preferredName ?birthPlace. ?a gnd:placeOfDeath ?deathEntity. ?deathEntity gnd:preferredName ?deathPlace.} OPTIONAL {?a gnd:dateOfBirth ?birthDate.  ?a gnd:dateOfDeath ?deathDate. } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity.  ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } FILTER regex(?deathPlace, \"'+place+'\", "i").} FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		console.log('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?birthPlace, \"'+place+'\", "i") .} UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?deathPlace, \"'+place+'\", "i") .} FILTER regex(?occupationName, \"'+occ+'\", "i").}');
		submitCustomQuery('PREFIX dcterms:<http://purl.org/dc/terms/> PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> PREFIX dbpprop-de:<http://de.dbpedia.org/property/> PREFIX dbp:<http://dbpedia.org/data3/.rdf#> PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dnb:<http://d-nb.info/> PREFIX gnd:<http://d-nb.info/standards/elementset/gnd#> PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> PREFIX stis:<http://localhost/default#> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?birthPlace, \"'+place+'\", "i") .} UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . OPTIONAL {?a  gnd:placeOfBirth ?birthEntity . ?birthEntity gnd:preferredName  ?birthPlace . ?a gnd:placeOfDeath ?deathEntity . ?deathEntity  gnd:preferredName ?deathPlace . } OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthPlace ?birthPlaceDB . ?birthPlaceDB rdfs:label ?bpDB .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathPlace ?deathPlaceDB . ?deathPlaceDB rdfs:label ?dpDB .} BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . BIND( COALESCE(?bpDB, ?birthPlace) AS ?birthPlace) . BIND( COALESCE(?dpDB, ?deathPlace) AS ?deathPlace) . FILTER regex(?deathPlace, \"'+place+'\", "i") .} FILTER regex(?occupationName, \"'+occ+'\", "i").}');
	} else {
			console.log('No parameters');
	}
	
}

function getPlaceURI(placename){
	$.ajax({
				type   :"GET",
				url    :'getNameFromIndex.php?name='+placename, 
				success: function(msg){
					var returnobject = JSON.parse(msg);
                    
                    try{
                    	var place = returnobject.placesOfDeath[0].uri;
	                    console.log(place);
	                    
	                    //TODO remove the limit of 10 here by something more useful.

	                    //todo queries that run more than 30 seconds are returned unsuccessfully by the system... this has to be changed.

	                    console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dbpedia-owl:	<http://dbpedia.org/ontology/> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfBirth <'+place+'>	. <'+place+'> gnd:preferredName ?birthPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfDeath <'+place+'>	. <'+place+'> gnd:preferredName ?deathPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }} LIMIT 1000');
	                    submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> prefix dbpedia-owl:	<http://dbpedia.org/ontology/> SELECT DISTINCT (?a as ?personUri) ?name ?birthPlace ?deathPlace ?birthDate ?deathDate ?occupationName WHERE {{?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfBirth <'+place+'>	. <'+place+'> gnd:preferredName ?birthPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL { ?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName .} OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }UNION {?a a stis:Person . ?a gnd:preferredNameForThePerson ?name . ?a  gnd:placeOfDeath <'+place+'>	. <'+place+'> gnd:preferredName ?deathPlace. OPTIONAL {?a gnd:dateOfBirth ?birthDate . } OPTIONAL {?a gnd:dateOfDeath ?deathDate . } OPTIONAL {?a gnd:professionOrOccupation ?occupationEntity . ?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:birthDate ?birthDateDB . } OPTIONAL {?a owl:sameAs ?dbpediaresource . ?dbpediaresource dbpedia-owl:deathDate ?deathDateDB . } BIND( COALESCE(?birthDateDB, ?birthDate) AS ?birthDate) . BIND( COALESCE(?deathDateDB, ?deathDate) AS ?deathDate) . }} LIMIT 1000');
                    } catch(err) {
                    	console.log("No location specified.");
                    }
				}
			});
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


// function submitQueries4Autocomplete() {
	// var endpoint = "http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
	// //sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	// var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	// var request = {
		// accept : 'application/sparql-results+json'
	// };
	// //get sparql query from textarea
	// request.query = "prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a where{ ?c  gnd:preferredNameForThePerson ?a.}";
	// console.log('Start Ajax');
	// //sent request
	// $.ajax({
		// dataType : "jsonp",
		// //some sparql endpoints do only support "sparql-results+json" instead of simply "json"
		// beforeSend : function(xhrObj) {
			// xhrObj.setRequestHeader("Accept", "application/sparql-results+json");
		// },
		// data : request,
		// url : queryUrl,
		// success : callbackAutocompletePerson,
		// error : function(request, status, error) {
			// //alert(request.responseText);
						// var message = "autocomplete error: "+request.responseText +"\n"+ error + "\nstatus: "+status;
	// -					//$("#error").html(message);
						// console.log(message);
// 
		// }
	// });
// }
// 
// var persons;
// // = ["Annette von Droste-Hülshoff", "Bernd Stelter"];;
// 
// function callbackAutocompletePerson(results) {
	// console.log('Autocomplete Person-callback');
// 
	// //result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	// persons = new Array();
	// for (var i = 0, j = results.results.bindings.length; i < j; i++) {
		// persons[i] = results.results.bindings[i].a;
	// };
// 
	// $("#person").autocomplete({
		// source : persons,
		// minLength : 2
	// });
// 
// }
// 
// // function filterData( data ) {
	// // response($.map(data.results, function(item) {
		// // return {
			// // label : item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
			// // value : item.name
		// // }
	// // }));
// // }

