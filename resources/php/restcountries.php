<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://restcountries.eu/rest/v2/alpha/' . $_REQUEST['value'];
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result,true);

  $output = [];


    $info = null;

    $info['capital'] = $decode['capital'];

    $info['flag'] = $decode['flag'];

    $info['population'] = $decode['population'];

    $info['language'] = $decode['languages'][0]['name'];

    $info['currencyName'] = $decode['currencies'][0]['name'];

    $info['currencyCode'] = $decode['currencies'][0]['code'];

    $info['currencySymbol'] = $decode['currencies'][0]['symbol'];


    array_push($output, $info);


  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>