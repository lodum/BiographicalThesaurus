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

    select: function (event, ui) {
    	ui.item.label = ui.item.label.split(" (")[0];
    	ui.item.value = ui.item.value.split(" (")[0];
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

    select: function (event, ui) {
    	ui.item.label = ui.item.label.split(" (")[0];
    	ui.item.value = ui.item.value.split(" (")[0];
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

    select: function (event, ui) {
    	ui.item.label = ui.item.label.split(" (")[0];
    	ui.item.value = ui.item.value.split(" (")[0];
    },
    minLength: 2,
    delay: 200
  }
);	