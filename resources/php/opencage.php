<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://api.opencagedata.com/geocode/v1/json?key=726ac0d6ccb8459c8f5930c5e9984a2f&q=' . $_REQUEST['value'] . '&pretty=1&no_annotations=1';
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result,true);

  $output = [];

  foreach($decode['results'] as $feature){

    $info = null;

    $info = $feature['components']['ISO_3166-1_alpha-2'];


    array_push($output, $info);

  }


  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>