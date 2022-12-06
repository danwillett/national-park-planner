var parkBaseUrl = 'https://@developer.nps.gov/api/v1'
var apiParam = '&api_key=CrgafHnw6fYelIdITc4yR0KkwUU5rHWRnGKyi8xj';

var parks = ["acad", "chis", "fopo"];
var parkNames = [];
var parkPins = {};

// function getCoordinates (selectedParks) {

function makeFeatures(object) {
  console.log(object.data.length)
  for (var i = 0; i < object.data.length; i++) {
    console.log(i)
    
    var parkName = object.data[i].fullName;
    parkNames.push(parkName)
    console.log(parkName)

    console.log(object.data[i])
    var latitude = object.data[i].latitude;
    console.log(latitude)
    var longitude = object.data[i].longitude;

    var addFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
      name: parkName,
      url: object.data[i].url    
    });
  
  parkPins[parkName] = addFeature
    
  console.log(parkPins)
}

}

fetch(parkBaseUrl + '/parks?parkCode=' + String(parks) + apiParam)
  .then(function (response) {
    return response.json();

  }).then(function (obj) {
    console.log(obj.data.length)

    makeFeatures(obj);
    
  }).then(function(){
    generateMap()
  })
// }

console.log(parkPins)

function generateMap() { 
var map = new ol.Map({
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        features: Object.values(parkPins)
      }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: './images/map-icon.png',
            scale: 0.03
          })
        })
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-100.622990, 48.223772]),
    zoom: 3,
  }),
  target: 'map',
});

map.getViewport().addEventListener("click", function(e) {
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
        console.log(feature)
        var link = feature.values_.url;
        window.open(link, '_blank')
        //do something
    });
});
}


