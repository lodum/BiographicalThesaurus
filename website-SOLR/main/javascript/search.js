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

	$("#eraSelector").on('change', function (e, data) {
		var index = $("#eraSelector option:selected").index();
		var eras = [{min: null,max: null}, {min: null,max: 500}, {min: 500,max: 1500}, {min: 500,max: 900}, {min: 900,max: 1250}, {min: 1250,max: 1500}, {min: 1500,max: null}, {min: 1500,max: 1800}, {min: 1500,max: 1650}, {min: 1680,max: 1800}, {min: 1800,max: null}, {min: 1800,max: 1870}, {min: 1871,max: 1945}, {min: 1945, max: null} ]
		var startdate = eras[index].min;
		var enddate = eras[index].max;
		var sliderValues = $("#slider").editRangeSlider("values");
		if(startdate == null) {
			if(enddate == null) {
				startdate = sliderValues.min;
				enddate = sliderValues.max;
			} else {
				startdate = 0;
			}
		} else if(enddate == null) {
			enddate = new Date().getFullYear();
		}
		$("#slider").editRangeSlider("values", startdate, enddate);
		selectedDate = {min: startdate, max: enddate}
	});

	function initSlider() {
		$("#slider").editRangeSlider({
			bounds: {min: -500, max: new Date().getFullYear()},
			defaultValues:{min: 0, max: new Date().getFullYear()},
			arrows:false,
			symmetricPositionning: true,
  			range: {min: 0},
  			step:1,
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
		selectedDate = {min: $("#slider").editRangeSlider("values").min, max: $("#slider").editRangeSlider("values").max}
		sliderDateSelection = true,
		//selectedDate = {min: data.values.min, max: data.values.max}

		$("#slider").bind("valuesChanged", function(e, data){
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