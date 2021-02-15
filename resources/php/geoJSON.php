<?php


$countryData = json_decode(file_get_contents("../data/countryBorders.geo.json"), true);

$country = [];


foreach ($countryData['features'] as $feature) {


    $info = null;

    $info['code'] = $feature["properties"]['iso_a2'];

    $info['name'] = $feature["properties"]['name'];

    $info['geoJSON'] = $feature['geometry'];


    array_push($country, $info);

}



usort($country, function ($item1, $item2) {


    return $item1['name'] <=> $item2['name'];


});

$output['data'] = $country;


header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output);

?>