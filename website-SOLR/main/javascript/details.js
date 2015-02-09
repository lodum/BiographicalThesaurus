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
				 '<tr><td><b>Biogramm</b></td></tr>' +
				 '<tr><td style="width:120px">Name : </td><td>' + person.preferredNameForThePerson + '</td>' +
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

		daten += '<div id="litrature' + gndID + '"></div>'

		details.loadLitrature(gndID);

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
			return '<tr><td>' + key + '&nbsp;:</td><td>' + value + '</td></tr>';
		else
			return '';
	};

	this.getDetailReferenceRow = function(key, linkValue, textValue) {

		if (linkValue != undefined && linkValue != '' && textValue != undefined && textValue != '')
			return '<tr><td>' + key + '&nbsp;:</td><td>' + '<a href="' + linkValue + '" target="_blank">' + textValue + '</a>' + '</td></tr>';
		else
			return '';
	};

	this.loadLitrature = function(gndID) {
		
		var lobidURL = "http://lobid.org/resource?subject=" + gndID;

		$.ajax({
			url : lobidURL,
			dataType : "jsonp",
			async : false,
			data : {
				format : "full"
			},
			success : function(data) {
				if ($.isArray(data)) {

					var resources = data;
					
					var litArray = [];

					for (var i = 0; i < resources.length; i++) {
						
						var resource = resources[i];
						if (resource['@graph'] != undefined) {

							var resourceData = resource['@graph']
							var resourceDetails = resourceData[resourceData.length -1];

							if (resourceDetails.title != undefined) {
								var litAuthors = [];
								var litContributors = [];

								if (resourceDetails.creator != undefined) {
									for (var j = 0; j < resourceData.length; j++) {
										if (resourceDetails.creator.indexOf(resourceData[j]['@id']) > -1)
											litAuthors.push( {name : resourceData[j].preferredName,
															nameID : resourceData[j]['@id']
														});
									};
								};
								if (resourceDetails.contributor != undefined) {
									for (var j = 0; j < resourceData.length; j++) {
										if (resourceDetails.contributor.indexOf(resourceData[j]['@id']) > -1)
											litContributors.push( {name : resourceData[j].preferredName,
															nameID : resourceData[j]['@id']
														});
									};
								};

								litArray.push( { title : resourceDetails.title,
												 titleID : resourceDetails['@id'],
												 year : resourceDetails.issued,
												 authors : litAuthors,
												 contributors : litContributors
											});
							};
						};
					};

					litArray.sort(function(a, b){return a.title.localeCompare(b.title);});
					
					if (litArray.length > 0) {
						litTable = '<table class="litratureTable" style="width:100%">' +
								   '<tr><td><b>Literatur</b></td></tr>';

						$.each( litArray, function( i, lit ){
							litTable += '<tr><td>';
							litTable += '<a href="' + lit.titleID + '" target="_blank">' + lit.title + '</a>';

							if ((lit.authors != undefined && lit.authors.length > 0) || (lit.contributors != undefined && lit.contributors.length > 0))
								litTable += ' - ';

							if (lit.authors != undefined && lit.authors.length > 0) {
								
								$.each( lit.authors, function( i, auth ){
									litTable += ' <a href="' + auth.nameID + '" target="_blank">' + auth.name + '</a>;';
								});
							};

							if (lit.contributors != undefined && lit.contributors.length > 0) {
								
								$.each( lit.contributors, function( i, cont ){
									litTable += ' <a href="' + cont.nameID + '" target="_blank">' + cont.name + '</a>;';
								});
							};

							if (lit.year != undefined)
								litTable += ' (' + lit.year + ')';

							litTable += '</td></tr>';
						});

						litTable += '</table>';

						$('#litrature' + gndID).html(litTable);
					};
					
					//console.log(litTable);
				};
			}
		});
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