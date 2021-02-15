<?php


$volcanoesData = json_decode(file_get_contents("../data/volcano.json"), true);

$volcanoes = [];


foreach ($volcanoesData['features'] as $feature) {


    $info = null;

    $info['country'] = $feature['properties']['Country'];

    $info['name'] = $feature['properties']['V_Name'];

    $info['lat'] = $feature['properties']['Latitude'];

    $info['lon'] = $feature['properties']['Longitude'];



    array_push($volcanoes, $info);

}


$output['data'] = $volcanoes;


header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output);

?>