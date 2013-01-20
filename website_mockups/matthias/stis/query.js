var searchResults;
var currentPage;

function gotoPage(number){
	currentPage=number;
	displayResults();
}

function submitQuery() {
	var endpoint = "http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	request.query = $("#sparqlQuery").val();

	//sent request
	$.ajax({
		dataType : "jsonp",
		//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
		beforeSend : function(xhrObj) {
			xhrObj.setRequestHeader("Accept", "application/sparql-results+json");
		},
		data : request,
		url : queryUrl,
		success : callbackFunc,
		error : function(request, status, error) {
			alert(request.responseText + error);
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
	var exp = /(\b(https?|ftp|file):\/\/\b(lobid.org)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	text = text.replace(exp, "<a href='http://giv-stis-2012.uni-muenster.de:8080/openrdf-workbench/repositories/stis/explore?resource=$1' target=\"_blank\">$1</a>");
	if (text.indexOf("<a href") == 0){
		return text;
	}else{
		var exp = /(\b(https?|ftp|file):\/\/\b[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		text = text.replace(exp, "<a href='$1' target=\"_blank\">$1</a>");
	}
	return text;
}


//handles the ajax response
function callbackFunc(results) {
	console.log('start callback');
	$("#resultdiv").empty();
	//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	htmlString = "<table class=\"table table-striped table-condensed\">";
	//write table head
	htmlString += "<tr>";
	$.each(results.head.vars, function(index2, value2) {
		htmlString += "<th>?" + value2 + "</th>";
	});
	htmlString += "</tr>";
	//write table body
	$.each(results.results.bindings, function(index1, value1) {
		htmlString += "<tr>";
		$.each(results.head.vars, function(index2, value2) {
			if (value1[value2] != undefined) {
				htmlString += "<td>" + replaceURLWithHTMLLinks(value1[value2].value) + "</td>";
			} else {
				htmlString += "<td></td>";
			}
		});
		htmlString += "</tr>";
	});

	htmlString += "</table>";
	$("#resultdiv").html(htmlString);
}


//handles the ajax response
function callbackFuncResults(results) {
	console.log('start callback');	
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
	var pagesHtml = "Total number of results: " +results.results.bindings.length+"<br\>";
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
	
	$("#resultdiv").empty();
	//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	htmlString = "<table class=\"table table-striped table-condensed\">";
	//write table head
	htmlString += "<tr>";
	$.each(results.head.vars, function(index2, value2) {
		htmlString += "<th>?" + value2 + "</th>";
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
};


function submitTagCloudQuery() {
	var endpoint = "http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	request.query = "prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a where{ ?c  gnd:surname ?a.} LIMIT 35";
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
		console.log(index1);
		console.log(value1);
		$.each(results.head.vars, function(index2, value2) {
			if (value1[value2] != undefined) {
				htmlString += "<a href\=\"\#\">" + replaceURLWithHTMLLinks(value1[value2].value) + "</a>";
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
	TagCanvas.Start('myCanvas');
	try {
		TagCanvas.Start('myCanvas');
	} catch(e) {
		// something went wrong, hide the canvas container
		document.getElementById('myCanvasContainer').style.display = 'none';
	}
  }
	
function startQuery(){
	var searchstring = getParam('searchstring');
	console.log('searchstring='+searchstring);
	var person = getParam('person');
	console.log('person='+person);
	var publication = getParam('publication');
	console.log('publication='+publication);
	var place = getParam('place');
	console.log('place='+place);
	
	if (searchstring!=""){
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select (?c as ?Result) (?a as ?Link) where{ ?a ?b ?c . filter regex(?c,\"'+searchstring+'\",\'i\')}');
	} else if (person!=""){
		//buildQuery(person);
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?name where {?a a stis:Person;gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i")}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select ?a ?name where {?a a stis:Person;gnd:preferredNameForThePerson ?name FILTER regex(?name, \"'+person+'\", "i")}');
	} else if (publication!=""){
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b; } union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where {{ ?a a stis:Publication; <http://iflastandards.info/ns/isbd/elements/P1004> ?b; } union { ?a a stis:Publication; gnd:preferredNameForTheWork ?b.} FILTER regex(?b, \"'+publication+'\", "i")}');	
	} else if (place!=""){
		console.log('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{ ?a a stis:Publication. ?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName FILTER regex(?locationName, \"\^'+place+'\","i") .}');
		submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{ ?a a stis:Publication. ?a <http://iflastandards.info/ns/isbd/elements/P1016> ?locationName FILTER regex(?locationName, \"\^'+place+'\","i") .}');
	} else {
			console.log('No parameters');
	}
	
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

function submitQueries4Autocomplete() {
	var endpoint = "http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
	//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
	var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
	var request = {
		accept : 'application/sparql-results+json'
	};
	//get sparql query from textarea
	request.query = "prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select distinct ?a where{ ?c  gnd:preferredNameForThePerson ?a.}";
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
		success : callbackAutocompletePerson,
		error : function(request, status, error) {
			//alert(request.responseText);
						var message = "autocomplete error: "+request.responseText +"\n"+ error + "\nstatus: "+status;
	-					//$("#error").html(message);
						console.log(message);

		}
	});
}

var persons;
// = ["Annette von Droste-Hülshoff", "Bernd Stelter"];;

function callbackAutocompletePerson(results) {
	console.log('Autocomplete Person-callback');

	//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
	persons = new Array();
	for (var i = 0, j = results.results.bindings.length; i < j; i++) {
		persons[i] = results.results.bindings[i].a;
	};

	$("#person").autocomplete({
		source : persons,
		minLength : 2
	});

}

// function filterData( data ) {
	// response($.map(data.results, function(item) {
		// return {
			// label : item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
			// value : item.name
		// }
	// }));
// }

