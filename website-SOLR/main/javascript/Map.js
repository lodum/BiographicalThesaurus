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
			divicon = new L.DivIcon({ 
	        	html: '<div><span>' + childCount + '</span></div>', 
	        	className: 'marker-cluster marker-cluster-birth', 
	        	iconSize: new L.Point(40, 40) 
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
	        divicon = new L.DivIcon({ 
	        	html: '<div><span>' + childCount + '</span></div>', 
	        	className: 'marker-cluster marker-cluster-death', 
	        	iconSize: new L.Point(40, 40) 
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

	        className = 'marker-cluster-activity marker-cluster-xs'      

	        divicon = new L.DivIcon({ 
	        	html: '<div><span>' + childCount + '</span></div>', 
	        	className: className, 
	        	iconSize: new L.Point(40, 40) 
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
				rectangle: true,
				marker: false,
				polyline: false,
				circle: true,
				polygon: {
					shapeOptions: {
						color: 'purple'
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
				geom = {
					type: "Circle",
					wkt: "Point(" + lat + " " + lng + ")",
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
				wkt += ')))';
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
			var marker = new L.Marker([lat,lng], {color: 'green', fillOpacity: 2});
			marker.bindPopup(new L.popup().setContent("<div><b>" + name + "</b></div>"));
			this.markerArray.birth[id] = marker;
			this.birthplaces.addLayer(this.markerArray.birth[id]);
		} else if (type == "death") {
			var marker = new L.Marker([lat,lng], {color: 'red', fillOpacity: 2});
			marker.bindPopup(new L.popup().setContent("<div><b>" + name + "</b></div>"));
			this.markerArray.death[id] = marker;
			this.deathplaces.addLayer(this.markerArray.death[id]);
		} else if (type == "activity") {
			var marker = new L.Marker([lat,lng], {color: 'blue', fillOpacity: 2});
			marker.bindPopup(new L.popup().setContent("<div><b>" + name + "</b></div>"));
			this.markerArray.activity[id] = marker;
			this.activityplaces.addLayer(this.markerArray.activity[id]);
		}
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
	addMarkerLayer: function () {
		//add the places layers to store results
		this.layersControl.addOverlay(this.birthplaces, 'Birth');
		this.addLayer(this.birthplaces);
		this.layersControl.addOverlay(this.deathplaces, 'Death');
		this.addLayer(this.deathplaces);
		this.layersControl.addOverlay(this.activityplaces, 'Activity');
		this.addLayer(this.activityplaces);

		this.addControl(this.layersControl);
	},

	showMiniMap: function () {
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data &copy; OpenStreetMap contributors';
		var minimapLayer = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib});
		var miniMap = new L.Control.MiniMap(minimapLayer, {toggleDisplay:true, zoomLevelFixed:10}).addTo(this);
	}

});
