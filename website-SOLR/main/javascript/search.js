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
	var selectedDate = null;
	initSlider();

	$("[rel='tooltip']").tooltip();

	$('#box_birthplace').prop('checked', true);
	$('#box_deathplace').prop('checked', true);
	$('#box_activityplace').prop('checked', true);

	$('#btn-search').on('click', function () {
		console.log("click");
		goToResults();
	});

	$("#checkbox_slider").on('click', function () {
		// uncheck the checkbox related to the slider
		$("#checkbox_slider").prop('checked', false);
		// hide the div which contains the checkbox related to the slider
		$("#box_slider").hide();
		// update the status of the date selection to false
		sliderDateSelection=false;
		$("#slider").rangeSlider("values", 1100, 1400);
		$("#eraSelector")[0][0].text = "...";
		$("#eraSelector")[0].selectedIndex = 0;
	});

	$("#eraSelector").on('change', function (e, data) {
		timetext = $("#eraSelector").val();
		timetext = timetext.split("(");
		timetext = timetext[1].split(")");
		time = timetext[0].split("-");
		startdate = 0;
		enddate = 0;
		if(time.length == 1) {
			time = time[0].split(" ");
			startdate = time[0];
			enddate = new Date().getFullYear();
		} else {
			startdate = time[0];
			enddate = time[1];
		}
		$("#slider").rangeSlider("values", startdate, enddate);
		selectedDate = {min: startdate, max: enddate}
	});

	function initSlider() {
		$("#slider").rangeSlider({
			bounds: {min: 0, max: new Date().getFullYear()},
			defaultValues:{min: 1100, max: 1400},
			arrows:false,
			symmetricPositionning: true,
  			range: {min: 0},
  			step:5,
			scales: [
				// Primary scale
				{
					first: function(val){ return val; },
					next: function(val){ return val + 500; },
					stop: function(val){ return false; },
					label: function(val){ return val; },
					format: function(tickContainer, tickStart, tickEnd){ 
						tickContainer.addClass("myCustomClass");
					}
				},
				// Secondary scale
				{
					first: function(val){ return val; },
					next: function(val){
						if (val % 10 === 9){
							return val + 2;
						}
						return val + 100;
					},
					stop: function(val){ return false; },
					label: function(){ return null; }
				}
			]
		});


		$("#slider").bind("valuesChanging", function(e, data){
			$("#eraSelector")[0][0].text = "(" + data.values.min + "-" + data.values.max + ")";
			$("#eraSelector")[0].selectedIndex = 0;
			selectedDate = {min: data.values.min, max: data.values.max}
			sliderDateSelection = true;
			$("#box_slider").show();
		});
	}


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
		
		startdate = null;
		enddate = null;
		if(selectedDate) {
			startdate = selectedDate.min;
			enddate = selectedDate.max;
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
});