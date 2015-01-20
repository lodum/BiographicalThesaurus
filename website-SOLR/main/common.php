<?php

/*
 * This PHP file is a part of the multilingual plugin of the Biographical Thesaurus.
 */

session_start();
header('Cache-control: private'); // IE 6 FIX

if(isSet($_GET['lang']))
{
$lang = $_GET['lang'];

// register the session and set the cookie
$_SESSION['lang'] = $lang;

setcookie('lang', $lang, time() + (3600 * 24 * 30));
}
else if(isSet($_SESSION['lang']))
{
$lang = $_SESSION['lang'];
}
else if(isSet($_COOKIE['lang']))
{
$lang = $_COOKIE['lang'];
}
else
{
// default language of the website is german
$lang = 'de';
}

switch ($lang) {
  case 'en':
  $lang_file = 'lang.en.php';
  break;

  case 'de':
  $lang_file = 'lang.de.php';
  break;

  default:
  $lang_file = 'lang.de.php';

}

include_once 'languages/'.$lang_file;

// initialize a session variable helping to refer to the current page
$_SESSION['current_page'] = "";

?>
