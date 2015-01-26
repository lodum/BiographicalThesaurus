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
	
	var query = new Query();	
	query.setCore("test_all");
	query.setRows("999");

	var searchstring = getParam('searchstring');

	var person = getParam('person');
	if(person && person != "") {
		query.setPerson(person);
	}
	var place = getParam('place');
	if(place && place != "") {
		var tmp = place;
		try {
			place = decodeURI(place);
			place = JSON.parse(place);
			if(place.type == "Circle") {
				place.wkt = "CIRCLE(" + place.coordinates + " d=" + place.radius + ")";
			}
		} catch(e) {
			// place is no object, so place is a city and not a polygon or circle
			place = tmp;
		}
		if(typeof place != 'string') {
			map.drawShape(place.wkt, place.type);
		}
		query.setSpatial(place);
	}
	
	var begindate = getParam('beginDate');
	if(begindate) {
		query.setStart(begindate);
	}
	var enddate = getParam('endDate');
	if(enddate) {
		query.setEnd(enddate);
	}
	var occ = getParam('occ');
	if(occ) {
		query.setActivity(occ);
	}
	var placeType = getParam('pType');
	if(placeType && placeType != "") {
		placeType = placeType.split(",");
		query.initSpatialField();
		$.each(placeType, function (index) {
			tmp = 'placeOf' + placeType[index];
			query.addSpatialField(tmp);
		});
	}
	
	//query.execute()
	$.getJSON(query.buildURL(), function(result){
		processData(result.response.docs);
    });


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

	function processData (data) {
		fillTable(data);
		/*
		$.each(data, function (index, dat) {
			$.each(Object.keys(dat), function (ndx, key) {
				console.log(key);
				console.log(dat[key]);
			});
		});
		*/
		//Add Marker vor Birth, Death and Activity
		$.each(data, function (index, dat) {
			wkt = dat.placeOfBirth_geom;
			if(wkt) {
				cd = wkt[0].split("POINT(");
				cd = cd[1].split(")");
				cd = cd[0].split(" ");
				lat = cd[1];
				lng = cd[0];
				map.addMarker(lat, lng, dat.preferredNameForThePerson, "birth", dat.id);
			}

			wkt = dat.placeOfDeath_geom;
			if(wkt) {
				cd = wkt[0].split("POINT(");
				cd = cd[1].split(")");
				cd = cd[0].split(" ");
				lat = cd[1];
				lng = cd[0];
				map.addMarker(lat, lng, dat.preferredNameForThePerson, "death",dat.id);
			}

			wkt = dat.placeOfActivity_geom;
			if(wkt) {
				cd = wkt[0].split("POINT(");
				cd = cd[1].split(")");
				cd = cd[0].split(" ");
				lat = cd[1];
				lng = cd[0];
				map.addMarker(lat, lng, dat.preferredNameForThePerson, "activity", dat.id);
			}
		});
		map.addMarkerLayer();
		map.showMiniMap();
	}




	function clearTable () {
		$('#result_text').html('');
	}

	var $table = $( "<table id='datatable'></table>" );
	var $head = $("<thead></thead>");
	var $body = $("<tbody></tbody>");
	var $hline = $( "<tr></tr>" );


	function fillTable (data) {
		clearTable();
		$("#pagesContainer").show();
		$("#resultsPerPageContainer").show();
		$hline.append( $( "<td></td>" ).html( "<b>Name</b>" ) );
		$hline.append($("<td></td>").html("<b>Id</b>"));
		$head.append($hline);
		$table.append($head);

		$.each(data, function (index, dat) {
			var $bline = $( "<tr></tr>" );
			$bline.append( $( "<td></td>" ).html( dat.preferredNameForThePerson ) );
			$bline.append( $( "<td></td>" ).html( dat.id ) );
			$body.append( $bline );
		});
		$table.append($body);
		$table.appendTo( $( "#resultdiv" ) );
		$("#datatable").dataTable();

		$('#datatable tbody').on( 'click', 'tr', function (event) {
			var id = $('td', this).eq(1).text();
			map.openMarkerPopup(id);
		});
	};

});