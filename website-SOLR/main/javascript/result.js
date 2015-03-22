$(document).ready(function () {
	/*** Variables
	*
	*/
	var map = new Map('map').setView([51.962797, 7.621200], 10),
		mapLink ='<a href="http://openstreetmap.org">OpenStreetMap</a>',
		tilelayer = L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
			{
		        attribution: 'Map data &copy; ' + mapLink,
		        maxZoom: 18,
			}
		),
		query = new Query(true),
		selectedAll = false,
		selection = [],
		allData,
		core = getParam('core'),
		searchstring = getParam('searchstring'),
		person = getParam('person'),
		place = getParam('place'),
		hideMap = false,
		$table = $('<table id="datatable" class="display" style="width=100%;"></table>'),
		$head = $("<thead></thead>"),
		$body = $("<tbody></tbody>"),
		$hline = $("<tr></tr>"),
		dtable = $("#datatable").DataTable( 
			{
			    "oLanguage": {
			      	"sSearch": "Ergebnisse filtern:",
			      	"sInfo": "Ergebnisse _START_ bis _END_ von _TOTAL_",
			      	"sNext": "Nächste",
			      	"sPrevious": "Vorherige",
			      	"sLengthMenu": 'Anzeigen <select>'+
						'<option value="10">10</option>'+
						'<option value="25">25</option>'+
						'<option value="50">50</option>'+
						'<option value="100">100</option>'+
						'<option value="-1">Alle</option>'+
						'</select>'
			    },
		  	} 
	  	);

	/*** Functions
	*
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

	function toggleMap(pushState) {
		if(!hideMap) {
			$("#btn-toggle-map").text(">");
			$("#map").show();
			$("#result-container").attr("class","col-xs-6 col-md-6 pull-left");
			$('#datatable').width($('#resultdiv').width());
			dtable.draw();
			if (pushState)
				history.pushState(null, "", window.location.href.replace('&hideMap=true', ''));
			//window.location = window.location.href.replace('&hideMap=true', '');
		} else {
			$("#btn-toggle-map").text("<");
			$("#map").hide();
			$("#result-container").attr("class","col-xs-12 col-md-12 pull-left");
			$('#datatable').width($('#resultdiv').width());
			dtable.draw();
			if (pushState)
				history.pushState(null, "", window.location.href.replace('&hideMap=true', '') + '&hideMap=true');
			//window.location = window.location.href.replace('&hideMap=true', '') + '&hideMap=true';
		}

		hideMap = !hideMap;
	};

	function searchToText () {
		var eras = ['...', 'während der <b>Antike</b>', 'während dem <b>Mittelalter</b>', 'während dem <b>Frühmittelatler</b>', 'während dem <b>Hochmittelalter</b>', 'während dem <b>Spätmittelalter</b>', 'während der <b>Neuzeit</b>', 'während der <b>frühen Neuzeit</b>', 'während des <b>Konfessionellem Zeitalters</b>', 'wärhend des <b>Absolutismus und der Aufklärung</b>', 'während der <b>Moderne</b>', 'vom <b>Alten zum Deutschen Reich</b>', 'wärhend des <b>Deutschen Reiches</b>', 'seit der <b>Bundesrepublik Deutschland</b>']
		var text = '<div>Ergebnisse der Suche "';
		if(person && person != "") {
			text += 'nach dem Namen <b>' + decodeURI(person) + '</b> ';
		}
		if(place && place != "") {
			var tmp = place;
			var status = 0;
			if(typeof place == 'string') {
				text += 'in <b>' + decodeURI(place) + '</b> ';
			} else {
				text += 'in dem <b>ausgewähltem Raum</b> ';
			}
		}
		if(era) {
			text += eras[era] + ' ';
		}
		if(begindate) {
			text += 'während dem <b>Jahre ' + decodeURI(begindate) + '</b> ';
		}
		if(enddate) {
			text += 'bis zum <b>Jahre ' + decodeURI(enddate) + '</b> ';
		}
		if(occ) {
			text += 'mit dem <b>Beruf ' + decodeURI(occ) + '</b>';
		}
		text += '"</div>'
		return text;
	};

	function processData (data) {
		fillTable(data);
		//Add Marker for Birth, Death and Activity
		$.each(data, function (index, dat) {
			wkt = dat.placeOfBirth_geom;
			if(wkt) {
				cd = wkt[0].split("POINT(");
				cd = cd[1].split(")");
				cd = cd[0].split(" ");
				lat = cd[1];
				lng = cd[0];
				map.addMarker(lat, lng, dat.placeOfBirth, "birth", dat.id, dat.preferredNameForThePerson);
			}
			wkt = dat.placeOfDeath_geom;
			if(wkt) {
				cd = wkt[0].split("POINT(");
				cd = cd[1].split(")");
				cd = cd[0].split(" ");
				lat = cd[1];
				lng = cd[0];
				map.addMarker(lat, lng, dat.placeOfDeath, "death", dat.id, dat.preferredNameForThePerson);
			}
			wkt = dat.placesOfActivity_geom;
			if(wkt) {
				$.each(wkt, function (index) {
					cd = wkt[index].split("POINT(");
					cd = cd[1].split(")");
					cd = cd[0].split(" ");
					lat = cd[1];
					lng = cd[0];
					map.addMarker(lat, lng, dat.placesOfActivity[index], "activity", dat.id, dat.preferredNameForThePerson);
				});
			}
		});
		map.addMarkerLayer(placeType);
		map.showLegend();
		$('#search_text_field').html(searchToText());
	};

	function clearTable () {
		$('#result_text').html('');
	};

	window.onpopstate = function(event) {
    	if(event) {
			hideMap = Boolean(getParam('hideMap'));
			toggleMap(false);
			showDetailsGNDid = getParam('showDetails')
			$('#datatable').find('tr').each (function() {
				var tr = $(this).closest('tr');
				var td = $('td.details-control', tr);
		       	var row = dtable.row( tr );
		        if ( row.child.isShown() ) {
		            // This row is already open - close it
		            row.child.hide();
		            //history.pushState(null, "", window.location.href.replace('&showDetails=' + gndID, ''));
		            //map.undoHighLight();
		            //map.showMarkers();
		            td.removeClass('shown');
		            tr.removeClass('shown');
		        }
			});
			$('#datatable').find('tr').each (function() {
				var tr = $(this).closest('tr');
				var td = $('td.details-control', tr);
		       	var row = dtable.row( tr );
		       	var gndID = $('td.gndid', tr).text();
		        if ( showDetailsGNDid == gndID) {
		            details.load(gndID, row);        		     
		            //history.pushState(null, "", window.location.href.replace('&showDetails=' + gndID, '') + '&showDetails=' + gndID);
		            td.addClass('shown');
		            tr.addClass('shown');
		        }
			});
    	}
	};

	function removeShowDetails() {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == 'showDetails') {
				query = query.replace('&showDetails=' + pair[1], '');
			}
		}
		return query;
	};

	function exportSelection (format) {
		var returnData ={
			person : []
		};
		if(format == 'json') {
			if(selectedAll || selection.length != 0) {
				var key;
				var result = [];
				for(key in selection) {
					result.push($.grep(allData, function(e){ return e.id == key; })[0]);
				}
				$.each(result, function (index, data) {
					var key;
					var person = {};
					for(key in data) {
						person[key] = data[key];
					}
					returnData.person.push(person);
				});
				return JSON.stringify(returnData);
			} else {
				return null;
			}
		}
	}

	function printSelection () {
		function variableToText (variable) {
			var mapNames = [
				{variable: 'preferredNameForThePerson', text: 'Bevorzugter Name'}, 
				{variable: 'variantNameForThePerson', text: 'Abweichende Namen'}, 
				{variable: 'dateOfBirth', text: 'Geburtsdatum'}, 
				{variable: 'dateOfDeath', text: 'Sterbedatum'}, 
				{variable: 'periodOfActivity', text: 'Wirkungszeitraum'}, 
				{variable: 'placeOfBirth', text: 'Geburtsort'}, 
				{variable: 'placeOfDeath', text: 'Sterbeort'}, 
				{variable: 'placesOfActivity', text: 'Wirkungsort(e)'}, 
				{variable: 'professionsOrOccupations', text: 'Beruf(e) / Funktion(en)'}, 
				{variable: 'biographicalOrHistoricalInformation', text: 'Biograph. Anmerkungen'}, 
				{variable: 'familialRelationship', text: 'Beziehungen zu anderen Personen'}, 
				{variable: 'affiliation', text: 'Beziehung zu Körperschaften'}
			];
			var text = null;
			$.each(mapNames, function (index, value) {
				if(variable == value.variable) {
					text = value.text;
				}
			});
			return text;
		};

		var returnData = '<br> ---------------------------------------- <br>';
		if(selectedAll || selection.length != 0) {
			var key;
			var result = [];
			for(key in selection) {
				result.push($.grep(allData, function(e){ return e.id == key; })[0]);
			}
			$.each(result, function (index, data) {
				var key;
				for(key in data) {
					var _key = variableToText(key);
					if(_key) {
						returnData += '<b>' + _key + '</b>: ' + data[key] + '<br>';
					}	
				}
				returnData += '<br> ---------------------------------------- <br>';
			});
			return returnData;
		} else {
			return null;
		}	
	};

	function fillTable (data) {
		clearTable();
		$("#pagesContainer").show();
		$("#resultsPerPageContainer").show();
		$hline.append($('<th class="select-all"></th>').html('<b>Alle <br> <input class="select-all" type="checkbox"></b>') );
		$hline.append($("<th></th>").html( "<b>Name</b>" ) );
		$hline.append($("<th></th>").html("<b>Geb. Ort</b>"));
		$hline.append($("<th></th>").html("<b>Ster. Ort</b>"));
		$hline.append($("<th></th>").html("<b>Geb. Datum</b>"));
		$hline.append($("<th></th>").html("<b>Ster. Datum</b>"));
		$hline.append($("<th></th>").html("<b>Beruf</b>"));
		$hline.append($("<th style=\"display:none;\"></th>").html("<b>GND ID</b>"));
		$hline.append($("<th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\"></th>").html(""));
		$head.append($hline);
		$table.append($head);
		$.each(data, function (index, dat) {
			var $bline = $( "<tr></tr>" );
			$bline.append( $( '<td></td>' ).html( '<input class="select-person" id="cb_' + dat.id + '" type="checkbox">' ) );
			$bline.append( $( "<td></td>" ).html( dat.preferredNameForThePerson ) );
			$bline.append( $( "<td></td>" ).html( dat.placeOfBirth ) );
			$bline.append( $( "<td></td>" ).html( dat.placeOfDeath ) );
			// Dates
			$bline.append( $( "<td></td>" ).html( details.dateFormat(dat.dateOfBirth) ) );
			$bline.append( $( "<td></td>" ).html( details.dateFormat(dat.dateOfDeath) ) );	
			var occ = "";
			if(dat.professionsOrOccupations) {
				$.each(dat.professionsOrOccupations, function (index) {
					if(occ != "") {
						occ += ", "
					}
					occ += dat.professionsOrOccupations[index];
				});
			}
			$bline.append( $( "<td></td>" ).html( occ ) );
			$bline.append( $( "<td class=\"gndid\" style=\"display:none;\"></td>" ).html( dat.id ) );	
			$bline.append( $( "<td class=\"details-control\"></td>" ).html('') );
			$body.append( $bline );
		});
		$table.append($body);
		$table.appendTo( $( "#resultdiv" ) );
		dtable = $("#datatable").DataTable( 
			{
			    "oLanguage": {
			      	"sSearch": "Ergebnisse filtern:",
			      	"sInfo": "Ergebnisse _START_ bis _END_ von _TOTAL_",
			      	"sNext": "Nächste",
			      	"sPrevious": "Vorherige",
			      	"sLengthMenu": 'Anzeigen <select>'+
						'<option value="10">10</option>'+
						'<option value="25">25</option>'+
						'<option value="50">50</option>'+
						'<option value="100">100</option>'+
						'<option value="-1">Alle</option>'+
						'</select>'
			    },
		  	} 
	  	);
		dtable.draw();
		$('#datatable tbody').on('click', 'td.details-control', function () {
			var td = $(this);
	        var tr = $(this).closest('tr');
	       	var row = dtable.row( tr );
	       	var gndID = $('td.gndid', tr).text();
	        if ( row.child.isShown() ) {
	        	map.undoHighLight(gndID);
	        	map.focusOnMarker();
	            // This row is already open - close it
	            row.child.hide();
	            history.pushState(null, "", window.location.origin +
	            	window.location.pathname + '?' +
	            	removeShowDetails());
	            td.removeClass('shown');
	            tr.removeClass('shown');
	        }
	        else {
	        	// Close all
	        	$('#datatable').find('tr').each (function() {
				var tr = $(this).closest('tr');
				var td = $('td.details-control', tr);
		       	var row = dtable.row( tr );
		        if ( row.child.isShown() ) {
		            // This row is already open - close it
		            row.child.hide();
		            //history.pushState(null, "", window.location.href.replace('&showDetails=' + gndID, ''));
		            td.removeClass('shown');
		            tr.removeClass('shown');
		        }
			});
	            // Open this row
        		//Load Details
        		map.focusOnSpecificMarker(gndID);
        		map.highLight(gndID);
        		details.load(gndID, row);        		 
	            history.pushState(null, "", window.location.origin +
	            	window.location.pathname + '?' +
	            	removeShowDetails() +
	            	'&showDetails=' + gndID);
	            td.addClass('shown');
	            tr.addClass('shown');
	        }
    	} );
		$('#datatable thead').on('click', 'input.select-all', function () {
			if(selectedAll) {
				$.each(dtable.rows().data(), function (index) {
					id = dtable.row(index).data()[0].split('id="')[1];
					id = id.split('"')[0];
					if(document.getElementById(id)) {
						document.getElementById(id).checked = false;
					}
				});
				selection = [];
				selectedAll = false;
			} else {
				$.each(dtable.rows().data(), function (index) {
					id = dtable.row(index).data()[0].split('id="')[1];
					id = id.split('"')[0];
					if(document.getElementById(id)) {
						document.getElementById(id).checked = true;
					}
					id = id.split('cb_')[1];
					selection[id] = id;
				});
				selectedAll = true;
			}
		} );
		$('#datatable tbody').on('click', 'input.select-person', function () {
			_id = this.id.split("cb_")[1];
			if(selection[_id]) {
				index = selection.indexOf(_id);
				if(index > -1){
					selection.splice(index, 1);
				}
			} else {
				selection[_id] = _id;
			}
		} );
	};


	/*** Events
	*
	*/
	$("#map").on('link-clicked', function (e, id) {
		dtable.search(id);
		dtable.draw();
		$.each(dtable.rows().data(), function (index) {
			if(dtable.row(index).data()[7] == id) {
				details.load(id, dtable.row(index));
			}
		});
	});

	$('#exportButton').on('click', function (e) {
		var _export = exportSelection('json');
		var data = "data:Application/octet-stream;text/json;filename=persons.json;charset=utf-8," + encodeURIComponent(_export);
		window.open(data, 'persons.json');
	});

	$('#printButton').on('click', function (e) {
		var printWin = window.open('','','left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status  =0');
		printWin.document.write(printSelection());
		printWin.document.close();
		printWin.focus();
		printWin.print();
		printWin.close();
	});

	$("#btn-toggle-map").click(function (e) {
		toggleMap(true);	
	});

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
		}
		window.location = newURL;
	});

	/*** Function calls
	*
	*/

	map.addTileLayer(tilelayer);
	
	query.setRows("99999");

	if(core && core != "") {
		query.setCore(core);
		if(core == "gnd3") {
			$('#coreSelector')[0].selectedIndex = 0;
		}
	}

	if(person && person != "") {
		query.setPerson(person);
	}
	
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

	hideMap = Boolean(getParam('hideMap'));

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
	var era = getParam('era');
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

	$.getJSON(query.buildURL(), function(result){
		processData(result.response.docs);
		allData = result.response.docs;

		toggleMap(false);	
    });	
	
});
