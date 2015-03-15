var Map = L.Map.extend({
	/***Variables
	*
	*
	*/

	//Store drawn Shapes in this layer
	regionLayer: new L.FeatureGroup(),
	// store marker for cities with information about persons
	cities : [],

	person_city_map: [],
	//initialize layers control
	layersControl: L.control.layers(),
	//Store if a shape is drawn
	isDrawn: false,
	//Store marker in an object of arrays
	markerArray: {
		birth: [],
		death: [],
		activity: []
	},

	selection: {
		birth: null,
		death: null
	},

	selection_removed: {
		birth: null,
		death: null
	},

	placeType: null,

	/***Methods
	*
	*
	*/

	/** Add a Tilelayer to the map
	*
	*/
	addTileLayer: function (tileLayer) {
		tileLayer.addTo(this);
	},

	/** Add Leaflet Draw to the map
	*
	*/
	initLeafletDraw: function () {	
		this.addLayer(this.regionLayer);
		//Add drawn Layers
		this.on('draw:created', function (e) {
			this.regionLayer.clearLayers();
			var layer = e.layer;
			this.regionLayer.addLayer(layer);
			this.isDrawn = true;
			var that = this;
		});
		//Delete drawn layers
		this.on('draw:deleted', function () {
			isDrawn = false;
		});

		/*Leaflet draw Options for Toolbar*/
		var drawControlOptions = ({
			position: 'topleft',
			draw: {
				rectangle: {
					shapeOptions: {
						color: 'blue'
					}
				},
				marker: false,
				polyline: false,
				circle: {
					shapeOptions: {
						color: 'blue'
					}
				},
				polygon: {
					shapeOptions: {
						color: 'blue'
					},
					allowIntersection: false,
					drawError: {
						color: 'orange',
						timeout: 1000
					},
					showArea: true,
					metric: true,
					repeatMode: true
				}
			},
			edit: {
				featureGroup: this.regionLayer
			}
		});

		//Leaflet draw Toolbar
		var drawControl = new L.Control.Draw(drawControlOptions).addTo(this);
	},

	/** Return custom object of drawn shape to process it
	*
	*/
	returnPolygonShape: function () {
		if (this.isDrawn) {
			var spatial = this.regionLayer;
			
			//geom = {type:"Circle", wkt:"Point(x y)", radius:r}
			//or
			//geom = {type:"Polygon", wkt:"Polygon((x y, x y, x y, x y))"}
			geom = {};
			//If the drawn Shape is a Circle
			if(spatial.toGeoJSON().features[0].geometry.type == 'Point') {
				lat = spatial._layers[Object.keys(spatial._layers)[0]]._latlng.lat;
				lng = spatial._layers[Object.keys(spatial._layers)[0]]._latlng.lng;
				rad = spatial._layers[Object.keys(spatial._layers)[0]]._mRadius / 1000;

				//rad: km to degree
				rad = rad / 40000 * 360;

				geom = {
					type: "Circle",
					coordinates: lat + "," + lng ,
					radius: rad
				};
			} else {

				//If the drawn Shape is no Circle. Then it is a Polygon
				spatial = spatial.toGeoJSON().features[0];
				coordinates = spatial.geometry.coordinates[0];
				wkt = 'POLYGON((';
				$.each(coordinates, function (index, latlng) {
					if(index != 0) {
						wkt += ',';
					}
					wkt += latlng[0] + ' ' + latlng[1];
				});
				wkt += '))';
				geom = {
					type: "Polygon",
					wkt: wkt
				};
			}

			geom = JSON.stringify(geom);
			return geom;
		} else {
			return null;
		}
	},

	/** Add a marker to a layer by its type
	*
	*/
	addMarker: function (lat, lng, city, type, id, pname) {
		if(!this.person_city_map[id]) {
			this.person_city_map[id] = [];
		}
		this.person_city_map[id].push(city);

		if(!this.cities[city]) {
			var _city = {
				name: city,
				count: 0,
				stats: [0, 0, 0],
				birth: [],
				death: [],
				activity: [],
				latlng: [lat, lng],
				color: 'white',
				marker: null
			};
			this.cities[city] = _city;
		}

		switch(type) {
		    case 'birth':
		        this.cities[city].birth[id] = {id: id, name: pname};
		        this.cities[city].stats[0] ++;
		        break;
		    case 'death':
		        this.cities[city].death[id] = {id: id, name: pname};
		        this.cities[city].stats[1] ++;
		        break;
		    case 'activity':
		    	this.cities[city].activity[id] = {id: id, name: pname};
		    	this.cities[city].stats[2] ++;
		    	break;
		}
		this.cities[city].count ++;
		this.cities[city].latlng = [lat,lng];
	},

	highLight: function (id) {
		var that = this;
		_cities = this.person_city_map[id];
		$.each(_cities, function (index) {
			that.cities[_cities[index]].color = 'orange';
			that.showMarkers(_cities[index]);
		});
	},

	undoHighLight: function (id) {
		var that = this;
		_cities = this.person_city_map[id];
		$.each(_cities, function (index) {
			that.cities[_cities[index]].color = 'white';
			that.showMarkers(_cities[index]);
		});
		
	},

	/** Add all layer of marker to the map. Display them.
	*
	*/
	addMarkerLayer: function (placeType) {
		this.placeType = placeType;		
		this.showMarkers();
	},

	hideMarkers: function () {
		var that = this;
		if(this.placeType) {
			$.each(this.placeType, function (index) {
				if(that.placeType[index] == 'Birth') {
					that.removeLayer(that.birthplaces);
				} else if(that.placeType[index] == 'Death') {
					that.removeLayer(that.deathplaces);
				}else if(that.placeType[index] == 'Activity') {
					that.removeLayer(that.activityplaces);
				}
			});	
		} else {
			this.removeLayer(this.birthplaces);
			this.removeLayer(this.deathplaces);
			this.removeLayer(this.activityplaces);
		}
		if(this.selection.birth) {
			this.removeLayer(this.selection.birth);
		}
		if(this.selection.death) {
			this.removeLayer(this.selection.death);
		}
	},

	showMarkers: function (_city) {
		var city;
		for(city in this.cities) {
			if(_city) {
				if(city != _city) {
					break;
				}
			}
			var size = 44;
			var count = this.cities[city].count;
			if(count < 10) {

			} else if (count < 50) {
				size = size + 22;
			} else{
				size = size + 44
			}
			var icon = new MarkerIcon({iconSize: new L.Point(size, size), middleColor: this.cities[city].color});
			icon.stats = this.cities[city].stats;
            icon.population = this.cities[city].count;
			this.cities[city].marker = new L.marker(this.cities[city].latlng, {icon: icon});

			var _popupid = 'popup-' + city.replace(/ /g, '').replace(",", "").replace("<", "").replace(">", "").replace(")", "").replace("(", "");
			var person;
			var content = '<div style="width:100%;" id="' + _popupid + '">';
			content += '<b>Stadt: ' + city + '</b>';
			content += '<ul>';
			content += '<li><a href="#tabs-1">Geboren(' + this.cities[city].stats[0] + ')</a></li>';
			content += '<li><a href="#tabs-2">Gestorben(' + this.cities[city].stats[1] + ')</a></li>';
			content += '<li><a href="#tabs-3">Gewirkt(' + this.cities[city].stats[2] + ')</a></li>';
			content += '</ul>';
			content += '<div id="tabs-1">';
			for(person in this.cities[city].birth) {
				person = this.cities[city].birth[person];
				var action = '$(document).trigger(\"link-clicked\");';
				content += '<a href="#" id="b' + person.id + '">' + person.name + '</a>';
				content += '<br>';
			}
			content += '</div>';
			content += '<div id="tabs-2">';
			for(person in this.cities[city].death) {
				person = this.cities[city].death[person];
				content += '<a href="#" id="d' + person.id + '">' + person.name + '</a>';
				content += '<br>';
			}
			content += '</div>';
			content += '<div id="tabs-3">';
			for(person in this.cities[city].activity) {
				person = this.cities[city].activity[person];
				content += '<a href="#" id="a' + person.id + '">' + person.name + '</a>';
				content += '<br>';
			}
			content += '</div>';
			content += '</div>';

			_popupid = '#' + _popupid;

			this.cities[city].marker.popupid = _popupid;
			this.cities[city].marker.firstopen = true;
			this.cities[city].marker.bindPopup(content);

			this.cities[city].marker.on('popupopen', function(e) {
				e.popup.options.maxWidth = 450;
				e.popup.options.minWidth = 400;
				e.popup.options.maxHeight = 200;

				innerHTML = this._popup._contentNode.innerHTML;
					//birth
					tmp = innerHTML.split('<div id="tabs-1">')[1].split('</div>')[0];
					tmp = tmp.split('<a href="#" id="');
					$.each(tmp, function (index) {
						if(index != 0) {
							id = tmp[index].split('"')[0];
							var _id = id.split("b")[1].toString();
							$("#" + id).click(function () {
								$("#map").trigger('link-clicked', [_id]);
							});

						}
					});
					
					//death
					tmp = innerHTML.split('<div id="tabs-2">')[1].split('</div>')[0];
					tmp = tmp.split('<a href="#" id="');
					$.each(tmp, function (index) {
						if(index > 0) {
							id = tmp[index].split('"')[0];
							var _id = id.split("d")[1].toString();
							$("#" + id).on('click', function () {
								$("#map").trigger('link-clicked', [_id]);
							});
						}
					});

					//activity
					tmp = innerHTML.split('<div id="tabs-3">')[1].split('</div>')[0];
					tmp = tmp.split('<a href="#" id="');
					$.each(tmp, function (index) {
						if(index > 0) {
							id = tmp[index].split('"')[0];
							var _id = id.split("a")[1].toString();
							$("#" + id).on('click', function () {
								$("#map").trigger('link-clicked', [_id]);
							});
						}
					});

				if(this.firstopen) {
					this.firstopen = false;
					this.closePopup();
					this.openPopup();
				}
				$(this.popupid).tabs();
			});
			this.addLayer(this.cities[city].marker);
		}
	},

	showLegend: function () {
		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        colors = ['#00FF00', '#FF0000', '#FFFF00'],
		        labels = ['Geburtsort', 'Sterbeort', 'Wirkungsort'];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    var inner = '<div style="background-color:#FFFFFF; border: 2px solid;"><b>Legende</b>';
		    inner += '<div style="margin-top:5px;">'
		    for (var i = 0; i < colors.length; i++) {	
		        inner += '<div style="background-color:' + colors[i] + '"><b>' + labels[i];
		        inner += '</b></div>'; 
		    }
		    inner += '</div></div>'
		    div.innerHTML = inner;

		    return div;
		};
		legend.addTo(this);
	},

	drawShape: function (wkt, type) {
		if(type == "Polygon") {
			tmp = wkt.split("POLYGON((");
			tmp = tmp[1].split("))");

			coordinates = tmp[0].split(",");

			polygonPoints = [];
			$.each(coordinates, function (index) {
				coordinate = coordinates[index].split(" ");
				lat = coordinate[1];
				lng = coordinate[0];
				polygonPoints.push(new L.LatLng(lat, lng));
			});

			var polygon = new L.Polygon(polygonPoints);
			polygon.addTo(this.regionLayer);
        	this.addLayer(polygon);  
        	this.isDrawn = true;   
			

		} else if (type == "Circle") {
			tmp = wkt.split("CIRCLE(");
			tmp = tmp[1].split(")");
			tmp = tmp[0].split(" d=");
			coordinates = tmp[0].split(",");
			lat = coordinates[0]
			lng = coordinates[1]
			rad = tmp[1];

			//rad: degree to m
			rad = rad * 40000 / 360 * 1000;

			var circle = new L.Circle(new L.LatLng(lat, lng), rad);
			circle.addTo(this.regionLayer);
         	this.addLayer(circle);
         	this.isDrawn = true; 
		}
	}

});
