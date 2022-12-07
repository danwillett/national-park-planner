// import API key 
import {
    apiKeyNPS,
    stateInfo
} from './config.js';

//Global variables
var gState = "";
var activitesOffered = []; //activities offered by NPS
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
var clearBtn = $('#clear');



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



//get amenities list along with its id and category
function getNPSAmenities() {
    var requestURL = "https://developer.nps.gov/api/v1/amenities?limit=130&api_key=" + apiKeyNPS;

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


//This function will populate finalparkList with list of parks for chosen activites or ameties or both.  
//If no activity or amenity is chosen, it will return the parks of the state.

function findParks(state, activityList, amenityList) {

    var requestURL = "";
    finalParkList.length = 0;

    if (activityList.length !== 0 && amenityList.length === 0) {
        console.log("in findpark only act");
        parksForChosenActivity.length = 0;
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
                finalParkList = parksForChosenActivity;
                console.log("final actvity parks " + finalParkList.length);
                console.log(finalParkList);

                //display final park list on HTMl page
                var list = $('<ul>');
                for (var x = 0; x < finalParkList.length; x++) {
                    var item = $('<li>');
                    var park = $('<a>');

                    park.attr('href', finalParkList[x].url);
                    park.attr('target', '_blank');
                    park.text(finalParkList[x].park);

                    item.append(park);
                    list.append(item);
                }
                parkList.append(list);
            });
    } else if (activityList.length === 0 && amenityList.length !== 0) {
        console.log("final amenity parks");
        parksForChosenAmenity.length = 0;
        finalParkList.length = 0;

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
                        if (data.data[i][0].parks[x].states.match(state)) {
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
                console.log("final amenity parks " + finalParkList.length + "  " + finalParkList);

                //display final park list on HTMl page
                var list = $('<ul>');
                for (var x = 0; x < finalParkList.length; x++) {
                    var item = $('<li>');
                    var park = $('<a>');

                    park.attr('href', finalParkList[x].url);
                    park.attr('target', '_blank');
                    park.text(finalParkList[x].park);

                    item.append(park);
                    list.append(item);
                }
                parkList.append(list);
            });

    } else if (activityList.length === 0 && amenityList.length === 0) {
        finalParkList.length = 0;

        requestURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=" + apiKeyNPS;

        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data.data.length);

                var parkEl = {
                    park: "",
                    parkCode: "",
                    url: ""
                }

                for (var i = 0; i < data.data.length; i++) {

                    parkEl = {
                        park: data.data[i].fullName,
                        parkCode: data.data[i].parkCode,
                        url: data.data[i].url
                    }
                    console.log(parkEl);
                    finalParkList[finalParkList.length] = parkEl;


                }
            })
            .then(function () {
                console.log("final all parks " + finalParkList.length);
                console.log(finalParkList);

                //display final park list on HTMl page

                var list = $('<ul>');

                for (var x = 0; x < finalParkList.length; x++) {
                    var item = $('<li>');
                    var park = $('<a>');

                    park.attr('href', finalParkList[x].url);
                    park.attr('target', '_blank');
                    park.text(finalParkList[x].park);

                    item.append(park);
                    list.append(item);
                }
                parkList.append(list);
            });
    } else {

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
                for (var i = 0; i < data.data.length; i++) {
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
            })
            .then(function () {
                parksForChosenAmenity.length = 0;
                requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityList + "&api_key=" + apiKeyNPS;

                console.log(requestURL);

                fetch(requestURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {

                        for (var i = 0; i < data.data.length; i++) {

                            var parkEl = {
                                act: "",
                                park: "",
                                parkCode: "",
                                url: ""
                            }
                            for (var x = 0; x < data.data[i][0].parks.length; x++) {
                                if (data.data[i][0].parks[x].states.match(state)) {
                                    parkEl = {
                                        amt: data.data[i][0].name,
                                        park: data.data[i][0].parks[x].fullName,
                                        parkCode: data.data[i][0].parks[x].parkCode,
                                        url: data.data[i][0].parks[x].url
                                    }
                                    parksForChosenAmenity[parksForChosenAmenity.length] = parkEl;
                                }
                            }
                        }
                    })
                    .then(function () {
                        //get common parks which has both chosen activity and amenity
                        finalParkList.length = 0;

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
                        console.log("final both parks " + finalParkList.length);
                        console.log(finalParkList);

                        //display final park list on HTMl page

                        var list = $('<ul>');

                        for (var x = 0; x < finalParkList.length; x++) {
                            var item = $('<li>');
                            var park = $('<a>');

                            park.attr('href', finalParkList[x].url);
                            park.attr('target', '_blank');
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
    var stateCode = "";

    finalParkList.length = 0;

    for (var i = 0; i < stateInfo.length; i++) {
        if (state === stateInfo[i].name)
            stateCode = stateInfo[i].code;
    }

    var activities = activityEl.val();
    var amenities = amenityEl.val();

    console.log("state selected = " + stateCode);
    console.log("activities selected = " + activities);
    console.log("amenities selected  empty= " + amenities);

    findParks(stateCode, activities, amenities);

    //store in local storage the last search
    localStorage.clear();
    var searchParams = {
        state:stateCode,
        activityList:activities,
        amenityList:amenities
    }
    localStorage.setItem("lastSearch", JSON.stringify(searchParams));

});

// clear clear local storage, refresh page
clearBtn.click(function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
})


function restoreLastSearch(lastSearch){
    var stateCode = lastSearch.state;
    var activities = lastSearch.activityList.toString();
    var amenities = lastSearch.amenityList.toString();
    var state = "";

    

    for(var i = 0; i < stateInfo.length; i++){
        if (stateInfo[i].code === stateCode){
            state = stateInfo[i].name;
        }
    }

    //set the state name in display
    stateEl.text(state);
    activityEl.val(activities);
    amenityEl.val(amenities);

    console.log("restoreLastSearch = " + state + "**" +activities+ "**"+ amenities);

    findParks(lastSearch.stateCode, activities, amenities);
}


function init() {
    //populate all activities provided by NPS
    getNPSActivities();

    //populate all amenities provided by NPS
    getNPSAmenities();

    console.log("HERE");
    //restore from local storage
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch"));

    if(lastSearch !== null){
        console.log(lastSearch);
        restoreLastSearch(lastSearch);
    }
}



init();

