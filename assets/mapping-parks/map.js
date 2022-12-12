
// creates global variable for parks saved in local storage and then loads them if any are saved
if (localStorage.getItem("savedParks") === null) {
  var savedParks = {};
} else {
  var savedParks = JSON.parse(localStorage.getItem("savedParks"));
  loadSavedSearches(savedParks)
}

// function creates info panels for each saved park underneath the map
function loadSavedSearches(parksToLoad) {

  var savedParksEl = document.getElementById('saved-parks');
  var savedKeys = Object.keys(parksToLoad)
  console.log(savedParksEl)

  for (var i = 0; i < savedKeys.length; i++) {

    var parkDetails = parksToLoad[savedKeys[i]]
    if (document.getElementById(parkDetails.name) === null) {
      var parkTitle = parkDetails.name;

      var cardEl = $('<div>')
      $(cardEl).attr("class", "card");

      $(cardEl).css("width", "300px");
      $(cardEl).attr("id", parkDetails.name)
      $(cardEl).attr("data-code", parkDetails.code)


      var headEl = $('<div>')
      $(headEl).attr("class", "card-divider")

      var parkTitleEl = $('<h4>');
      $(parkTitleEl).text(parkTitle)
      $(headEl).append(parkTitleEl)

      $(cardEl).append(headEl)

      console.log(parksToLoad.image)

      var imgEl = $('<img>');
      $(imgEl).attr("src", parkDetails.image)
      $(imgEl).attr("class", "savedImages");

      $(cardEl).append(imgEl)

      var infoEl = $('<div>')
      $(infoEl).attr("class", "card-section")


      var locEl = $('<div>')
      $(locEl).css({ "display": "flex", "flex-direction": "row", "flex-wrap": "wrap", "justify-content": "space-between", "align-items": "center" })

      var locName = $('<h5>')
      $(locName).text(parkDetails.location)
      $(locEl).append(locName)

      var pinButton = $('<button>');
      $(pinButton).text("Pin to Map")
      $(pinButton).attr("class", "button small pin-button")
      $(locEl).append(pinButton);
      $(infoEl).append(locEl)

      var pEl = $('<p>')
      $(pEl).text(parkDetails.description)
      $(infoEl).append(pEl)

      var navEl = $('<nav>')
      $(navEl).css({ "display": "flex", "flex-direction": "row", "flex-wrap": "wrap", "justify-content": "space-between", "align-items": "center" })

      var linkEl = $('<a>');
      linkEl.text("Check it out!")
      linkEl.attr("href", parkDetails.url)
      linkEl.attr("target", "_blank")

      $(navEl).append(linkEl)

      var removeButton = $('<button>')
      $(removeButton).text("Remove")
      $(removeButton).attr("class", "alert button remove-button")

      $(navEl).append(removeButton)
      $(infoEl).append(navEl)
      $(cardEl).append(infoEl)
      $(savedParksEl).append(cardEl)
    } else {
      console.log("park already saved")
    }
  }

  // when remove button is clicked, the saved park display will be removed and deleted from local storage
  $('.remove-button').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var cardContainer = $(this).parent().parent().parent()
    var parentName = cardContainer.attr("id")
    $(cardContainer).remove()

    delete savedParks[parentName];
    localStorage.setItem("savedParks", JSON.stringify(savedParks))
    savedParks = JSON.parse(localStorage.getItem("savedParks"));

  })

  $('.pin-button').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("hey")
    var cardContainer = $(this).parent().parent().parent()
    var savedParkCode = [{ parkCode: cardContainer.attr("data-code") }];
    console.log(savedParkCode)
    addParksToMap(savedParkCode)
    

  })

  $('#remove-all-button').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    localStorage.removeItem("savedParks");
    savedParks = {};
    $('.card').remove();

  })

}

function featureStyle(feature) {
  console.log(feature)
  return [
    new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/mapping-parks/images/map-icon.png',
        //src: './images/map-icon.png',
        scale: 0.03
      }),
      text: new ol.style.Text({
        text: labelStyle(feature['name'], 20, "\n"),
        scale: 1,
        offsetY: '20',
        placement: 'line',
        fill: new ol.style.Fill({
          color: '#000'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3
        })
      }),
    })
  ]
}

function labelStyle(str, width, spaceReplacer) {
  // https://stackoverflow.com/questions/14484787/wrap-text-in-javascript

  if (str.length > width) {
    let p = width;
    while (p > 0 && str[p] != ' ' && str[p] != '-') {
      p--;
    }
    if (p > 0) {
      let left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      const right = str.substring(p + 1);
      return left + spaceReplacer + labelStyle(right, width, spaceReplacer);
    }
  }
  return str;

}

// this function adds pin points for the filtered park locations to the map
function makeFeatures(object) {
  console.log(object.data.length)
  var parkPins = {};
  var parkPinsNoLabel = {};

  // creates map feature objects for each park including information that will be displayed in modals
  
  for (var i = 0; i < object.data.length; i++) {
    // console.log(i);

    var parkName = object.data[i].fullName;
    var parkImage = object.data[i].images[0].url;
    var parkDescription = object.data[i].description;
    var parkLocation = object.data[i].addresses[0].city + ', ' + object.data[i].addresses[0].stateCode;
    var parkCode = object.data[i].parkCode;
    console.log(parkImage)

    console.log(parkName)

    // console.log(object.data[i])
    var latitude = object.data[i].latitude;
    // console.log(latitude)
    var longitude = object.data[i].longitude;

    var addFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
      name: parkName,
      code: parkCode,
      location: parkLocation,
      image: parkImage,
      url: object.data[i].url,
      description: parkDescription

    });
    console.log(addFeature)


    addFeature.setStyle(featureStyle(addFeature['values_']))
    console.log(addFeature)

    parkPins[parkName] = addFeature
    
  }

  // combines map features into a single vector layer that will be added to the map
  console.log(Object.values(parkPins)[0])  

var pins = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: Object.values(parkPins)
        })
      })


  map.addLayer(pins)
  // console.log(pins)
  // adds the location pins to the map
  

  // generates a new view to zoom in on the parks
  var ext = addFeature.getGeometry().getExtent();
  var center = ol.extent.getCenter(ext);

  console.log(center)
  map.setView(new ol.View({
    center: [center[0], center[1]],//zoom to the center of your feature
    zoom: 5 //here you define the levelof zoom
  }));

  // adds an event listener to the map viewport
  map.getViewport().addEventListener("click", function (e) {
    // when pixels with pins are selected, it will show the selected park's modal preview
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
      console.log(feature)
      // adds content to empty div element containing modal structure
      var previewEl = document.getElementById('park-preview');

      var parkTitleEl = document.getElementById('park-title');
      parkTitleEl.textContent = feature.values_.name;

      var locationEl = document.getElementById('location');
      locationEl.textContent = feature.values_.location;

      var backgroundImageEl = $('#park-image');
      $(backgroundImageEl).attr("class", "savedImages");
      $(backgroundImageEl).attr("src", feature.values_.image)

      var parkDescriptionEl = document.getElementById('park-description');
      parkDescriptionEl.textContent = feature.values_.description;

      var parkWebsiteLinkEl = document.getElementById('park-website');
      var link = feature.values_.url;
      parkWebsiteLinkEl.setAttribute('href', link)
      parkWebsiteLinkEl.setAttribute('target', '_blank')
      parkWebsiteLinkEl.textContent = 'Check it out!'

      // call foundation method to open the modal when clicked
      $(previewEl).foundation('open')

      // set park into local storage
      var saveButton = document.getElementById('save-button')
      saveButton.addEventListener('click', function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log(localStorage.getItem("savedParks"))

        var code = feature.values_.code;
        console.log(code)
        thisPark = feature.values_;

        console.log(thisPark)
        console.log(savedParks)
        savedParks[feature.values_.name] = thisPark

        localStorage.setItem("savedParks", JSON.stringify(savedParks))
        savedParks = JSON.parse(localStorage.getItem("savedParks"));
        console.log(savedParks)

        loadSavedSearches(savedParks);
        $(previewEl).foundation('close')
      }, { once: true })
    });
  });

  var searchListEl = document.getElementById('search-list')
  console.log(searchListEl)

  searchListEl.addEventListener('click', function(event){
    event.preventDefault()
    event.stopPropagation()
    console.log(event.target.textContent)
    var feature = parkPins[event.target.textContent]
    console.log(parkPins)
    // adds content to empty div element containing modal structure
    var previewEl = document.getElementById('park-preview');

    var parkTitleEl = document.getElementById('park-title');
    parkTitleEl.textContent = feature.values_.name;

    var locationEl = document.getElementById('location');
    locationEl.textContent = feature.values_.location;

    var backgroundImageEl = $('#park-image');
    $(backgroundImageEl).attr("class", "savedImages");
    $(backgroundImageEl).attr("src", feature.values_.image)

    var parkDescriptionEl = document.getElementById('park-description');
    parkDescriptionEl.textContent = feature.values_.description;

    var parkWebsiteLinkEl = document.getElementById('park-website');
    var link = feature.values_.url;
    parkWebsiteLinkEl.setAttribute('href', link)
    parkWebsiteLinkEl.setAttribute('target', '_blank')
    parkWebsiteLinkEl.textContent = 'Check it out!'

    // call foundation method to open the modal when clicked
    $(previewEl).foundation('open')

    // set park into local storage
    var saveButton = document.getElementById('save-button')
    saveButton.addEventListener('click', function (event) {

      event.preventDefault();
      event.stopPropagation();

      console.log(localStorage.getItem("savedParks"))

      var code = feature.values_.code;
      console.log(code)
      thisPark = feature.values_;

      console.log(thisPark)
      console.log(savedParks)
      savedParks[feature.values_.name] = thisPark

      localStorage.setItem("savedParks", JSON.stringify(savedParks))
      savedParks = JSON.parse(localStorage.getItem("savedParks"));
      console.log(savedParks)

      loadSavedSearches(savedParks);
      $(previewEl).foundation('close')
    }, { once: true })
  })
};

// function adds 
function addParksToMap(parksObject) {
  console.log(parksObject)
  console.log(parksObject.length)
  // adds variables to be used in fetch call to nps api
  var parkBaseUrl = 'https://@developer.nps.gov/api/v1'
  var apiParam = '&api_key=CrgafHnw6fYelIdITc4yR0KkwUU5rHWRnGKyi8xj';

  var selectedParks = [];
  // creating final list of park codes to be used in fetch call


  
    for (var pc = 0; pc < parksObject.length; pc++) {
      selectedParks.push(parksObject[pc].parkCode);
    }
  
  console.log(selectedParks)

  // gets park information from final list of park codes
  fetch(parkBaseUrl + '/parks?parkCode=' + String(selectedParks) + apiParam)
    .then(function (response) {
      return response.json();

    }).then(function (obj) {
      console.log(obj.data.length);
      // with information, adds map features based on park location
      makeFeatures(obj);
    })
}

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({ source: new ol.source.OSM() }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-100.622990, 48.223772]),
    zoom: 3,
  }),
  target: 'map'

});



// map.on('moveend', function(e) {

//   var map = new ol.Map({
//     layers: [
//       new ol.layer.Tile({ source: new ol.source.OSM() }),
//     ],
//     view: new ol.View({
//       center: ol.proj.fromLonLat([-100.622990, 48.223772]),
//       zoom: 3,
//     }),
//     target: 'map',
//     style: zoomStyle
  
//   });
// });

// var zoomStyle = function () {
//   var zoom = map.getView().getZoom();
//   var font_size = zoom * 15;
//   console.log(font_size)
//   return [
//     new ol.style.Style({
//       text: new ol.style.Text({
//         font: font_size + 'px Calibri',
//       })
//     })   
//   ]
// }


// var currZoom = map.getView().getZoom();
//   zoomStyle(currZoom)

// map.on('moveend', function(e) {
//   console.log("map moved")
//   var currZoom = map.getView().getZoom();
//   zoomStyle(currZoom)
  
//   // map.getFeatures()
//   // feature.getStyle()
//   map.addFeature((zoomStyle))

  
// });

// var parkList = [{ park: "yosemite", parkCode: "yose", url: "someurl" }]

// addParksToMap(parkList)

// var parkList = [{ park: "yosemite", parkCode: "yose", url: "someurl" }, { park: "yosemite", parkCode: "chis", url: "someurl" }, { park: "yosemite", parkCode: "fopo", url: "someurl" }]

// addParksToMap(parkList)








