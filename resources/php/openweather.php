<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'http://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST["value"] . 
  '&units=metric&appid=714cfa73624bdff84e4650e6f7b8010c';
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

    $decode = json_decode($result, true);

    $output = [];

    $info = null;

    $info['weatherData'] = $decode['main'];

    $info['weatherDescription'] = $decode['weather'][0]['description'];

    $info['weatherMain'] = $decode['weather'][0]['main'];

    array_push($output, $info);

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>