/*
 * This file cares about the auto-complete dropdown menus that are used in the form
 */


//Autocomplete for persons
$( "#person" ).autocomplete(
  {
    source: function( request, response ) {
      suggester = new Suggester();
      suggester.setField("preferredNameForThePerson");
      suggester.setCore("test_all");
      suggester.setSearchTerm(request.term.toLowerCase());

      $.getJSON(suggester.buildURL(), function(result){

      		var tmp = result.facet_counts.facet_fields.preferredNameForThePerson;
      		var data=[];
      		var number=[];
			
			$.each(tmp, function (index, value) {
				if(index % 2) {
					number.push(value);
				} else {
					data.push(value);
				}
				console.log(data);
				console.log(number);
			});
        	
			$.each(data, function (index) {
				data[index] = data[index] + " (" + number[index] + ")";
			});
        	

	        response($.map(data, function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },
    minLength: 2,
    delay: 200
  }
);

 
    
//Autocomplete for places
    
// Autocomplete is built on indexes to keep consistency with the query that is also done on indexes
$( "#place" ).autocomplete(
  {
    source: function( request, response ) {
      suggester = new Suggester();
      suggester.setField("placeOfBirth");
      suggester.setCore("test");
      suggester.setSearchTerm(request.term.toLowerCase());

      $.getJSON(suggester.buildURL(), function(result){
        var tmp = result.facet_counts.facet_fields.placeOfBirth;
      		var data=[];
      		var number=[];
			
			$.each(tmp, function (index, value) {
				if(index % 2) {
					number.push(value);
				} else {
					data.push(value);
				}
				console.log(data);
				console.log(number);
			});
        	
			$.each(data, function (index) {
				data[index] = data[index] + " (" + number[index] + ")";
			});
        	

	        response($.map(data, function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },
    minLength: 2,
    delay: 200
  }
);
	
	
 
//Autcomplete for occupations     
$("#occ").autocomplete(
  {
    source: function( request, response ) {
      suggester = new Suggester();
      suggester.setField("professionOrOccupation");
      suggester.setCore("test");
      suggester.setSearchTerm(request.term.toLowerCase());

      $.getJSON(suggester.buildURL(), function(result){
        var tmp = result.facet_counts.facet_fields.professionOrOccupation;
      		var data=[];
      		var number=[];
			
			$.each(tmp, function (index, value) {
				if(index % 2) {
					number.push(value);
				} else {
					data.push(value);
				}
				console.log(data);
				console.log(number);
			});
        	
			$.each(data, function (index) {
				data[index] = data[index] + " (" + number[index] + ")";
			});
        	

	        response($.map(data, function(item) {
	            return {
	                label : item,
	                value : item
					
	            }
        	}));
      });
    },
    minLength: 2,
    delay: 200
  }
);
	
	var availableTags = [
	"ActionScript",
	"AppleScript",
	"Asp",
	"BASIC",
	"C",
	"C++",
	"Clojure",
	"COBOL",
	"ColdFusion",
	"Erlang",
	"Fortran",
	"Groovy",
	"Haskell",
	"Java",
	"JavaScript",
	"Lisp",
	"Perl",
	"PHP",
	"Python",
	"Ruby",
	"Scala",
	"Scheme"
	];
 

	function split( val ) 
	{
		return val.split( /,\s*/ );
	}
	
	function extractLast(term) 
	{
		return split(term).pop();
	}
	/*
	// Autocomplete for "test" (a field used to test different types of autocomplete fields. It is not displayed on the map)
	$("#test").autocomplete({
		minLength: 2,
		source: function( request, response ) {
		// delegate back to autocomplete, but extract the last term
		response( $.ui.autocomplete.filter(
		availableTags, extractLast( request.term ) ) )
		}, 
		select: function( event, ui ) {
		var terms = split( this.value );
		// remove the current input
		terms.pop();
		// add the selected item
		terms.push( ui.item.value );
		// add placeholder to get the comma-and-space at the end
		terms.push( "" );
		this.value = terms.join( ", " );
		return false;
		}
	});
	
	*/
	
	$("#test").autocomplete(
    {
      source: function( request, response ) 
	  {
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
			"}"+ordering+limit;  				
        $.ajax({
          url: "http://jsonp.lodum.de/?endpoint=http://data.uni-muenster.de:8080/openrdf-sesame/repositories/bt",
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
	  select: function( event, ui ) 
	  {
		var terms = split( this.value );
		// remove the current input
		terms.pop();
		// add the selected item
		terms.push( ui.item.value );
		// add placeholder to get the comma-and-space at the end
		terms.push( "" );
		this.value = terms.join( ", " );
		return false;
	  },
      minLength: 0,
      delay: 300
    }
    );
	
	
	
	
 
	
	
	