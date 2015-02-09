var details = new function() {

	this.load = function(gndID, row) {

       	var solrQueryUrl = 'http://giv-lodum.uni-muenster.de:8983/solr/gnd/select?q=id:' + gndID + '&wt=json&json.wrf=?&indent=true';	

 		$.getJSON(solrQueryUrl, function(result){
			
			var table = details.getDetailTable(gndID, result.response.docs[0]);
			row.child(table).show();

			details.loadDetailImg(gndID);			
			
	    });
	};

	this.getDetailTable = function (gndID, person) {
		
		var daten = '';

		daten += '<table class="personDetails" style="width:100%">' +
				 '<tr><td align="right" style="width:120px">Name : </td><td>' + person.preferredNameForThePerson + '</td>' +
				 '<td rowspan="12" style="width:150px; vertical-align:top;"><div id="img' + gndID + '" style="text-align:right;"></div></td></tr>';
			
		daten += details.getDetailRow('Geburtsdatum', details.dateFormat(person.dateOfBirth));
		daten += details.getDetailRow('Geburtsort', person.placeOfBirth);

		daten += details.getDetailRow('Sterbedatum', details.dateFormat(person.dateOfDeath));
		daten += details.getDetailRow('Sterbeort', person.placeOfDeath);

		daten += '<tr><td>&nbsp;</td><td></td></tr>';

		daten += details.getDetailReferenceRow('D-NB', person.id, person.id);
		daten += details.getDetailReferenceRow('Wikipedia', person.wikipedia, person.wikipedia);

		daten += '<tr style="height:auto;"><td>&nbsp;</td></tr>' +
				 '</table>';

		return daten;
	};

	this.loadDetailImg = function (gndID) {

		var dnbQueryUrl = 'http://hub.culturegraph.org/entityfacts/' + gndID;

		$.getJSON(dnbQueryUrl, function(dnbResult){
			
			if (dnbResult != undefined && dnbResult.person != undefined && dnbResult.person.depiction != undefined) {
				var imgURL = dnbResult.person.depiction.thumbnail;

				if (imgURL != undefined)
					$('#img' + gndID).html("<img width=\"100%\" src=\"" + imgURL + "\"/><br>Quelle: Wikimedia");
			};

		}).always(function() {
   			
  		});
	};

	this.getDetailRow = function(key, value) {

		if (value != undefined && value != '')
			return '<tr><td align="right">' + key + '&nbsp;:</td><td>' + value + '</td></tr>';
		else
			return '';
	};

	this.getDetailReferenceRow = function(key, linkValue, textValue) {

		if (linkValue != undefined && linkValue != '' && textValue != undefined && textValue != '')
			return '<tr><td align="right">' + key + '&nbsp;:</td><td>' + '<a href="' + linkValue + '">' + textValue + '</a>' + '</td></tr>';
		else
			return '';
	};

	this.dateFormat = function(date) {
		
		if (date != undefined) {
			
			var fDate = '';

			if (date.length == 10)
				fDate = date.substring(8, 10) + '.' + date.substring(5, 7) + '.' +  date.substring(0, 4);
			else
				fDate = date;	

			return fDate;
		}
		else {
			
			return '';
		}
	};
};