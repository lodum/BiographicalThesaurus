$(document).ready(function () {
	//Init map and Add tilelayer to the map
	var map = new Map('map').setView([51.78682,7.2858], 8);
	mapLink ='<a href="http://openstreetmap.org">OpenStreetMap</a>';
	tilelayer = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
	        attribution: 'Map data &copy; ' + mapLink,
	        maxZoom: 18,
		}
	);
	map.addTileLayer(tilelayer);
	map.initLeafletDraw();


	$('#box_birthplace').prop('checked', true);
	$('#box_deathplace').prop('checked', true);
	$('#box_activityplace').prop('checked', true);

	$('#btn-search').on('click', function () {
		goToResults();
	});


	function goToResults() {
		var person = $('#person').val();
		var occ = $('#occ').val();
		var place = $('#place').val();
		placeTmp = map.returnPolygonShape();
		if(placeTmp) {
			place = placeTmp;
		}

		//has to be redone
		placetype = [];
		if ($('#box_deathplace').is(':checked')) {
			placetype.push("Death");
		}
		if ($('#box_activityplace').is(':checked')) {
		   placetype.push("Activity");
		}
		if ($('#box_birthplace').is(':checked')) {
		   placetype.push("Birth");   
		}
		var startdate = null;
		var enddate = null;
		eraStart = [null, 1800, 1500, 800, 400];
		currentYear = new Date().getFullYear(); // get the current year
		eraEnd=[null, currentYear, 1800, 1500, 800]
		eraSelector = $('#eraSelector')["0"].selectedIndex;
		if (sliderDateSelection) {
			timetext = ($("#currentTimeInterval").text());
			timetext = timetext.split("[ ");
			timetext = timetext[1].split(" ]");
			time = timetext[0].split(" - ");
			startdate = time[0];
			enddate = time[1];
		} else {
			startdate = eraStart[eraSelector];
			enddate = eraEnd[eraSelector];
		}


		var target = "results.php?";
		var targetControl = target;
		if (person && person != "") {
			target += "person=" + person;
		}
		if(startdate && startdate != "") {
			if(target != targetControl) {
				target += "&"
			}
			target += "beginDate=" + startdate;
		}
		if(enddate && enddate != "") {
			if(target != targetControl) {
				target += "&"
			}
			target += "endDate=" + enddate;
		}
		if (occ && occ != "") {
			if(target != targetControl) {
				target += "&"
			}
			target += "occ=" + occ;
		}
		if (place && place != "") {

			if (placetype && placetype != "") {
				if(target != targetControl) {
					target += "&"
				}
				target += "pType=" + placetype[0];
				$.each(placetype, function (index) {
					if(index > 0) {
						target += "," + placetype[index];
					}
				});
				
			}

			if(target != targetControl) {
				target += "&"
			}
			target += "place=" + place;
		}
		
		window.location = target;
	}


	// this function hides the checkbox when the user decides not to specify a time period for his query
	function hideSliderCheckbox()
	{
		 // uncheck the checkbox related to the slider
		 $("#checkbox_slider").prop('checked', false);
		 // hide the div which contains the checkbox related to the slider
		 $("#box_slider").hide();
		 // update the status of the date selection to false
		 sliderDateSelection=false;
		 // display the message that a time period has not been selected 
		 $("#currentTimeInterval").text(timeIntervalNotSelected); 
	}




	// function useful to activate the tooltips when displaying possible examples of queries
	$(function () {
		$("[rel='tooltip']").tooltip();
	});

	// for the slider
	$(function() {

		sliderDateSelection = false;
		var min_year = 0;
		var max_year = new Date().getFullYear(); // get the current year
		var min_defaultvalue= 1600; 
		var max_defaultvalue = 1750;

		// get the text to display when no time period has been selected (in german or english)
		timeIntervalNotSelected =   $("#currentTimeInterval").text(); 
		//$("#currentTimeInterval").text("[ "+min_defaultvalue + " - "+ max_defaultvalue+ " ]");

		$("#slider").slider({
			range: true,
			min: min_year,
			max: max_year,
			values: [ min_defaultvalue, max_defaultvalue ], 
			slide : function( event, ui) {
				$("#currentTimeInterval").text("[ "+ui.values[0] + " - " + ui.values[1]+ " ]");
				// as soon as the slider has been used, it is considered that the user has selected a time period
				sliderDateSelection = true;
				// show the checkbox related to the slider. This gives the user the possibility NOT to specify a time period after having interacted with the slider
				$("#box_slider").show();
			}
		});
	});
});