/*
	Detail class - functions to load and display person details
*/
var details = new function() {

	// General load function
	this.load = function(gndID, row) {

       	var solrQueryUrl = 'http://ubsvirt112.uni-muenster.de:8181/solr/gnd3/select?q=id:' + gndID + '&wt=json&json.wrf=?&indent=true';	

 		$.getJSON(solrQueryUrl, function(result){
			
			var table = details.getDetailTable(gndID, result.response.docs[0]);
			row.child(table).show();
			$(row.child()).css("background-color", "#cccccc");

			details.loadDetailImg(gndID);			
			
	    });
	};

	// Detail table showing person attributes
	this.getDetailTable = function (gndID, person) {
		
		var daten = '';

		daten += '<p><b>Biogramm</b></p>' + 
				 '<table class="personDetails" style="background-color:#e3e9f0; width:100%">' +
				 '<tr><td style="width:120px; background-color:#e3e9f0;">Name : </td><td style="background-color:#e3e9f0;">' + person.preferredNameForThePerson + '</td>' +
				 '<td rowspan="12" style="width:150px; background-color:#e3e9f0; vertical-align:top;"><div id="img' + gndID + '" style="text-align:right;"></div></td></tr>';
			
		daten += details.getDetailRow('Geburtsdatum', details.dateFormat(person.dateOfBirth));
		daten += details.getDetailRow('Geburtsort', person.placeOfBirth);

		daten += details.getDetailRow('Sterbedatum', details.dateFormat(person.dateOfDeath));
		daten += details.getDetailRow('Sterbeort', person.placeOfDeath);

		daten += details.getDetailRow('Beruf(e)', person.professionsOrOccupations);

		daten += details.getDetailRow('Beziehungen zu Personen', person.familialRelationship);

		daten += details.getDetailRow('Weitere Angaben', person.biographicalOrHistoricalInformation);

		

		
		daten += '<tr style="background-color:#e3e9f0;"><td>&nbsp;</td><td></td></tr>';

		daten += details.getDetailReferenceRow('D-NB', person.gndIdentifier, person.gndIdentifier);
		daten += details.getDetailReferenceRow('Wikipedia', person.wikipedia, person.wikipedia);

		daten += '<tr style="height:auto; background-color:#e3e9f0;"><td>&nbsp;</td></tr>' +
				 '</table>';

		daten += '<div id="divref' + gndID + '"></div>'

		daten += '<div id="divauthor' + gndID + '"></div>'

		daten += '<div id="divsubject' + gndID + '"></div>'

		details.loadReferences(gndID);

		details.loadLitrature('author', gndID, 'Literatur Von');
		details.loadLitrature('subject', gndID, 'Literatur Über');

		return daten;
	};

	// Load the associated person image 
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

	// Load beacon references
	this.loadReferences = function(gndID) {
		
		var solrBeaconUrl = 'http://ubsvirt112.uni-muenster.de:8181/solr/beaconInfo/select?q=gndIdentifier:"http://d-nb.info/gnd/' + gndID + '"&wt=json&json.wrf=?&indent=true';	

 		$.getJSON(solrBeaconUrl, function(result){
			
			if (result.response.docs.length > 0) {
				
				var refs = '';

				refs += '<br><p><b>Referenzen</b></p>' + 
						'<table class="personDetails" style="background-color:#e3e9f0; width:100%">'

				for (var i = result.response.docs.length - 1; i >= 0; i--) {
					refs += '<tr><td style="background-color:#e3e9f0;">';
					refs += '<a href="' + result.response.docs[i].linkTarget + '" target="_blank">' + result.response.docs[i].linkDescription + '</a>';
					refs += '</td></tr>';
				};

				refs += '</table>'

				$('#divref' + gndID).html(refs);
			};
			
	    });
	};

	// Helper function to create a table row
	this.getDetailRow = function(key, value) {

		if (value != undefined && value != '')
			return '<tr style="background-color:#e3e9f0; vertical-align:top;"><td>' + key + '&nbsp;:</td><td>' + value + '</td></tr>';
		else
			return '';
	};

	// Helper function to create a table row with link attributes
	this.getDetailReferenceRow = function(key, linkValue, textValue) {

		if (linkValue != undefined && linkValue != '' && textValue != undefined && textValue != '')
			return '<tr style="background-color:#e3e9f0;"><td>' + key + '&nbsp;:</td><td>' + '<a href="' + linkValue + '" target="_blank">' + decodeURIComponent(textValue) + '</a>' + '</td></tr>';
		else
			return '';
	};

	// Litrature loading via lobid.org
	this.loadLitrature = function(target, gndID, title) {
		
		var lobidURL = "http://lobid.org/resource?" + target + "=" + gndID;

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

							var litTitle = '-';
							if (resourceDetails.title != undefined) {
								litTitle = resourceDetails.title;
							};

							var litYear = '';
							if (resourceDetails.issued != undefined) {
								litYear = resourceDetails.issued;
							};

							var litPublisher = '';
							if (resourceDetails.publisher != undefined) {
								litPublisher = resourceDetails.publisher;
							};
							

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

							litArray.push( { title : litTitle,
											 titleID : resourceDetails['@id'],
											 year : litYear,
											 authors : litAuthors,
											 contributors : litContributors,
											 publisher : litPublisher
										});
						};
					};

					//litArray.sort(function(a, b){return a.title.localeCompare(b.title);});
					
					if (litArray.length > 0) {
						litTable = '<br><p><b>' + title + '</b></p>' +
								   '<table id="lit' + target + gndID + '" class="litratureTable" >' + 
								   '<thead>' + 
						           		'<tr style="background-color:#e3e9f0;">'+
						           		'<th>Autor</th>' + 
						           		//'<th>Mitwirkende</th>' + 
						                '<th>Titel</th>' +
						                //'<th>Verlag</th>' +
						                '<th>Jahr</th></tr>' +
        							'</thead><tbody>';

						$.each( litArray, function( i, lit ){
							litTable += '<tr style="background-color:#e3e9f0;"><td>';

							if (lit.authors != undefined && lit.authors.length > 0) {
								
								$.each( lit.authors, function( i, auth ){
									litTable += ' <a href="' + auth.nameID + '" target="_blank">' + auth.name + '</a>;';
								});
							};

							// litTable += '</td><td>';

							// if (lit.contributors != undefined && lit.contributors.length > 0) {
								
							// 	$.each( lit.contributors, function( i, cont ){
							// 		litTable += ' <a href="' + cont.nameID + '" target="_blank">' + cont.name + '</a>;';
							// 	});
							// };

							litTable += '</td><td style="background-color:#e3e9f0;">';

							litTable += '<a href="' + lit.titleID + '" target="_blank">' + lit.title + '</a>';

							//litTable += '</td><td>';

							//litTable += lit.publisher;

							litTable += '</td><td>';

							litTable += lit.year;

							litTable += '</td></tr>';
						});

						litTable += '</tbody></table>';

						$('#div' + target + gndID).html(litTable);

						var dtablelit = $('#lit' + target + gndID).DataTable( {
					        "order": [[ 1, "asc" ]],
					        "bPaginate": false,
					        "bFilter": false,
					        "bInfo": false
					    } );
						dtablelit.draw();
					};
					
					//console.log(litTable);
				};
			}
		});
	};

	// Helper function to correctly format dates
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