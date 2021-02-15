<?php

  ini_set('display_errors', "On");
  error_reporting(E_ALL);

  $ch = curl_init();

  $url = 'https://newsapi.org/v2/everything?q=' . $_REQUEST['value'] . '&apiKey=a2550656ae004031bdccca5ff1fe11de';
  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL ,$url);

  $result = curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result, true);

  $output = [];

  for($i = 0; $i < count($decode['articles']) ; $i++){ 

     $info = null;

     $info['url'] = $decode['articles'][$i]['url'];

     $info['title'] = $decode['articles'][$i]['title'];

     $info['description'] = $decode['articles'][$i]['description'];

     $info['sourceName'] = $decode['articles'][$i]['source']['name'];

     $info['author'] = $decode['articles'][$i]['author'];

     $info['image'] = $decode['articles'][$i]['urlToImage'];

     $info['date'] = $decode['articles'][$i]['publishedAt'];

     array_push($output, $info);
    
    }

 

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>