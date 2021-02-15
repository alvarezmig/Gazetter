<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://pixabay.com/api/?key=20179597-b817e44ae8cf3fcd2fa5711ee&q=' . $_REQUEST['value'] . '&image_type=photo&pretty=true';
   
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result, true);

  $output = [];

  for($i = 0; $i < count($decode['hits']) ; $i++){ 

  $info = null;

  $info['image'] = $decode['hits'][$i]['largeImageURL'];

  $info['tags'] = $decode['hits'][$i]['tags'];

  array_push($output, $info);
  
  }



  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>