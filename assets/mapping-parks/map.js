var parkBaseUrl = 'https://@developer.nps.gov/api/v1'
var apiParam = '&api_key=CrgafHnw6fYelIdITc4yR0KkwUU5rHWRnGKyi8xj';

var parks = ["acad", "chis", "fopo"];
var parkNames = [];
var parkPins = {};

var parkList = [ {park:"yosemite", parkCode:"yose", url:"someurl"}, {}, {}]

// function getCoordinates (selectedParks) {

function makeFeatures(object) {
  console.log(object.data.length)
  for (var i = 0; i < object.data.length; i++) {
    console.log(i)

    var parkName = object.data[i].fullName;
    // var parkCode = object.data[i].parkCode;
    var parkImage = object.data[i].images[0].url;
    var parkDescription = object.data[i].description;
    var parkLocation = object.data[i].addresses[0].city + ', ' + object.data[i].addresses[0].stateCode;
    console.log(parkImage)
    parkNames.push(parkName)
    console.log(parkName)

    console.log(object.data[i])
    var latitude = object.data[i].latitude;
    console.log(latitude)
    var longitude = object.data[i].longitude;

    var addFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
      name: parkName,
      // code: parkCode,
      location: parkLocation,
      image: parkImage,
      url: object.data[i].url,
      description: parkDescription
      
    });

    parkPins[parkName] = addFeature

    console.log(parkPins)
  }

  var pins = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: Object.values(parkPins)
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/mapping-parks/images/map-icon.png',
        scale: 0.03
      })
    })
  })

  map.addLayer(pins)
  
  // map.setAttribute('data-open', 'park-preview');

  
  map.getViewport().addEventListener("click", function (e) {
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
      console.log(feature)
      
      // begins filling in preview code block
      var previewEl = document.getElementById('park-preview');

      var parkTitleEl = document.getElementById('park-title');
      parkTitleEl.textContent = feature.values_.name;

      var locationEl = document.getElementById('location');
      locationEl.textContent = feature.values_.location;

      var backgroundImageEl = document.getElementById('park-image');
      backgroundImageEl.setAttribute('class', 'park-image')
      backgroundImageEl.style.backgroundImage = 'url(' + feature.values_.image; + ')'

      var parkDescriptionEl =  document.getElementById('park-description');
      parkDescriptionEl.textContent = feature.values_.description;
      
      var parkWebsiteLinkEl = document.getElementById('park-website');
      var link = feature.values_.url;
      parkWebsiteLinkEl.setAttribute('href', link)
      parkWebsiteLinkEl.setAttribute('target', '_blank')
      parkWebsiteLinkEl.textContent = 'Learn More!'
      

      $(previewEl).foundation('open')
    });
  });

}

function makePreviews() {

}

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),

  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-100.622990, 48.223772]),
    zoom: 3,
  }),
  target: 'map',
});

fetch(parkBaseUrl + '/parks?parkCode=' + String(parks) + apiParam)
  .then(function (response) {
    return response.json();

  }).then(function (obj) {
    console.log(obj.data.length);

    console.log(finalParkList);

    makeFeatures(obj);

  })
// }






