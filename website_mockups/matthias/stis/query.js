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
	
	function submitCustomQuery(text){
		var endpoint="http://giv-stis-2012.uni-muenster.de:8080/openrdf-sesame/repositories/stis";
		//sent request over jsonp proxy (some endpoints are not cors enabled http://en.wikipedia.org/wiki/Same_origin_policy)
		var queryUrl = "http://jsonp.lodum.de/?endpoint=" + endpoint;
		var request = { accept : 'application/sparql-results+json' };
		//get sparql query from textarea
		request.query=text;
		
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
