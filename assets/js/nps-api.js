//Developer: Rima Bhumbla
// import API key 
import {
    apiKeyNPS,
    stateInfo,
    amenitiesOffered
} from './config.js';

//Global variables
var pList = "";
var activitesOffered = []; //activities offered by NPS
var parksForChosenActivity = []; //parks where a user can find their chosen activity
//var amenitiesOffered = []; //amenities offered by NPS
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
            var activity = {
                id: "",
                name: ""
            }
            for (var i = 0; i < data.data.length; i++) {
                activity = {
                    id: data.data[i].id,
                    name: data.data[i].name
                }
                activitesOffered[i] = activity;
            }
        })
        .then(function () {
            //populate the activities dropdown on form
            for (var i = 0; i < activitesOffered.length; i++) {
                var listItem = $('<li>')
                var checkbox = $('<input>');
                checkbox.attr('type', "checkbox");
                checkbox.attr('name', 'activity');
                checkbox.attr('value', activitesOffered[i].id);
                var label = $('<label>');
                label.attr('for', activitesOffered[i].name);
                label.text(activitesOffered[i].name)
                listItem.append(checkbox);
                listItem.append(label);
                activityEl.append(listItem);
            }
        });
}



//get amenities list along with its id and category
function getNPSAmenities() {
    //populate the activities dropdown on form
    for (var i = 0; i < amenitiesOffered.length; i++) {

        var listItem = $('<li>')
        var checkbox = $('<input>');
        checkbox.attr('type', "checkbox");
        checkbox.attr('name', 'amenity');
        checkbox.attr('value', amenitiesOffered[i].id);
        var label = $('<label>');
        label.attr('for', amenitiesOffered[i].name);
        label.text(amenitiesOffered[i].name);
        listItem.append(checkbox);
        listItem.append(label);
        amenityEl.append(listItem);
    }


    //restore from local storage
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch"));

    if (lastSearch !== null) {
        restoreLastSearch(lastSearch);
    }

}

function getAmenitiesForCategory(category) {
    var amenities = [];

    for (var i = 0; i < amenitiesOffered.length; i++) {
        if (amenitiesOffered[i].category === category)
            amenities[amenities.length] = amenitiesOffered[i].name;
    }

    return amenities;
}

//Get parks from data returned from API for activities
function getParksForChosenActivity(state, data) {
    console.log("activity..." + state);
    for (var i = 0; i < data.data.length; i++) {
        var parkEl = {
            act: "",
            park: "",
            parkCode: "",
            url: ""
        }

        for (var x = 0; x < data.data[i].parks.length; x++) {
           // if (data.data[i].parks[x].states.match(state)) {
            var pState = data.data[i].parks[x].states;
            if (state.toString().match(pState)) {
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
    console.log(parksForChosenActivity);
}

//Get parks from data returned from API for amenities
function getParksForChosenAmenity(state, data) {

    for (var i = 0; i < data.data.length; i++) {

        var parkEl = {
            // act: "", should this be amt? 
            amt: "",
            park: "",
            parkCode: "",
            url: ""
        }
        for (var x = 0; x < data.data[i][0].parks.length; x++) {
          //  if (data.data[i][0].parks[x].states.match(state)) {
            var pState = data.data[i][0].parks[x].states;
            if (state.toString().match(pState)) {
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
    console.log(parksForChosenAmenity);
}

//Get all common parks when the user choose both activity and amenity.
function getCommonParks() {
    var parkEl = {
        name: "",
        code: "",
        url: ""
    }

    for (var i = 0; i < parksForChosenActivity.length; i++) {
        for (var j = 0; j < parksForChosenAmenity.length; j++) {
            if (parksForChosenActivity[i].park === parksForChosenAmenity[j].park) {
                parkEl = {
                    park: parksForChosenAmenity[j].park,
                    code: parksForChosenAmenity[j].parkCode,
                    url: parksForChosenAmenity[j].url
                }
                //check if it already exists.  If not, add it
                var exists = false;
                for (var x = 0; x < finalParkList.length; x++) {
                    if (parkEl.park === finalParkList[x].park)
                        exists = true;
                }
                if (!exists) {
                    finalParkList[finalParkList.length] = parkEl;
                }
            }

        }
    }
}


//Get all parks of the state - used when the user just give the state and do not choose any activity or amenity
function getAllParksForState(data) {
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
        finalParkList[finalParkList.length] = parkEl;
    }
}

function createFinalParkList() {
    for (var x = 0; x < finalParkList.length; x++) {
        var item = $('<li>');
        var park = $('<a>');

        park.attr('href', finalParkList[x].url);
        park.attr('target', '_blank');
        park.text(finalParkList[x].park);

        item.append(park);
        pList.append(item);
    }
}

//create an unordered list to display the final list of parks after selection
function displayFinalParkList() {

    console.log(finalParkList);

    if (pList === "") {
        pList = $('<ul>');
        createFinalParkList();
    } else {
        pList.remove();
        pList = $('<ul>');
        createFinalParkList();
    }
    parkList.append(pList);

    //display parks on the lsit on the map
    addParksToMap(finalParkList);
}

//This function will populate finalparkList with list of parks for chosen activites or ameties or both.  
//If no activity or amenity is chosen, it will return the parks of the state.

function findParks(state, activityList, amenityList) {

    var requestURL = "";

    //make sure all global arrays are empty
    parksForChosenActivity.length = 0;
    parksForChosenAmenity.length = 0;
    finalParkList.length = 0;

    //This condition will populate finalparkList with list of parks for chosen activites 
    if (activityList.length !== 0 && amenityList.length === 0) {
        requestURL = "https://developer.nps.gov/api/v1/activities/parks?q=" + activityList + "&api_key=" + apiKeyNPS;
        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                getParksForChosenActivity(state, data);
            })
            .then(function () {
                finalParkList = parksForChosenActivity;
                displayFinalParkList();

            });
        //This condition will populate finalparkList with list of parks for chosen ameties.
    } else if (activityList.length === 0 && amenityList.length !== 0) {
        requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityList + "&api_key=" + apiKeyNPS;
        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getParksForChosenAmenity(state, data);
            })
            .then(function () {
                finalParkList = parksForChosenAmenity;
                displayFinalParkList();
            });
        //This condition will populate finalparkList with list of all parks in state when the user do not choose any activity or amenity
    } else if (activityList.length === 0 && amenityList.length === 0) {
        requestURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=" + apiKeyNPS;
        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getAllParksForState(data);
            })
            .then(function () {
                displayFinalParkList();
            });
        //This condition will populate finalparkList with list of parks for both chosen activites and ameties
    } else {
        requestURL = "https://developer.nps.gov/api/v1/activities/parks?q=" + activityList + "&api_key=" + apiKeyNPS;
        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getParksForChosenActivity(state, data);
            })
            .then(function () {
                requestURL = "https://developer.nps.gov/api/v1/amenities/parksplaces?id=" + amenityList + "&api_key=" + apiKeyNPS;
                console.log(requestURL);

                fetch(requestURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        getParksForChosenAmenity(state, data);
                    })
                    .then(function () {
                        //get common parks which has both chosen activity and amenity
                        getCommonParks();
                        displayFinalParkList();
                    });
            });
    }
}

//Get all checked activities
function getSelectedActivites() {
    var activities = [];

    let checkboxes = document.querySelectorAll('input[name="activity"]:checked');

    checkboxes.forEach((checkbox) => {
        activities.push(checkbox.value);
    });

    return activities;
}

//Get all checked amenities
function getSelectedAmenities() {
    var amenities = [];

    let checkboxes = document.querySelectorAll('input[name="amenity"]:checked');

    checkboxes.forEach((checkbox) => {
        amenities.push(checkbox.value);
    });

    return amenities;
}

//Event Listener for Find Park button
submitBtn.on('click', function (event) {
    event.preventDefault();
    var state = stateEl.val();
    console.log("state = " + state);
    if (state == "") {
        console.log("State is a required field.  Please enter a valid state.");
    var requiredAlert = $('#reqd-error');
        requiredAlert.text("You must select at least one state to complete search!")
        return;
    }
    var stateCode = "";

    finalParkList.length = 0;

    //Convert state name into state code for APIs
    // for (var i = 0; i < stateInfo.length; i++) {
    //     if (state === stateInfo[i].name)
    //         stateCode = stateInfo[i].code;
    // }

    //Get list of checked activities and amenities
    var activities = getSelectedActivites();
    var amenities = getSelectedAmenities();

    //Find parks which meet the criteria
    // findParks(stateCode, activities, amenities);
    findParks(state, activities, amenities);

    //store in local storage the last search
    localStorage.clear();
    var searchParams = {
        //state: stateCode,
        state: state,
        activityList: activities,
        amenityList: amenities
    }
    localStorage.setItem("lastSearch", JSON.stringify(searchParams));
    console.log(searchParams);
});

// clear clear local storage, refresh page
clearBtn.click(function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
})

function setActivities(activities) {
    let checkboxes = document.querySelectorAll('input[name="activity"]');

    checkboxes.forEach((checkbox) => {
        for (var i = 0; i < activities.length; i++) {
            if (checkbox.value == activities[i]) {
                checkbox.checked = true;
            }
        }
    });
}

function setAmenities(amenities) {
    let checkboxes = document.querySelectorAll('input[name="amenity"]');

    checkboxes.forEach((checkbox) => {
        for (var i = 0; i < amenities.length; i++) {

            if (checkbox.value == amenities[i]) {
                checkbox.checked = true;
            }
        }
    });
}

//Get last search from the local storage
function restoreLastSearch(lastSearch) {
    var stateCode = lastSearch.state;
    var activities = lastSearch.activityList.toString();
    var amenities = lastSearch.amenityList.toString();
    var state = "";

    //Convert store state code to state name
    // for (var i = 0; i < stateInfo.length; i++) {
    //     if (stateInfo[i].code === stateCode) {
    //         state = stateInfo[i].name;
    //     }
    // }

    //set the state name in display
     stateEl.value = state;
     stateEl.val(state);
     console.log(stateEl.value);

    // populates last searched state in input as placeholder text
  //  $('input:text').attr('placeholder', "Last searched: " + state)

    setActivities(lastSearch.activityList);
    setAmenities(lastSearch.amenityList)

    console.log("Restore..." + lastSearch.state + ";" + activities + ";" + amenities);

    findParks(lastSearch.state, activities, amenities);
}

function getStates(){
    for (var i = 0; i < stateInfo.length; i++) {
        var opt = $('<option>');

        opt.attr('value', stateInfo[i].code);
        opt.text(stateInfo[i].name);
        stateEl.append(opt);
    }
}

function init() {
    //populate states in he multiselect
    getStates();

    //populate all activities provided by NPS
    getNPSActivities();

    //populate all amenities provided by NPS
    getNPSAmenities();

    //restore from local storage
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch"));

    if (lastSearch !== null) {
        restoreLastSearch(lastSearch);
    }
}



init();

