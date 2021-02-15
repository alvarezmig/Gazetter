<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&'. $_REQUEST['value']. '&maxRows=10&radius=20&username=miguelalvarez&style=full';
 
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $output = curl_exec($ch);

  curl_close($ch);

  header('Content-Type: application/json; charset=UTF-8');

  echo $output;

?>