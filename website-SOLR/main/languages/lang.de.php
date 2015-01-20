<?php
/* 
-----------------
Language: German
-----------------
*/

$lang = array();

//Menu links:
$lang['MENU_HOME'] = 'Startseite';
$lang['MENU_SEARCH'] = 'Suchen';
$lang['MENU_RESULTS'] = 'Ergebnisse';
$lang['MENU_EXPLORE'] = 'Erkunden';
$lang['MENU_TAG'] = 'Tag Cloud';
$lang['MENU_SPARQL'] = 'SPARQL Endpunkt';

//home.php
$lang['STIS_LANGUAGE'] = '<meta http-equiv="language" content="de">';
$lang['STIS_PAGE_TITLE'] = 'Biographischer Thesaurus NRW';
$lang['STIS_HERO_HEADER'] = 'Willkommen';
$lang['STIS_HERO_TEXT'] = 'Dies ist der biographische Thesaurus NRW. Erkunden Sie die biographische Suche nach Personen, die in einer Verbindung zu Nordrhein-Westfalen (NRW) stehen.';
$lang['STIS_HERO_BUTTON1'] = 'Zur Karten- und Formularsuche &raquo;';
$lang['STIS_HERO_FREE_SEARCH'] = 'Probieren Sie die Freitextsuche:';
$lang['STIS_HERO_FREE_SEARCH_TEXT'] = 'Geben Sie hier Ihre Anfrage ein';
$lang['STIS_HERO_BUTTON2'] = 'Freitextsuche starten! &raquo;';
$lang['SELECT LANGUAGE'] = 'Sprache: ';
$lang['STIS_EXPLORE'] = '<h2>Erkunde die Daten</h2><p>Einführung und Erkundung der vorhandenen Daten. Siehe auch die Tag Cloud.</p><p><a class="btn" href="explore.php">Erkunden &raquo;</a></p>';

$lang['STIS_HELP'] =  '<h2>Hilfe</h2><p>Wie benutzt man den Bibliographischen Thesaurus? Was kann ich hier finden? Wie vertrauenswürdig sind die Informationen? Wo finde ich weiter Informationen?</p><p><a class="btn" href="#">Details &raquo;</a></p>';

$lang['STIS_ULB'] =  '<h2>ULB</h2>
          <p>Hier finden Sie mehr Informationen zur Universitäts- und Landesbibliothek Münster.</p>
          <p><a class="btn" href="http://www.ulb.uni-muenster.de/" target="_blanc">Details &raquo;</a></p>';
		  
$lang['STIS_SPARQL'] = '<h2>Expertenzugang</h2>
          <p>SPARQL Endpunkt für Experten zur direkten Abfrage von Daten mit SPARQL-Queries.</p>
          <p><a class="btn" href="sparql.php">SPARQL Endpunkt &raquo;</a></p>';
		  
$lang['STIS_CHILDREN'] = '<h2>Zugang für Kinder</h2>
          <p>Eine spannende Entdeckungsreise durch die Geschichte Westfalens.</p>
          <p><a class="btn" href="#">Zum Spiel! &raquo;</a></p>';

$lang['STIS_TAG_CLOUD'] = '<h2>Tag Cloud</h2>
          <p>Lassen Sie sich eine Tag Cloud über Personen anzeigen.</p>
          <p><a class="btn" href="tag_cloud.php">Zeige Cloud &raquo;</a></p>';

//search.php
$lang['SEARCH_TITLE'] = 'Suchformular';
$lang['SEARCH_SUBJECT'] = 'Thema';
$lang['SEARCH_SUBJECT2'] = 'Geben Sie ein Thema ein';
$lang['SEARCH_POI'] = 'Person';
$lang['SEARCH_POI2'] = 'Name einer Person';
$lang['SEARCH_AUTHOR'] = 'Autor (gibt die Publikationen eines Autors zurück)';
$lang['SEARCH_AUTHOR2'] = 'Name eines Autors';
$lang['SEARCH_PUB'] = 'Publikation';
$lang['SEARCH_PUB2'] = 'Name einer Publikation';
$lang['SEARCH_TIME'] = 'Zeitintervall (oder Epoche) in dem die Person gelebt hat: ';
$lang['SEARCH_TIME_LABEL'] = '[ derzeit keine Angabe ]';
$lang['SEARCH_ERA'] = 'Epoche';
$lang['SEARCH_ERA_CHOICES'] = array('...', 'Industriezeitalter (1800 +)', 'Nachmittelalterliches Zeitalter (1500-1800)', 'Mittelalterliches Zeitalter (800-1500)', 'Frühmittelalterliches Zeitalter (400-800)');
$lang['SEARCH_PLACE'] = 'Ort, der mit der Person zu tun hat';
$lang['SEARCH_PLACE2'] = 'Ort';
$lang['SEARCH_OCC'] = 'Beruf';
$lang['SEARCH_OCC2'] = 'Beruf der Person';
$lang['SEARCH_SUBMIT'] = 'Abschicken';
$lang['SEARCH_RESET'] = 'Zur&uuml;cksetzen';
$lang['SEARCH_FOREXAMPLE:'] = 'Beispiel ';
$lang['SEARCH_CHECK_BOX1:'] = 'Geburtsort ';  
$lang['SEARCH_CHECK_BOX2:'] = 'Sterbesort ';  
$lang['SEARCH_CHECK_BOX3:'] = 'Wirkungsort '; 
$lang['SEARCH_CHECK_BOX4:'] = 'Zeitintervall löschen ';   
$lang['warning_slider'] = 'Wählen Sie bitte mindestens eine Person, oder einen Beruf, oder einen Ort, oder ein Zeitintervall aus...';
$lang['warning_place'] = 'Wählen Sie bitte einen Ortstyp aus...';

//explore.php
$lang['EXPLORE_TITLE'] = 'Indizes ';
$lang['EXPLORE_HELP'] = 'Diese Seite listet alle Indizes in unserem Datenbestand auf.';
	  
	  
//sparql.php
$lang['SPARQL_TOP'] = '<h1>Thesaurus SPARQL Endpunkt</h1><br/><h3>Formular zum Versenden von Abfragen</h3>';
$lang['SPARQL_SUBMIT'] = 'Anfrage senden';

$lang['result_status_success'] = 'Abfrage erfolgreich...';
$lang['result_status_error'] = 'Fehlerhafte Frage...';

//results.php
$lang['RESULT_FILTER'] = 'Die folgenden Ergebnisse konnte das System anhand Ihrer Eingaben finden.';
$lang['RESULT_RESULTSNUMBER'] = 'Anzahl Ergebnisse pro Seite:';
$lang['RESULT_NUMBER_OF_RESULTS'] = 'Anzahl der Treffer: ';
$lang['RESULT_GO_BACK'] = 'zur&uuml;ck';
$lang['RESULT_START_NEW'] = 'eine neue Suche beginnen';
$lang['RESULT_EXPORT'] = "Exportieren";
$lang['RESULT_EXPORT_DROPDOWN'] = "als ";
$lang['RESULT_PRINT'] = "Drucken";
$lang['RESULT_BACK_ALL_RESULTS'] = 'zur&uuml;ck zu allen Treffern';
$lang['TITLE_EXPORTED_RESULTS'] = 'Ausgewählte Ergebnisse';
$lang['RESULT_NO_RESULT'] = "Kein Ergebnis "; 
$lang['warning_selected_results'] = 'Bitte mindestens ein Ergebnis auswählen...';

//tag_cloud.php

$lang['CLOUD_TITLE'] = 'Tag Cloud';
$lang['CLOUD_HELP'] = 'Die Tag Cloud gibt die Namen der zehn Autoren aus, die in unserem Datenbestand die meisten Publikationen veröffentlicht haben.';

?>

