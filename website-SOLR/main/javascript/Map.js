var Map = L.Map.extend({
	/***Variables
	*
	*
	*/

	//Store drawn Shapes in this layer
	regionLayer: new L.FeatureGroup(),
	// create a layer to display information about places of birth
	birthplaces: new L.MarkerClusterGroup({
		maxClusterRadius:3, 
		singleMarkerMode:true, 
		spiderfyDistanceMultiplier:2, 
		iconCreateFunction: function(cluster) {
	        var childCount = cluster.getChildCount();
	        var classname = "";
	        var size = null;
	        if(childCount == 1) {
	        	classname = "marker-cluster-s marker-cluster-birth";
	        	size = new L.Point(20, 20);
	        } else if(childCount < 10) {
	        	classname = "marker-cluster-m marker-cluster-birth";
	        	size = new L.Point(30, 30);
	        } else {
	        	classname = "marker-cluster-l marker-cluster-birth";
	        	size = new L.Point(40, 40);
	        }
	        divicon = new L.DivIcon({ 
		        	html: '<div><span>' + childCount + '</span></div>', 
		        	className: classname, 
		        	iconSize: size 
		        });
	        return divicon;
		}
	}),
	// create a layer to display information about places of death
	deathplaces: new L.MarkerClusterGroup({
		maxClusterRadius:3, 
		singleMarkerMode:true, 
		spiderfyDistanceMultiplier:2, 
		iconCreateFunction: function(cluster) {
	        var childCount = cluster.getChildCount();
	        var classname = "";
	        var size = null;
	        if(childCount == 1) {
	        	classname = "marker-cluster-s marker-cluster-death";
	        	size = new L.Point(20, 20);
	        } else if(childCount < 10) {
	        	classname = "marker-cluster-m marker-cluster-death";
	        	size = new L.Point(30, 30);
	        } else {
	        	classname = "marker-cluster-l marker-cluster-death";
	        	size = new L.Point(40, 40);
	        }
	        divicon = new L.DivIcon({ 
		        	html: '<div><span>' + childCount + '</span></div>', 
		        	className: classname, 
		        	iconSize: size 
		        });
	        return divicon;
		}
	}),
	// create a layer to display information about places of activity
	activityplaces: new L.MarkerClusterGroup({
		maxClusterRadius:3, 
		singleMarkerMode:true, 
		spiderfyDistanceMultiplier:2, 
		iconCreateFunction: function(cluster) {
	        var childCount = cluster.getChildCount();
	        var classname = "";
	        var size = null;
	        if(childCount == 1) {
	        	classname = "marker-cluster-s marker-cluster-activity";
	        	size = new L.Point(20, 20);
	        } else if(childCount < 10) {
	        	classname = "marker-cluster-m marker-cluster-activity";
	        	size = new L.Point(30, 30);
	        } else {
	        	classname = "marker-cluster-l marker-cluster-activity";
	        	size = new L.Point(40, 40);
	        }
	        divicon = new L.DivIcon({ 
		        	html: '<div><span>' + childCount + '</span></div>', 
		        	className: classname, 
		        	iconSize: size 
		        });
	        return divicon;
		}
	}),
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
	addMarker: function (lat, lng, name, type, id) {
		if(type == "birth") {
			var marker = new L.Marker([lat,lng]);
			this.markerArray.birth[id] = marker;
			this.birthplaces.addLayer(this.markerArray.birth[id]);
			var that = this;
			this.markerArray.birth[id].on('click', function (e) {
				$(that).trigger("marker_clicked", [id] );
			});
		} else if (type == "death") {
			var marker = new L.Marker([lat,lng]);
			this.markerArray.death[id] = marker;
			this.deathplaces.addLayer(this.markerArray.death[id]);
			var that = this;
			this.markerArray.death[id].on('click', function (e) {
				$(that).trigger("marker_clicked", [id] );
			});
		} else if (type == "activity") {
			var marker = new L.Marker([lat,lng]);
			this.markerArray.activity[id] = marker;
			this.activityplaces.addLayer(this.markerArray.activity[id]);
			var that = this;
			this.markerArray.activity[id].on('click', function (e) {
				$(that).trigger("marker_clicked", [id] );
			});
		}
	},

	highLight: function (id) {
		//add previous selection back to layer
		this.undoHighLight();		

		//get current selection
		this.selection_removed.birth = this.markerArray.birth[id];
		this.selection_removed.death = this.markerArray.death[id];
		

		//remove selection from normal layer
		//add selection as markers to map
		if(this.selection_removed.birth) {
			lat = this.selection_removed.birth._latlng.lat;
			lng = this.selection_removed.birth._latlng.lng;
			this.selection.birth = new L.Marker([lat,lng]);
			this.birthplaces.removeLayer(this.selection_removed.birth);
		}
		if(this.selection_removed.death) {
			lat = this.selection_removed.death._latlng.lat;
			lng = this.selection_removed.death._latlng.lng;
			this.selection.death = new L.Marker([lat,lng]);
			this.deathplaces.removeLayer(this.selection_removed.death);
		}
		//display new markers
		this.showMarkers();
	},

	undoHighLight: function () {
		this.hideMarkers();
		if(this.selection_removed.birth) {
			this.birthplaces.addLayer(this.selection_removed.birth);
		}
		if(this.selection_removed.death) {
			this.deathplaces.addLayer(this.selection_removed.death);
		}
		this.selection_removed.birth = null;
		this.selection_removed.death = null;
		this.selection.birth = null;
		this.selection.death = null;
	},

	/** Open a popup of a marker
	*
	*/
	openMarkerPopup: function (id) {
		bmarker = this.markerArray.birth[id];
		dmarker = this.markerArray.death[id];
		amarker = this.markerArray.activity[id];
		if(bmarker) {
			this.birthplaces.zoomToShowLayer(bmarker, function () {
				bmarker.openPopup();
			});
		}
	},

	/** Add all layer of marker to the map. Display them.
	*
	*/
	addMarkerLayer: function (placeType) {
		this.layersControl.addOverlay(this.birthplaces, 'Birth');
		this.layersControl.addOverlay(this.deathplaces, 'Death');
		this.layersControl.addOverlay(this.activityplaces, 'Activity');
		this.placeType = placeType;		
		this.showMarkers();
		this.addControl(this.layersControl);
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

	showMarkers: function () {
		var that = this;
		if(this.placeType) {
			$.each(this.placeType, function (index) {
				if(that.placeType[index] == 'Birth') {
					that.addLayer(that.birthplaces);
				} else if(that.placeType[index] == 'Death') {
					that.addLayer(that.deathplaces);
				}else if(that.placeType[index] == 'Activity') {
					that.addLayer(that.activityplaces);
				}
			});	
		} else {
			this.addLayer(this.birthplaces);
			this.addLayer(this.deathplaces);
			this.addLayer(this.activityplaces);
		}
		if(this.selection.birth) {
			this.addLayer(this.selection.birth);
		}
		if(this.selection.death) {
			this.addLayer(this.selection.death);
		}
	},

	showMiniMap: function () {
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data &copy; OpenStreetMap contributors';
		var minimapLayer = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib});
		var miniMap = new L.Control.MiniMap(minimapLayer, {toggleDisplay:true, zoomLevelFixed:10}).addTo(this);
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
		}
		console.log(this.regionLayer);
	}

});
