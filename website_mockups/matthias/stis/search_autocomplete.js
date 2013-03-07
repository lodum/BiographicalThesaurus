var prefixes = "prefix stis: <http://localhost/default#>\n" 
				+"prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
				+"prefix gnd: <http://d-nb.info/standards/elementset/gnd#>\n"
				+"prefix dc: <http://purl.org/dc/terms/>\n";
				
var limit =" Limit 7";


   $( "#subject" ).autocomplete(
        {
      source: function( request, response ) {          
          
          var query = prefixes+
					"select distinct ?subjectName where{\r\n" + 
					" ?publicationUri a stis:Publication .\r\n" + 
					" ?publicationUri <http://purl.org/dc/terms/subject> ?subjectURI.\r\n" + 
					" ?subjectURI gnd:preferredName ?subjectName FILTER regex(?subjectName, \""+request.term+"\", \"i\").\r\n" + 
					"}"+limit;
          
          
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.subjectName.value,
                            value : item.subjectName.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    $( "#place" ).autocomplete({
		source: function( request, response ) {
			//console.log('here');
			var string1=request.term;
			//console.log(string1);
			$.ajax({
				type   :"GET",
				//data   :"?name=test",
				url    :'getNameFromIndex.php?name='+string1, 
				success: function(msg){
				//alert(msg); // here you can get the result from php page
					//console.log('did it');
					console.log('here');
					console.log(msg);
					var returnobject = JSON.parse(msg);
					console.log(returnobject);
					console.log(returnobject.placesOfDeath[0].placeOfDeath);
					//TODO: Popup dropdown menu
				}
			});
			
		}
	});
    
    /*$( "#person" ).autocomplete({
		source: function( request, response ) {
			$.getJSON("placesOfDeath.json", function(data) {
				//console.log(request);
				//console.log(data.placesOfDeath[1]);
				//console.log(data.placesOfDeath.length);
				//console.log(request.term);
				var searchstring=request.term;
				var exp = new RegExp(searchstring,"gi");
				//for(x in data) {
					for(var i = 0; i < data.placesOfDeath.length; i++){
						var test = data.placesOfDeath[i].placeOfDeath.match(exp);
						if (test!=null){
							console.log(data.placesOfDeath[i].placeOfDeath);
							console.log(data.placesOfDeath[i].uri);
						}
						//if (data.placesOfDeath[i].placeOfDeath.match(/Honnef/gi)!=-1){
							//console.log(data.placesOfDeath[i].placeOfDeath);
						//}
					}
					//if(data.placesOfDeath[x]==request) {
					//return data[x].uri;
					//console.log('found it');
				//}

			
			
			// data is a JavaScript object now. Handle it as such
			/*$.each(data.placesOfDeath, function(i, v) {
				//console.log('here');
				//var varname=request;
				//var test = v.placeOfDeath.search(new RegExp('\\+'+varname));
				//console.log(test);
				if (v.placeOfDeath.search(new RegExp("/"+request+"/i")) != -1) {
				console.log(v.uri);
				return;
			}
			});
			
        
		});
		}
     }
    );*/
    
    
   $( "#person" ).autocomplete(
        {
      source: function( request, response ) {
		  
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="\nfilter regex(?Result, \""+regex[i]+"\",\"i\"). ";
          };
          
          var query = prefixes+
          			  "select distinct ?Result where{ ?c  gnd:preferredNameForThePerson ?Result."
          			  	+filter+"}"+limit;
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 200
    }
    );
    
    
   $( "#author" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
          					"select distinct ?name where{\r\n" + 
		"{\r\n" + 
		" ?a a stis:Publication;\r\n" + 
		" <http://iflastandards.info/ns/isbd/elements/P1004> ?title\r\n" + 
		"} \r\n" + 
		"union {\r\n" + 
		" ?a a stis:Publication;\r\n" + 
		" gnd:preferredNameForTheWork ?title.\r\n" + 
		"}\r\n" + 
		"{\r\n" + 
		"{\r\n" + 
		"?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://xmlns.com/foaf/0.1/name> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://www.w3.org/2000/01/rdf-schema#label> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:variantName ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://rdvocab.info/ElementsGr2/variantNameForThePerson> ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:variantNameForThePerson ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:preferredName ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p gnd:preferredNameForThePerson ?name .\r\n" + 
		"} union {\r\n" + 
		"	?a a stis:Publication .\r\n" + 
		"        ?a <http://purl.org/dc/elements/1.1/creator> ?p .\r\n" + 
		"        ?p <http://rdvocab.info/ElementsGr2/preferredNameForThePerson> ?name .\r\n" + 
		"}\r\n" + 
		"FILTER regex(?name, \""+request.term+"\",\"i\")\r\n" + 
		"}\r\n" + 
		"}"+limit;
		
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.name.value,
                            value : item.name.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
   $( "#publication" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
          			"select distinct (?b as ?name) where {{\r\n" + 
					" ?a a stis:Publication;\r\n" + 
					" <http://iflastandards.info/ns/isbd/elements/P1004> ?b;\r\n" + 
					"} \r\n" + 
					"union {\r\n" + 
					" ?a a stis:Publication;\r\n" + 
					" gnd:preferredNameForTheWork ?b.\r\n" + 
					"}\r\n" + 
					"FILTER regex(?b, \""+ request.term+"\", \"i\")\r\n" + 
					"}"+limit
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.name.value,
                            value : item.name.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );
    
    
    /*$( "#place" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
			"select distinct (?locationName as ?Result) where{\r\n" + 
              "?a gnd:preferredNameForThePlaceOrGeographicName ?locationName.\r\n"+
			"FILTER regex(?locationName, \""+request.term+"\",\"i\")\r\n" + 
			"}" + limit;     				
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 2,
      delay: 300
    }
    );*/
    
    
     $( "#occ" ).autocomplete(
        {
      source: function( request, response ) {
          //String.split()
          var regex = request.term.split(" ");
          var filter="";
          for(var i=0,j=regex.length; i<j; i++){
            filter+="filter regex(?c, \""+regex[i]+"\",\"i\") ";
          };
          
          var query = prefixes+
			"select distinct (?occupationName as ?Result) where{\r\n" + 
              "?a gnd:professionOrOccupation ?occupationEntity.\r\n"+
              "?occupationEntity gnd:preferredNameForTheSubjectHeading ?occupationName.\r\n"+
			"FILTER regex(?occupationName, \""+request.term+"\",\"i\").\r\n" + 
			"}" + limit;     				
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://giv-lodum.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
          dataType: "jsonp",
          beforeSend: function(xhrObj){
                 xhrObj.setRequestHeader("Accept","application/sparql-results+json");
                 console.log(query);
          },
          data: { accept : 'application/sparql-results+json' ,
                  query : query
                 },
          success: 
                function filterData( data ) {
                    response($.map(data.results.bindings, function(item) {
                        return {
                            label : item.Result.value,
                            value : item.Result.value
                        }
                    }));
                },
           error: function (request, status, error) {
                 console.log(request.responseText+ error);
                  //$("#error").html(request.responseText);
            }
        });
      },
      minLength: 0,
      delay: 300
    }
    );
    
