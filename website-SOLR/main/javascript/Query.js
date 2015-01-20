var Query = function() {
	this.basePath = "http://giv-lodum.uni-muenster.de:8983/solr/";
	this.core = "collection1";
	this.rows = "20";
	this.spatial = null;
	this.results = null;
	this.person = null;
	this.start = null;
	this.end = null;
	this.activity = null;
	this.spatialField = null;
	this.queryReturn = [];
};

Query.prototype.setRows = function (rows) {
	this.rows = rows;
};

Query.prototype.setCore = function (core) {
	this.core = core;
};

Query.prototype.setResults = function (results) {
	this.results = results;
};

Query.prototype.setSpatial = function (spatial) {
	this.spatial = spatial;
};

Query.prototype.setSpatialField = function (spatialField) {
	this.spatialField = spatialField;
};

Query.prototype.setPerson = function (person) {
	this.person = person;
};

Query.prototype.setActivity = function (activity) {
	this.activity = activity;
};

Query.prototype.setStart = function (start) {
	this.start = start;
};

Query.prototype.setEnd = function (end) {
	this.end = end;
};

Query.prototype.setReturn = function (queryReturn) {
	this.queryReturn.push(queryReturn);
};

/** This function right now is not beeing used. Used before to execute a query and trigger an event after the response got recieved
*
*/
Query.prototype.execute = function () {
	$.getJSON(this.buildURL(), function(result){
		$(this).trigger('gotData', [result.response.docs]);
    });
};

/** Build a URL to query SOLR by the parameters stored in this object
*
*/
Query.prototype.buildURL = function () {
	//Add URL and desired Core
	url = this.basePath + this.core + '/'; 
	
	attributeUsed = false;
	
	srchstrng = "select?q=";
	
	if(this.person) {
		srchstrng += 'preferredNameForThePerson:' + this.person;
		attributeUsed = true;
	}
	if(this.activity) {
		if(attributeUsed) {
			srchstrng += ' AND ';
		}
		srchstrng += 'professionOrOccupation:' + this.activity;
		attributeUsed = true;
	}
	



	if(this.start) {
		if(this.end) {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			srchstrng += 'dateOfBirth:[' + this.start + ' TO ' + this.end + ']';
		} else {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			srchstrng += 'dateOfBirth:[' + this.start + ' TO NOW]';
		}
		attributeUsed = true;
	}else {
		if(this.end) {
			if(attributeUsed) {
				srchstrng += ' AND ';
			}
			srchstrng += 'dateOfBirth:[0 TO ' + this.end + ']';
			attributeUsed = true;
		}
		
	}
	
	
	


	var spatialUrl = "";

	//Add Spatial Restraints
	if(this.spatial) {

		//If the drawn Shape is a Circle (type= Point + Radius)
		if(this.spatial.type == 'Circle') {
			//Extract lat and lng from wkt
			wkt = this.spatial.wkt;
			tmp = wkt.split('Point(');
			tmp = tmp[1].split(')');
			tmp = tmp[0].split(' ');
			lat = tmp[0];
			lng = tmp[1];
			rad = this.spatial.radius;

			spatialUrl += '&fq={!geofilt sfield=' + this.spatialField + '_geom}&pt=' + lat + ',' + lng + '&d=' + rad;
		} else {
			if(this.spatial.type == 'Polygon') {
				//If the drawn Shape is no Circle. Then it is a Polygon (Polygon or Rectangle)
				spatialUrl += '&fq=' + this.spatialField + '_geom:"IsWithin(' + this.spatial.wkt + ' distErrPct=0"'
			}
			else {
				if(attributeUsed) {
					srchstrng += ' AND ';
				}
				srchstrng += this.spatialField + ":" + this.spatial;
				attributeUsed = true;
			}			
		}
	}



	if(!attributeUsed) {
		//Select All and Response all Fields
		srchstrng = 'select?q=*:*';
	}

	url += srchstrng;

	url += spatialUrl;



	if (this.queryReturn && this.queryReturn.length != 0) {
		url += '&fl=';
		var that = this;
		$.each(this.queryReturn, function (index) {
			if(index == 0) {
				url += that.queryReturn[index];
			} else {
				url += ',' + that.queryReturn[index];
			}
		});
	}
	url += '&rows=' + this.rows;
	url += '&wt=json&json.wrf=?&indent=true'
	return url;
};
