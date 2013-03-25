<?php
 
include_once '/var/www/php/Zend/Loader.php';
Zend_Loader::registerAutoload();
 
$index = Zend_Search_Lucene::create('./index_test');
 
$document = new Zend_Search_Lucene_Document();
$document->addField(Zend_Search_Lucene_Field::UnIndexed('URI', 'http://dortmund.com/'));
$document->addField(Zend_Search_Lucene_Field::Text('placeOfDeath', 'Dortmund'));
$index->addDocument($document);
 
$document = new Zend_Search_Lucene_Document();
$document->addField(Zend_Search_Lucene_Field::UnIndexed('URI', 'http://Essen.com/'));
$document->addField(Zend_Search_Lucene_Field::Text('placeOfDeath', 'Essen'));
$index->addDocument($document);

?>
