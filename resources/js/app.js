//Preloader function
$(window).on('load', function() {
  $('#preloader').fadeOut('slow', function() {
    $(this).remove();
  });
});

//MAP CODE

var map = L.map('map',{
  zoomDelta: 1
});

map.setView([0,0], 2);


//LAYERS CODE

var defaultLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
})
defaultLayer.addTo(map);

// base layer code 
var outdoors = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  light = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  }),
  dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }),
  satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }),
  ocean = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13
  }),
  night = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
      attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
      minZoom: 1,
      maxZoom: 8,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
  })

//baselayers
var baseMaps = {
  "Street": defaultLayer,
  "Outdoors": outdoors,
  "Light": light,
  "Dark": dark,
  "Satellite": satellite,
  "Earth at night": night,
  "Ocean" : ocean
};


//Ajax function to get borders location

async function bordersJSON(){
  var borders;
  await $.ajax({
  type: 'POST',
  dataType: 'JSON',
  url: 'resources/php/geoJSON.php',
  success: function(data) {
    borders = data;
    $('#selectMenu').html('');

    $.each(borders.data, function(index) {
      //filling up select menu with country options as text and iso codes as values
        $('#selectMenu').append($("<option>", {
            value: borders.data[index].code,
            text: borders.data[index].name 
        }));
    });

     },
  error: function(){
      alert('Error retrieving information');
  }

})
return borders;
}

//get user position using navigator and promises
function getPosition() {
 return new Promise(function (resolve, reject) {
     navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const currentCountry = new Promise ((resolve, reject) => {
  resolve(getPosition()

  .then(async(position) => {

    var coords = [position.coords.latitude, position.coords.longitude];

    await $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: 'resources/php/opencage.php',
      data:{
        value: coords[0] + "+" + coords[1]
      },
      success: function(data) {
        //passing lat and lon (obtained using navigator) to opencage API to get ISOCODE and then 
        //using this isocode value to change to user's current country 
        $('#selectMenu').val(data).change()

        
      },
      error: function(){
        alert('Error retrieving information');
      }
  })
})
)
})


Promise.allSettled([
  bordersJSON(),
  currentCountry,
]).then(([results]) => geoloc(results.value));


function geoloc(borders) {

  function countryData(){ 

    async function restcountries(){ 
      var restcountriesData;
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/restcountries.php',
      data:{
        value : $("#selectMenu").val()
      },
      success: function(data){
        restcountriesData = data;
        
         },
      error: function(){
          alert('Error retrieving demographic information');
      }
      })
      return restcountriesData;
    }

    async function weather(){
      var weatherData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/openweather.php',
      data : {
        value : $("#selectMenu").find("option:selected").text().replaceAll(" ", "%20")
      },
      success: function(data){
        weatherData = data;
        },
      error: function(){
          alert('Error retrieving weather information');
      }
    })
  return weatherData;
}

    async function coronavirus(){
      var coronavirusData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/corona.php',
      data: {
        value: $("#selectMenu").val()
      },
      success: function(data){
        coronavirusData = data;
        },
      error: function(){
          alert('Error retrieving coronavirus information');
      }
    })
    return coronavirusData;
}
async function opencageQuery(){
      var opencageData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/opencagequery.php',
      data: {
        value: $("#selectMenu").find("option:selected").text().replaceAll(" ", "%20")
      },
      success: function(data){
        opencageData = data;
        },
      error: function(){
          alert('Error retrieving coronavirus information');
      }
    })
    return opencageData;
}
opencageQuery()

    async function exchangeRate(){
      var exchangeRateData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/exchangeRate.php',
      success: function(data){
        exchangeRateData = data;
        },
      error: function(){
          alert('Error retrieving exchange rate information');
      }
    })
    return exchangeRateData;
}
exchangeRate();

  async function news(){
      var newsData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/news.php',
      data: {
        value: $("#selectMenu").find("option:selected").text().replaceAll(" ", "%20")
      },
      success: function(data){
        newsData = data;
        },
      error: function(){
          alert('Error retrieving news information');
      }
    })
    return newsData;
}

    async function holidays(){
      var holidaysData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/holidays.php',
      data: {
        value: $("#selectMenu").val()
      },
      success: function(data){
        holidaysData = data;
        },
      error: function(){
          alert('Error retrieving holidays information');
      }
    })
    return holidaysData;
}

    async function images(){
      var imagesData;  
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/images.php',
      data: {
        value: $("#selectMenu").find("option:selected").text().replaceAll(" ", "%20")
      },
      success: function(data){
        imagesData = data;
        },
      error: function(){
          alert('Error retrieving images information');
      }
    })
    return imagesData;
}

    async function volcanoes(){
      var volcanoesInfo;
      await $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: 'resources/php/volcanoes.php',
      success: function(data) {
        volcanoesInfo = data;
        },
      error: function(){
          alert('Error retrieving information');
      }
    })
      return volcanoesInfo;
    }

    async function airports(){
      var airportsInfo;
      await $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: 'resources/php/airports.php',
      success: function(data) {
        airportsInfo = data;
         },
      error: function(){
          alert('Error retrieving information');
      }
    })
      return airportsInfo;
    }

    Promise.all([
      restcountries(),
      weather(),
      coronavirus(),
      opencageQuery(),
      exchangeRate(),
      news(),
      holidays(),
      images(),
      volcanoes(),
      airports()
    ]).then(([restcountriesData, weatherData, coronavirusData, opencageData, exchangeRateData, newsData, holidaysData, imagesData, volcanoesInfo, airportsInfo]) => 
      allData(restcountriesData, weatherData, coronavirusData, opencageData, exchangeRateData, newsData, holidaysData, imagesData, volcanoesInfo, airportsInfo));
      
  function allData(restcountriesData, weatherData, coronavirusData, opencageData, exchangeRateData, newsData, holidaysData, imagesData, volcanoesInfo, airportsInfo){ 
   
    $('#articles').empty();
    $('#holidaytbody').empty();
    $('#imagesRefresh').empty();

    var latlng = "lat=" + opencageData.results[0].geometry.lat + "&lng=" + opencageData.results[0].geometry.lng;
    
    async function wikipedia(){
      var wikipediaData; 
      await $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'resources/php/wikipedia.php',
      data: {
        value: latlng
      },
      success: function(data){
        wikipediaData = data;
        },
      error: function(){
          alert('Error retrieving wikipedia information');
      }
    })
    return wikipediaData;
  }
  
    var airportsCluster = L.markerClusterGroup();
    var airportMarkers;
    var airplaneIcon = L.icon({
      iconUrl: 'resources/img/airport.png',
      iconSize: [50, 50],
    });

    var trainsCluster = L.markerClusterGroup();
    var trainsMarkers;
    var trainIcon = L.icon({
      iconUrl: 'resources/img/train.png',
      iconSize: [60, 60],
    });

    var volcanoesCluster = L.markerClusterGroup();
    var volcanoesMarkers;
    var volcanoesIcon = L.icon({
      iconUrl: 'resources/img/volcano.png',
      iconSize: [50, 60],
    });

    var wikipediaCluster = L.markerClusterGroup();
    var wikipediaMarkers;
    var wikipediaIcon = L.icon({
      iconUrl: 'resources/img/wikiicon.png',
      iconSize: [40, 50],
    });


    $.each(airportsInfo.data, function(i){

      if(airportsInfo.data[i].country === $("#selectMenu").find("option:selected").text()){ 

      if(airportsInfo.data[i].type === 'Airports' || airportsInfo.data[i].name.includes('Airport')){
      
      $('#cityAirport').html(airportsInfo.data[i].city);
      $('#codeAirport').html(airportsInfo.data[i].code);
      $('#nameAirport').html(airportsInfo.data[i].name);

      airportMarkers = L.marker([airportsInfo.data[i].lat, airportsInfo.data[i].lon],
        {icon: airplaneIcon}).bindPopup(
          $('#popupInfoAirport').html(), {className: "styleAirportPopup"}
          );
      airportsCluster.addLayer(airportMarkers)

        } else if(airportsInfo.data[i].type === 'Railway Stations'){

          $('#cityTrains').html(airportsInfo.data[i].city);
          $('#codeTrains').html(airportsInfo.data[i].code);
          $('#nameTrains').html(airportsInfo.data[i].name);
          
          trainsMarkers = L.marker([airportsInfo.data[i].lat, airportsInfo.data[i].lon],
            {icon: trainIcon}).bindPopup(
              $('#popupInfoTrains').html(), {className: "styleTrainPopup"}
              );
        trainsCluster.addLayer(trainsMarkers)
        }
      }
    })

    $.each(volcanoesInfo.data, function(i){

      if(volcanoesInfo.data[i].country === $("#selectMenu").find("option:selected").text()){ 
        $('#nameVolcano').html(volcanoesInfo.data[i].name);

      volcanoesMarkers = L.marker([volcanoesInfo.data[i].lat, volcanoesInfo.data[i].lon],
        {icon: volcanoesIcon}).bindPopup(
            $('#popupInfoVolcanoes').html(), {className: "styleVolcanoPopup"});
      volcanoesCluster.addLayer(volcanoesMarkers)
        }
    })
    
    wikipedia().then(wikipediaData => {
    $.each(wikipediaData.geonames, function(i){ 
      wikipediaMarkers = L.marker([wikipediaData.geonames[i].lat, wikipediaData.geonames[i].lng],
       {icon: wikipediaIcon}).bindPopup(
           `<div> 
            <h1 id="wikiTitle">${wikipediaData.geonames[i].title}</h1>
            <p>${wikipediaData.geonames[i].summary}</p>
            <a id="wikiLink" target="_blank" href= 'https://${wikipediaData.geonames[i].wikipediaUrl}'"> Read More </a>
            </div>`, {className: "styleWikiPopup"}
           );
      wikipediaCluster.addLayer(wikipediaMarkers)
       })
     })

      map.addLayer(airportsCluster);
      map.addLayer(trainsCluster);
      map.addLayer(wikipediaCluster)
      map.addLayer(volcanoesCluster);

      var overlayMaps = {
      "Airports": airportsCluster,
      "Trains": trainsCluster,
      "Volcanoes": volcanoesCluster,
      "Wikipedia": wikipediaCluster
      };

      //layers controls 

      var layersControls = L.control.layers(baseMaps, overlayMaps).setPosition('bottomright').addTo(map);


    var holidaysName = [];
    var holidaysDate = [];

    for(let i = 0; i < holidaysData.length ; i++ ){ 
      holidaysName.push(holidaysData[i].name);
      holidaysDate.push(holidaysData[i].date);
    }

    var holidaysDateUpdate = [];
    $.each(holidaysDate, function(i){
       holidaysDateUpdate.push(holidaysDate[i].replace("2020", holidaysDate[i].substring(8,10)))
      })

    var holidaysDateCorrect = []
    $.each(holidaysDateUpdate, function(i){
      holidaysDateCorrect.push(holidaysDateUpdate[i].substring(0,5))
    })


    var holidaysNameDate = [holidaysName, holidaysDateCorrect];

    var isoCode = [];
    var countryName = [];
    var geometry = [];

    for(let i = 0; i < borders.data.length ; i++){ 
    isoCode.push(borders.data[i].code);
    countryName.push(borders.data[i].name);
    geometry.push(borders.data[i].geoJSON);
    }

    var publishedDateUpdate = []
    for(let i = 0; i < newsData.length ; i++ ){ 
      publishedDateUpdate.push(newsData[i].date);
    }
    

    var publishedDateCorrect = []
    $.each(publishedDateUpdate, function(i){
      publishedDateCorrect.push(publishedDateUpdate[i].replace("2021", publishedDateUpdate[i].substring(8,10)))
    })


    var coronaDate = coronavirusData[0].update;
    var coronaUpdate = coronaDate.substring(8,10) + "-" + coronaDate.substring(5,7);

    var currency = exchangeRateData.rates;
  
    $.each(isoCode, function(index){

      if(isoCode[index] === $('#selectMenu').val()){
      
        $('.countryName').text(countryName[index]);
        $('.countryFlag').attr('src',restcountriesData[0].flag);
        $('#capital').html(restcountriesData[0].capital);
        $('#weatherCaption span').html(restcountriesData[0].capital);
        $('#population').html(restcountriesData[0].population.toLocaleString());
        $('#language').html(restcountriesData[0].language);

        $('#currentWeather').html(weatherData[0].weatherMain + 
          " - " + weatherData[0].weatherDescription);
        $('#feelsLike').html(weatherData[0].weatherData.feels_like + " °C");
        $('#humidity').html(weatherData[0].weatherData.humidity + " %");
        $('#pressure').html( weatherData[0].weatherData.pressure + " hPa");
        $('#temperature').html(weatherData[0].weatherData.temp + " °C");
        $('#temperatureMax').html(weatherData[0].weatherData.temp_max + " °C");
        $('#temperatureMin').html(weatherData[0].weatherData.temp_min + " °C");
        
        $('#coronavirusInfo span').html(coronaUpdate + "-2021");
        $('#coronavirusCasesToday').html(coronavirusData[0].confirmedToday);
        $('#coronavirusDeathsToday').html(coronavirusData[0].deathsToday);
        $('#coronavirusConfirmedTotal').html(coronavirusData[0].totalConfirmed.toLocaleString()); 
        $('#coronavirusDeathsTotal').html(coronavirusData[0].totalDeaths.toLocaleString());
        $('#deathRate').html(coronavirusData[0].deathRate.toString().substring(0,3));
        $('#casesPerMillion').html(coronavirusData[0].casesPerMillion.toLocaleString());
        $('#recovered').html(coronavirusData[0].recovered.toLocaleString());

        $('#countryCurrency').html(restcountriesData[0].currencyName + " " +
                                        restcountriesData[0].currencyCode + " " +
                                        restcountriesData[0].currencySymbol);
        if(currency[restcountriesData[0].currencyCode] === undefined){
          $('#currencyExchange').html("Data not found");
        }else{ 
       $('#currencyExchange').html((currency[restcountriesData[0].currencyCode]).toString().substring(0,4) 
          + " " + restcountriesData[0].currencyCode);
        }
    
        $.each(holidaysNameDate[0], function(i) {
          $('#holidaytbody').append($(
            "<tr>" +

              "<td>" + holidaysNameDate[0][i] + "</td>" +
              "<td>" + holidaysNameDate[1][i] + "-2020</td>" +

            "</tr>" ))
        })

        $('#imagesRefresh').append($(`
                <div class="carousel-item active">

                    <img src=${imagesData[0].image} class="d-block w-100" alt="country image">

                    <div class="carousel-caption d-md-block">

                      <p id="imageLabel">${imagesData[0].tags}</p>

                  </div>
                </div> `
        ))

        for(let i = 0; i < imagesData.length ; i++){ 
          if(imagesData[i].image === imagesData[0].image){
            continue;
          }
          $('#imagesRefresh').append($(`
              <div class="carousel-item">

                  <img src=${imagesData[i].image} class="d-block w-100" alt="country image">

                  <div class="carousel-caption d-md-block">
                    <p id="imageLabel">${imagesData[i].tags}</p>
                </div>

              </div>   
              `))
          }

        $.each(newsData, function(i){
          $('#articles').append($(
            `<a href=${newsData[i].url} target="_blank"><h1 id="articleTitle">${newsData[i].title}</h1></a>

              <p>${newsData[i].description}</p>

              <div id="articleFlex1">

                <div id="articleFlex2">

                  <p>${newsData[i].sourceName} <br><address id="author"> ${newsData[i].author}</address></p>
                  <p> ${publishedDateCorrect[i].substring(0,5)}-2021</p>

                </div>

              <img id="articleImage" src=${newsData[i].image} class="d-block w-100" alt="article image">
              
              </div>
           <hr>
          ` ))
        })

        
        var country = L.geoJSON(geometry[index], {color: 'rgba(63, 191, 191, 0.5)'}).addTo(map);

        map.fitBounds(country.getBounds())

        $('#selectMenu').change(function(){

          map.removeLayer(country);
          map.removeLayer(wikipediaCluster);
          map.removeLayer(volcanoesCluster);
          map.removeLayer(airportsCluster);
          map.removeLayer(trainsCluster);
          map.removeControl(layersControls);

        })
      }
    })
   }
  }
  
  countryData();

  $('#selectMenu').change(function(){
    map.closePopup();
    countryData();
  })

}


//buttons
L.easyButton("fas fa-globe-europe", function(){
  map.setView([0,0], 2);
}).addTo(map);

L.easyButton("fas fa-info-circle", function(){
 $('#countryInfo > button').click();
}).addTo(map);
 
 L.easyButton("fas fa-calendar-day", function(){
  $('#holidays > button').click();
 }).addTo(map);
 
 L.easyButton("fas fa-cloud-sun", function(){
  $('#weather > button').click();
 }).addTo(map);

 L.easyButton("fas fa-virus", function(){
  $('#coronavirus > button').click();
 }).addTo(map);

 L.easyButton("fas fa-images", function(){
  $('#images > button').click();
 }).addTo(map);

 L.easyButton("far fa-newspaper", function(){
  $('#news > button').click();
 }).addTo(map);

