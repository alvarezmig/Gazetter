<?php


$airportsData = json_decode(file_get_contents("../data/airports.json"), true);

$airports = [];


foreach ($airportsData as $feature) {


    $info = null;

    $info['code'] = $feature['code'];

    $info['lat'] = $feature['lat'];

    $info['lon'] = $feature['lon'];

    $info['name'] = $feature['name'];

    $info['city'] = $feature['city'];

    $info['type'] = $feature['type'];

    $info['country'] = $feature['country'];


    array_push($airports, $info);

}


$output['data'] = $airports;


header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output);

?>