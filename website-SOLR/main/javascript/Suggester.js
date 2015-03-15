var Suggester = function() {
	this.basePath = "http://ubsvirt112.uni-muenster.de:8181/solr/";
	this.core = "collection1";
	this.rows = "999999";
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
	url = this.basePath + this.core + '/select?'; 
	url += 'q=*:*&rows=1&facet=true&facet.field=' + this.field + '&wt=json&json.wrf=?&indent=true';
	return url;
};
