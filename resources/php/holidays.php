<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://holidayapi.com/v1/holidays?pretty&key=e8f4a9f0-78f7-4029-b391-64cdd1d5c74a&country=' . $_REQUEST['value'] . '&year=2020';
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result, true);

  $output = [];

  for($i = 0; $i < count($decode['holidays']) ; $i++){ 

    $info = null;

    $info['name'] = $decode['holidays'][$i]['name'];

    $info['date'] = $decode['holidays'][$i]['date'];

    array_push($output, $info);
   
   }
  

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>