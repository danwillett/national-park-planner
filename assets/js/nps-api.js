// import API key 
import {
    apiKeyNPS,
    stateInfo
} from './config.js';

//Global variables
var gState = "";
var activitesOffered = []; //activities offered by NPS
var activitiesChosen = []; //activities a user is interested in 
var parksForChosenActivity = []; //parks where a user can find their chosen activity
var amenitiesOffered = []; //amenities offered by NPS
var amenityCategories = []; //type of amenities
var parksForChosenAmenity = []; //parks where a user can find their chosen amenity
var finalParkList = []; //parks for a state with chosen sctivities and 

var stateEl = $('#state-names');
var activityEl = $('#activity-select');
var amenityEl = $('#amenity-select');
var submitBtn = $('#submit');
var parkList = $('#park-list');



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
        })
        .then(function () {
            //populate the activities dropdown on form
            for (var i = 0; i < activitesOffered.length; i++) {
                var opt = $('<option>');

                opt.attr('value', activitesOffered[i]);
                opt.text(activitesOffered[i]);
                activityEl.append(opt);
            }
        });
}

//Get parks where chosen activities are available
//This function takes as parameter a US state as location and a string variable which containa comma separated list of activities
function getParksForChosenActivities(activityList) {
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
                    parkCode: "",
                    url: ""
                }
                for (var x = 0; x < data.data[i].parks.length; x++) {
                    if (data.data[i].parks[x].states.match(gState)) {
                        parkEl = {
                            act: data.data[i].name,
                            park: data.data[i].parks[x].fullName,
                            parkCode: data.data[i].parks[x].parkCode,
                            url: data.data[i].parks[x].url
                        }

                        parksForChosenActivity[parksForChosenActivity.length] = parkEl;

                    }
                }
            }
            console.log(parksForChosenActivity.length);

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
            console.log(amenitiesOffered.length);
        })
        .then(function () {
            //populate the activities dropdown on form
            for (var i = 0; i < amenitiesOffered.length; i++) {
                var opt = $('<option>');

                opt.attr('value', amenitiesOffered[i].id);
                opt.text(amenitiesOffered[i].name);
                amenityEl.append(opt);
            }
        });
}

function getAmenitiesForCategory(category) {
    var amenities = [];

    for (var i = 0; i < amenitiesOffered.length; i++) {
        if (amenitiesOffered[i].category === category)
            amenities[amenities.length] = amenitiesOffered[i].name;
    }

    return amenities;
}

function getParksForChosenAmenity(amenityIds) {
    var requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityIds + "&api_key=" + apiKeyNPS;

    console.log(requestURL);

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            for (var i = 0; i < data.data.length; i++) {

                var parkEl = {
                    act: "",
                    park: "",
                    parkCode: "",
                    url: ""
                }
                for (var x = 0; x < data.data[i][0].parks.length; x++) {
                    if (data.data[i][0].parks[x].states.match(gState)) {
                        parkEl = {
                            amt: data.data[i][0].name,
                            park: data.data[i][0].parks[x].fullName,
                            parkCode: data.data[i][0].parks[x].parkCode,
                            url: data.data[i][0].parks[x].url
                        }
                        console.log(parkEl);
                        parksForChosenAmenity[parksForChosenAmenity.length] = parkEl;
                    }
                }
            }
        });

}

function getCommonParks() {
    finalParkList.length = 0;
    var park = {
        name: "",
        code: "",
    }

    for (var i = 0; i < parksForChosenActivity.length; i++) {
        for (var j = 0; j < parksForChosenAmenity.length; j++) {
            if (parksForChosenActivity[i].park === parksForChosenAmenity[j].park) {
                park = {
                    name: parksForChosenAmenity[j].park,
                    code: parksForChosenAmenity[j].parkCode
                }
                finalParkList[finalParkList.length] = park;
            }

        }
    }

}

//This function will populate finalparkList with list of parks for chosen activites or ameties or both.  
//If no activity or amenity is chosen, it will return the parks of the state.
function getFinalParkList() {


}

function findParks(state, activityList, amenityList) {

    var requestURL = "";
    finalParkList.length = 0;

    if (activityList.length !== 0 && amenityList.length === 0) {
        console.log("in findpark only act");
        parksForChosenActivity.length = 0;
        requestURL = "https://developer.nps.gov/api/v1/activities/parks?q=" + activityList + "&api_key=" + apiKeyNPS;

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
                        parkCode: "",
                        url: ""
                    }
                    for (var x = 0; x < data.data[i].parks.length; x++) {
                        if (data.data[i].parks[x].states.match(state)) {
                            parkEl = {
                                act: data.data[i].name,
                                park: data.data[i].parks[x].fullName,
                                parkCode: data.data[i].parks[x].parkCode,
                                url: data.data[i].parks[x].url
                            }

                            parksForChosenActivity[parksForChosenActivity.length] = parkEl;

                        }
                    }
                }
                console.log(parksForChosenActivity.length);
            })
            .then(function () {
                finalParkList = parksForChosenActivity;
                console.log("final actvity parks " + finalParkList.length + "  " + finalParkList)
            });
    } else if (activityList.length === 0 && amenityList.length !== 0) {
        console.log("final amenity parks");
        parksForChosenAmenity.length = 0;
        requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityList + "&api_key=" + apiKeyNPS;

        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                for (var i = 0; i < data.data.length; i++) {

                    var parkEl = {
                        act: "",
                        park: "",
                        parkCode: "",
                        url: ""
                    }
                    for (var x = 0; x < data.data[i][0].parks.length; x++) {
                        if (data.data[i][0].parks[x].states.match(gState)) {
                            parkEl = {
                                amt: data.data[i][0].name,
                                park: data.data[i][0].parks[x].fullName,
                                parkCode: data.data[i][0].parks[x].parkCode,
                                url: data.data[i][0].parks[x].url
                            }
                            console.log(parkEl);
                            parksForChosenAmenity[parksForChosenAmenity.length] = parkEl;
                        }
                    }
                }
            })
            .then(function () {
                finalParkList = parksForChosenAmenity;
                console.log("final amenity parks " + finalParkList.length + "  " + finalParkList)
            });

    } else if (activityList.length === 0 && amenityList.length === 0) {
        //requestURL = 
    } else {
        console.log("get common parks");
        parksForChosenActivity.length = 0;
        parksForChosenAmenity.length = 0;
        finalParkList.length = 0;

        requestURL = "https://developer.nps.gov/api/v1/activities/parks?q=" + activityList + "&api_key=" + apiKeyNPS;

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
                        parkCode: "",
                        url: ""
                    }
                    for (var x = 0; x < data.data[i].parks.length; x++) {
                        if (data.data[i].parks[x].states.match(state)) {
                            parkEl = {
                                act: data.data[i].name,
                                park: data.data[i].parks[x].fullName,
                                parkCode: data.data[i].parks[x].parkCode,
                                url: data.data[i].parks[x].url
                            }

                            parksForChosenActivity[parksForChosenActivity.length] = parkEl;

                        }
                    }
                }
                console.log(parksForChosenActivity.length);
            })
            .then(function () {
                requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityList + "&api_key=" + apiKeyNPS;

                console.log(requestURL);

                fetch(requestURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);

                        for (var i = 0; i < data.data.length; i++) {

                            var parkEl = {
                                act: "",
                                park: "",
                                parkCode: "",
                                url: ""
                            }
                            for (var x = 0; x < data.data[i][0].parks.length; x++) {
                                if (data.data[i][0].parks[x].states.match(gState)) {
                                    parkEl = {
                                        amt: data.data[i][0].name,
                                        park: data.data[i][0].parks[x].fullName,
                                        parkCode: data.data[i][0].parks[x].parkCode,
                                        url: data.data[i][0].parks[x].url
                                    }
                                    console.log(parkEl);
                                    parksForChosenAmenity[parksForChosenAmenity.length] = parkEl;
                                }
                            }
                        }
                    })
                    .then(function () {
                        var park = {
                            name: "",
                            code: "",
                            url: ""
                        }

                        for (var i = 0; i < parksForChosenActivity.length; i++) {
                            for (var j = 0; j < parksForChosenAmenity.length; j++) {
                                if (parksForChosenActivity[i].park === parksForChosenAmenity[j].park) {
                                    park = {
                                        name: parksForChosenAmenity[j].park,
                                        code: parksForChosenAmenity[j].parkCode,
                                        url: parksForChosenAmenity[j].url
                                    }
                                    finalParkList[finalParkList.length] = park;
                                }

                            }
                        }
                        console.log("final amenity parks " + finalParkList.length );
                        console.log(finalParkList);

                        var list = $('<ul>');

                        for(var x = 0; x < finalParkList.length; x++){
                            var item = $('<li>');
                            var park = $('<a>');

                            park.attr('href', finalParkList[x].url);
                            park.text(finalParkList[x].name);

                            item.append(park);
                            list.append(item);
                        }
                        parkList.append(list);
                    });
            });


    }


}

submitBtn.on('click', function (event) {
    event.preventDefault();

    var state = stateEl.val();

    for (var i = 0; i < stateInfo.length; i++) {
        if (state === stateInfo[i].name)
            gState = stateInfo[i].code;
    }

    var act = activityEl.val();
    var amt = amenityEl.val();

    console.log("state selected = " + gState);
    console.log("activities selected = " + act);
    console.log("amenities selected  empty= " + amt);

    findParks(gState, act, amt);
});

//gState = "CA";
getNPSActivities();
//getParksForChosenActivities("swimming,tubing, hiking");
//console.log("activity park list  " +parksForChosenActivity.length);
getNPSAmenities();
//  var amenities = getAmenitiesForCategory("Food");
//  console.log("Food amenities = " + amenities[1]);  //amenities is not printed out
//getParksForChosenAmenity("04D29064-B9A1-4031-AD0E-98E31EF69604,A1B0AD01-740C-41E7-8412-FBBEDD5F1443");
// getFinalParkList();


