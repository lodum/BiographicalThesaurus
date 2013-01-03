function submitQuery(){
		var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
		//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
		var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
		var request = { accept : 'application/sparql-results+json' };
		//get sparql query from textarea
		request.query=$("#sparqlQuery").val();

		//sent request
		$.ajax({
			dataType: "jsonp",
			//some sparql endpoints do only support "sparql-results+json" instead of simply "json"
			beforeSend: function(xhrObj){xhrObj.setRequestHeader("Accept","application/sparql-results+json");},
			data: request,
			url: queryUrl,
			success: callbackFunc,
			error: function (request, status, error) {
		        //alert(request.responseText);
					$("#error").html(request.responseText);
		    }
		});
	};
	
	function buildQuery(){
		//submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a gnd:DifferentiatedPerson.}');
		var person = ($("#person").val());
		
		switch (person){
			case '': 
					//console.log('1 Person = ' + person);
					person='gnd:DifferentiatedPerson';
					console.log('1 Person = ' + person);
					submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a '+person+'.}');
					break;
			
			case 'gnd:DifferentiatedPerson': 	
					console.log('2 Person = ' + person);
					submitCustomQuery('prefix stis:    <http://localhost/default#> prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix gnd:     <http://d-nb.info/standards/elementset/gnd#> select * where{?a a '+person+'.}');
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
	*/
	}
	
	function submitCustomQuery(text){
		var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
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
			success: callbackFunc,
			error: function (request, status, error) {
		        //alert(request.responseText);
					$("#error").html(request.responseText);
		    }
		});
	};
	
	function replaceURLWithHTMLLinks(text) {
		    var exp = /(\b(https?|ftp|file):\/\/\b(lobid.org)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		    return text.replace(exp,"<a href='http://giv-stis-2012.uni-muenster.de:8080/openrdf-workbench/repositories/stis/explore?resource=$1' target=\"_blank\">$1</a>"); 
		}
	

	//handles the ajax response
	function callbackFunc(results) {
		console.log('start callback');
		$("#resultdiv").empty();	   
		//result is a json object http://de.wikipedia.org/wiki/JavaScript_Object_Notation
		htmlString="<table class=\"table table-striped table-condensed\">";
		//write table head
		htmlString+="<tr>";
			$.each(results.head.vars, function(index2, value2) { 
				htmlString+="<th>?"+value2+"</th>";
			 });
		htmlString+="</tr>";
		//write table body
		$.each(results.results.bindings, function(index1, value1) { 
			htmlString+="<tr>";
			$.each(results.head.vars, function(index2, value2) { 
				if(value1[value2]!=undefined){
					htmlString+="<td>"+replaceURLWithHTMLLinks(value1[value2].value)+"</td>";
				}else{
					htmlString+="<td></td>";
				}
			 });
			htmlString+="</tr>";
		});

		htmlString+="</table>";
		$("#resultdiv").html(htmlString);
	}
