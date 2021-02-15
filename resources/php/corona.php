<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://corona-api.com/countries/' . $_REQUEST['value'];
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result, true);

  $output = [];

  $info = null;

  $info['update'] = $decode['data']['updated_at'];

  $info['confirmedToday'] = $decode['data']['today']['confirmed'];
  
  $info['deathsToday'] = $decode['data']['today']['deaths'];

  $info['totalConfirmed']= $decode['data']['latest_data']['confirmed'];

  $info['totalDeaths'] = $decode['data']['latest_data']['deaths'];

  $info['recovered'] = $decode['data']['latest_data']['recovered'];

  $info['deathRate'] = $decode['data']['latest_data']['calculated']['death_rate'];

  $info['casesPerMillion'] = $decode['data']['latest_data']['calculated']['cases_per_million_population'];



  array_push($output, $info);

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>