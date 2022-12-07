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


// var p1 = new Feature({
//   geometry: new Point(fromLonLat([-119.9112735, 33.98680093])),
//   name: 'park',
// });
function generateMap() { 
new ol.Map({
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        features: Object.values(parkPins)
      }) //,
      //   style: new Style({
      //     image: new Icon({
      //       // // anchor: [0.5, 46],
      //       // anchorXUnits: 'fraction',
      //       // anchorYUnits: 'pixels',
      //       src: 'https://png.pngtree.com/png-vector/20190903/ourmid/pngtree-map-location-marker-icon-in-red-png-image_1722078.jpg',
      //       scale: 0.1
      //     })
      //   })
    })
  ],
  view: new ol.View({
    center: [0, 0],
    zoom: 2,
  }),
  target: 'map',
});


}


// var labelCoords = [33.98680093,-119.9112735];

// const feature = new Feature({
//   // geometry: new Polygon(polyCoords),
//   labelPoint: new Point(labelCoords),
//   name: 'My Polygon',
// });

// lat:33.98680093, long:-119.9112735
