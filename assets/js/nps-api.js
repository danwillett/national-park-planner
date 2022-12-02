// import API key 
import {
    apiKeyNPS
} from './config.js';

//Global variables
var activitesOffered = [];
//const apiKeyNPS = "NDZSe6czvljUqPWzAafvguTs7HGv603tT2jWKz02";  

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

            for(var i = 0; i <data.data.length; i++){
                console.log(data.data[i].name);
                // activitesOffered[i] = data[i].name;
                // console.log(activitesOffered[i], data[i].name);
            }
        });
}

getNPSActivities();