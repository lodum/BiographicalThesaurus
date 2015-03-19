$(document).ready(function () {
	/*** Variables
	*
	*/
	var map = new Map('map').setView([51.962797, 7.621200], 8),
		selectedDate = null,
		era,
		eraChangeFlag = false,
		profession_data,
		place_data,
		data_loaded = 0,
		_place = getParam('place'),
		_person = getParam('person'),
		_pType = getParam('pType'),
		_start = getParam('beginDate'),
		_end = getParam('endDate'),
		_occ = getParam('occ'),
		_era = getParam('era'),
		mapLink ='<a href="http://openstreetmap.org">OpenStreetMap</a>',
		tilelayer = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
	        attribution: 'Map data &copy; ' + mapLink,
	        maxZoom: 18,
		}),
		$selectOcc = $('#select-occ').selectize({
			sortField: {field: 'text'},
			openOnFocus: false
		}),
    	$selectPlace = $('#select-place').selectize({
			sortField: {field: 'text'},
			openOnFocus: false
		}),
		selectizeOcc = $selectOcc[0].selectize,
		selectizePlace = $selectPlace[0].selectize;

	
	/*** Functions
	*
	*/

	/***
	* Extract parameter from the URL
	*/
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
	};

	/***
	* Restore values after reloading the page.
	* Values are stored in the URL.
	*/
	function restoreValues() {
		if(_place) {
			var tmp = _place;
			try {
				_place = decodeURI(_place);
				_place = JSON.parse(_place);
				if(_place.type == "Circle") {
					_place.wkt = "CIRCLE(" + _place.coordinates + " d=" + _place.radius + ")";
				}
			} catch(e) {
				// place is no object, so place is a city and not a polygon or circle
				_place = tmp;
				$("#select-place").text(decodeURI(_place));
				selectizePlace.setValue(decodeURI(_place));
				selectizePlace.setTextboxValue(decodeURI(_place));
			}
			if(typeof _place != 'string') {
				map.drawShape(_place.wkt, _place.type);
			}
		}
		if(_person) {
			$('#person').val(decodeURI(_person));
			$('#person').text(decodeURI(_person));
		}
		if(_pType) {
			_pType = _pType.split(',');
			$('#box_birthplace').prop('checked', false);
			$('#box_deathplace').prop('checked', false);
			$('#box_activityplace').prop('checked', false);
			$.each(_pType, function (index) {
				if(_pType[index] == 'Birth'){
					$('#box_birthplace').prop('checked', true);
				}
				if(_pType[index] == 'Death'){
					$('#box_deathplace').prop('checked', true);
				}
				if(_pType[index] == 'Activity'){
					$('#box_activityplace').prop('checked', true);
				}
			});
		}
		if(_start) {
			selectedDate = {min: _start, max: selectedDate.max};
			$("#slider").editRangeSlider("values", selectedDate.min, selectedDate.max);
		}
		if(_end) {
			selectedDate = {min: selectedDate.min, max: _end};
			$("#slider").editRangeSlider("values", selectedDate.min, selectedDate.max);
		}
		if(_occ) {
			$("#select-occ").text(decodeURI(_occ));
			selectizeOcc.setValue(decodeURI(_occ));
			selectizeOcc.setTextboxValue(decodeURI(_occ));
		}
		if(_era) {
			eraChangeFlag = true;
			$("#eraSelector").val(_era);
		}
	}

	/***
	* Initialize the slider, set the values and add Listener for Changed Values
	*/
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
		selectedDate = {min: $("#slider").editRangeSlider("values").min, max: $("#slider").editRangeSlider("values").max};

		$("#slider").bind("valuesChanged", function(e, data){
			if(!eraChangeFlag) {
				$("#eraSelector")[0].selectedIndex = 0;
				$("#box_slider").show();
				era = null;
			}
			eraChangeFlag = false;
			selectedDate = {min: data.values.min, max: data.values.max};
		});
	}

	/***
	* Get all data inserted into the form and go to the results page
	*/
	function goToResults() {
		var person = $('#person').val();
		var occ = $('#select-occ').text();
		var place = $('#select-place').text();
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

		var suffix = "results.php?core=gnd3&";
		var target = '';
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

		if(era) {
			if(target != targetControl) {
				target += "&"
			}
			target += "era=" + era;
		}
		var stateObj = { foo: "bar" };
		history.pushState(stateObj, "page 2", "search.php?" + target);
		window.location = suffix + target;
	}

	/*** Events
	*
	*/

	/***
	* Is called when an era is changed
	*/
	$("#eraSelector").on('change', function (e, data) {
		var index = $("#eraSelector option:selected").index();
		era = index;
		eraChangeFlag = true;
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

	/***
	* Is called when an shape is drawn on the map.
	* Calls a window asking to submit the query.
	*/
	$(map).on('draw:created', function () {
		$( "#dialog-confirm" ).html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>Wollen Sie die Suche ausführen?');
		$( "#dialog-confirm" ).dialog({
			resizable: false,
			height:200,
			modal: true,
			buttons: {
				"Ja": function() {
					$( this ).dialog( "close" );
					goToResults();
				},
				Nein: function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});

	/***
	* Is called when the submit button is clicked
	*/
	$('#btn-search').on('click', function () {
		goToResults();
	});

	/*** Function Calls
	* 
	*/
	map.addTileLayer(tilelayer);

	initSlider();
	map.initLeafletDraw();

	//tick checkboxes for place types
	$('#box_birthplace').prop('checked', true);
	$('#box_deathplace').prop('checked', true);
	$('#box_activityplace').prop('checked', true);

	// Query places and professions and add them to the select elements
	suggester = new Suggester();
	suggester.setCore('gnd3');
	suggester.setField('professionsOrOccupations');
	$.getJSON(suggester.buildURL(), function(result){
		profession_data = result.facet_counts.facet_fields.professionsOrOccupations;
		$.each(profession_data, function (index, value) {
			if(index % 2) {
				//do nothing
			} else {
				selectizeOcc.addOption(new Option(value, index/2));
			}
		});
		data_loaded ++;
		if(data_loaded == 2) {
			restoreValues();
		}
    });
	suggester.setField('placeOfBirth');
	$.getJSON(suggester.buildURL(), function(result){
		profession_data = result.facet_counts.facet_fields.placeOfBirth;
		$.each(profession_data, function (index, value) {
			if(index % 2) {
				//do nothing
			} else {
				selectizePlace.addOption(new Option(value, index/2));
			}
		});
		data_loaded ++;
		if(data_loaded == 2) {
			restoreValues();
		}
    });	

    $("[rel='tooltip']").tooltip();
});
