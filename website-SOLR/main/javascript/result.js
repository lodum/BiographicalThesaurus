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
	
	var query = new Query(true);	
	query.setRows("99999");


	var core = getParam('core');
	if(core && core != "") {
		query.setCore(core);
		if(core == "gnd2") {
			$('#coreSelector')[0].selectedIndex = 1;
		}
	}

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


	$("#btn-toggle-map").click(function (e) {
		if($("#btn-toggle-map").text() == "<") {
			$("#btn-toggle-map").text(">");
			$("#map").show();
			$("#result-container").attr("class","col-xs-6 col-md-6 pull-left");
			$('#datatable').width($('#resultdiv').width());
			dtable.draw();
		} else {
			$("#btn-toggle-map").text("<");
			$("#map").hide();
			$("#result-container").attr("class","col-xs-12 col-md-12 pull-left");
			$('#datatable').width($('#resultdiv').width());
			dtable.draw();
		}
		
	});
	
	var begindate = getParam('beginDate');
	if(begindate) {
		if(begindate != 0) {
			query.setStart(begindate);
		}
	}
	var enddate = getParam('endDate');
	if(enddate) {
		if(enddate != new Date().getFullYear()) {
			query.setEnd(enddate);
		}
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
			if(placeType[index] == 'Activity') {
				tmp = 'placesOfActivity'
				query.addSpatialField(tmp);
			} else {
				tmp = 'placeOf' + placeType[index];
				query.addSpatialField(tmp);
			}
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

	$('#coreSelector').on('change', function (e) {
		var val = $("#coreSelector option:selected").val();
		var query = window.location.search.substring(1);
		vars = query.split("&");
		var newURL = "results.php?";
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == "core") {
				pair[1] = val;
			}
			if(i != 0) {
				newURL += "&"
			}
			newURL += pair[0] + "=" + pair[1];
			console.log(newURL);
		}
		window.location = newURL;
	});

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

			wkt = dat.placesOfActivity_geom;
			if(wkt) {
				$.each(wkt, function (index) {
					cd = wkt[index].split("POINT(");
					cd = cd[1].split(")");
					cd = cd[0].split(" ");
					lat = cd[1];
					lng = cd[0];
					map.addMarker(lat, lng, dat.preferredNameForThePerson, "activity", dat.id);
				});
			}
		});
		map.addMarkerLayer(placeType);
		map.showMiniMap();
	}




	function clearTable () {
		$('#result_text').html('');
	}

	var $table = $('<table id="datatable" style="width=100%;"></table>');
	var $head = $("<thead></thead>");
	var $body = $("<tbody></tbody>");
	var $hline = $("<tr></tr>");

	var dtable = $("#datatable").DataTable();

	function fillTable (data) {
		clearTable();
		$("#pagesContainer").show();
		$("#resultsPerPageContainer").show();
		$hline.append($("<td></td>").html( "<b>Name</b>" ) );
		$hline.append($("<td></td>").html("<b>Geb. Ort</b>"));
		$hline.append($("<td></td>").html("<b>Ster. Ort</b>"));
		$hline.append($("<td></td>").html("<b>Geb. Datum</b>"));
		$hline.append($("<td></td>").html("<b>Ster. Datum</b>"));
		$hline.append($("<td></td>").html("<b>Beruf</b>"));
		$hline.append($("<td style=\"display:none;\"></td>").html("<b>GND ID</b>"));

		$hline.append($("<td class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\"></td>").html(""));
		$head.append($hline);
		$table.append($head);

		$.each(data, function (index, dat) {
			var $bline = $( "<tr></tr>" );
			$bline.append( $( "<td></td>" ).html( dat.preferredNameForThePerson ) );
			$bline.append( $( "<td></td>" ).html( dat.placeOfBirth ) );
			$bline.append( $( "<td></td>" ).html( dat.placeOfDeath ) );

			// Dates
			$bline.append( $( "<td></td>" ).html( details.dateFormat(dat.dateOfBirth) ) );
			$bline.append( $( "<td></td>" ).html( details.dateFormat(dat.dateOfDeath) ) );
			
			var occ = "";
			if(dat.professionOrOccupation) {
				$.each(dat.professionOrOccupation, function (index) {
					if(occ != "") {
						occ += ", "
					}
					occ += dat.professionOrOccupation[index];
				});
			}
			$bline.append( $( "<td></td>" ).html( occ ) );
			$bline.append( $( "<td class=\"gndid\" style=\"display:none;\"></td>" ).html( dat.id ) );
			
			$bline.append( $( "<td class=\"details-control\"></td>" ).html('') );
			
			$body.append( $bline );
		});
		$table.append($body);
		$table.appendTo( $( "#resultdiv" ) );

		dtable = $("#datatable").DataTable();

		dtable.draw();

		$('#datatable tbody').on('click', 'td.details-control', function () {
			var td = $(this);
	        var tr = $(this).closest('tr'); 
	       	var row = dtable.row( tr );

	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            map.undoHighLight();
	            map.showMarkers();
	            td.removeClass('shown');
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
        		var gndID = $('td.gndid', tr).text();
        		map.highLight(gndID);

        		//Load Details
        		details.load(gndID, row);        		
	            
	            td.addClass('shown');
	            tr.addClass('shown');
	        }
    	} );
	};

	$(map).on('marker_clicked', function (e, id) {
		map.highLight(id);
		dtable.search(id);
		dtable.draw();
		var index = 0;
		$.each(dtable.rows().data(), function (index) {
			if(dtable.row(index).data()[6] == id) {
				details.load(id, dtable.row(index));
			}
		});
		
	});

});