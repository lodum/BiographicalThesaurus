var Suggester = function() {
	this.basePath = "http://giv-lodum.uni-muenster.de:8983/solr/";
	this.core = "collection1";
	this.rows = "0";
	this.field = null;
	this.facetMincount = 1;
	this.searchTerm = null;
};

Suggester.prototype.setCore = function (core) {
	this.core = core;
}

Suggester.prototype.setField = function (field) {
	this.field = field;
}

Suggester.prototype.setSearchTerm = function (term) {
	this.searchTerm = term;
}

/** This function right now is not beeing used. Used before to execute a query and trigger an event after the response got recieved
*
*/
Suggester.prototype.execute = function () {
	$.getJSON(this.buildURL(), function(result){
		$(this).trigger('gotData', [result.response.docs]);
    });
};

/** Build a URL to query SOLR by the parameters stored in this object
*
*/
Suggester.prototype.buildURL = function () {
	//Add URL and desired Core
	url = this.basePath + this.core + '/select?'; 
	url += 'q=*:*';
	url += '&rows=' + this.rows;
	url += '&facet=true&facet.field=' + this.field;
	url += '&facet.mincount=' + this.facetMincount;
	url += '&facet.prefix=' + this.searchTerm
	url += '&wt=json&json.wrf=?&indent=true'
	return url;
};
