<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url='https://api.opencagedata.com/geocode/v1/json?key=726ac0d6ccb8459c8f5930c5e9984a2f&q=' . $_REQUEST['value'] . '&pretty=1';
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $output = curl_exec($ch);

  curl_close($ch);

  header('Content-Type: application/json; charset=UTF-8');

  echo $output;
?>