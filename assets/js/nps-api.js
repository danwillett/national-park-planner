// import API key 
import {
    apiKeyNPS
} from './config.js';

//Global variables
var activitesOffered = []; //activities offered by NPS
var activitiesChosen = []; //activities a user is interested in 
var parksForChosenActivity = []; //parks where a user can find their chosen activity
var amenitiesOffered = []; //amenities offered by NPS
var amenityCategories = []; //type of amenities
var parksForChosenAmenity = []; //parks where a user can find their chosen amenity



//Get the list of activities offered by NPS
function getNPSActivities() {
    var requestURL = "https://developer.nps.gov/api/v1/activities?api_key=" + apiKeyNPS;

    console.log(requestURL);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // console.log("length = " + data.length);

            for (var i = 0; i < data.data.length; i++) {
                activitesOffered[i] = data.data[i].name;
                console.log(activitesOffered[i]);
            }
        });
}

//Get parks where chosen activities are available
//This function takes as parameter a US state as location and a string variable which containa comma separated list of activities
function getParksForChosenActivities(state, activityList) {
    var requestURL = "https://developer.nps.gov/api/v1/activities/parks?q=" + activityList + "&api_key=" + apiKeyNPS;

    console.log(requestURL);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("length = " + data.data.length);

            for (var i = 0; i < data.data.length; i++) {
                console.log("For activity " + data.data[i].name);
                var parkEl = {
                    act: "",
                    park: "",
                    url: ""
                }
                for (var x = 0; x < data.data[i].parks.length; x++) {
                    if (data.data[i].parks[x].states.match(state)) {
                        parkEl = {
                            act: data.data[i].name,
                            park: data.data[i].parks[x].fullName,
                            url: data.data[i].parks[x].url
                        }
                        console.log(parkEl);
                        parksForChosenActivity[parksForChosenActivity.length] = parkEl;
                    }
                }
            }
        });
}

//get amenities list along with its id and category
function getNPSAmenities() {
    var requestURL = "https://developer.nps.gov/api/v1/amenities?api_key=" + apiKeyNPS;

    console.log(requestURL);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // console.log("length = " + data.length);

            var amenity = {
                id: "",
                name: "",
                category: ""
            }

            for (var i = 0; i < data.data.length; i++) {

                //add amenity for each category it belong to for easier display later

                for (var j = 0; j < data.data[i].categories.length; j++) {

                    amenity = {
                        id: data.data[i].id,
                        name: data.data[i].name,
                        category: data.data[i].categories[j]
                    }
                    amenitiesOffered[i] = amenity;
                    console.log(amenitiesOffered[i]);

                    //if category doesnot exist in amenityCategories array then add it
                    var exist = false;

                    for (var k = 0; k < amenityCategories.length; k++) {
                        if (amenityCategories[k] === data.data[i].categories[j])
                            exist = true;
                    }

                    if (exist === false)
                        amenityCategories[amenityCategories.length] = data.data[i].categories[j];
                }

            }
            console.log(amenityCategories);
        });
}

function getAmenitiesForCategory(category){
    var amenities = [];

    for(var i = 0; i < amenitiesOffered.length; i++){
        if(amenitiesOffered[i].category === category)   
            amenities[amenities.length] = amenitiesOffered[i].name;
    }

    return amenities;
}

function getParksForChosenAmenity(state, amenityIds){
    var requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityIds + "&api_key=" + apiKeyNPS;

    console.log(requestURL);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log("length = " + data.data.length);

            for (var i = 0; i < data.data.length; i++) {
                var temp = {
                 tarr:[]
                };
                temp.tarr = data.data[i];
                console.log("For amenity " + temp.tarr);
                var parkEl = {
                    act: "",
                    park: "",
                    url: ""
                }
                for (var x = 0; x < data.data[i].parks.length; x++) {
                    if (data.data[i].parks[x].states.match(state)) {
                        parkEl = {
                            act: data.data[i].name,
                            park: data.data[i].parks[x].fullName,
                            url: data.data[i].parks[x].url
                        }
                        console.log(parkEl);
                        parksForChosenAmenity[parksForChosenAmenity.length] = parkEl;
                    }
                }
            }
        });

}

// getNPSActivities();
//getParksForChosenActivities("CA", "swimming,tubing, hiking");
// setInterval(getNPSAmenities(), 5000);
// var amenities = getAmenitiesForCategory("Food");
// console.log("Food amenities = " + amenities);  //amenities is not printed out
getParksForChosenAmenity("CA", "04D29064-B9A1-4031-AD0E-98E31EF69604");  //don't know how to access object in array - no name


