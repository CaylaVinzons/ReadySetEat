var map;
var radius = milesToMeter(2.0);
var zoom = 14;
var currentMarker;
var currentCoord;
var destMarker;
var destCoord;

function initMap() {
    if(navigator.geolocation) {
        browserSupportFlag = true;
        var myOptions = {
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            currentCoord = initialLocation;
            curentMarker = new google.maps.Marker({
                position: initialLocation,
                title: 'Your Location',
                map: map
            });

            destMarker = new google.maps.Marker({
                position: initialLocation,
                map: map,
                draggable: true,
                title: "Drag me!"
            });
            destCoord = initialLocation;

            var zone;
            destMarker.addListener('dragend', function() {
                console.log("dragend");
                if (destCoord.lat() !== destMarker.position.lat() || destCoord.lng() !== destMarker.position.lng()) {
                    console.log("Marker changed locations");
                    destCoord = destMarker.position;
                    console.log("lat: " + destCoord.lat()+ ", lng: " + destCoord.lng());   
                    if (typeof zone !== 'undefined') {
                        zone.setMap(null);
                    }
                    zone = new google.maps.Circle({
                      strokeColor: '#E77A10',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#E77A10',
                      fillOpacity: 0.35,
                      map: map,
                      center: destCoord,
                      radius: radius
                    }); 
                }
            });

            //destMarker.addListener('dragend', toggleDrop);


        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    }
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            console.log("Unsupported browser");
            console.log
        }
    }
}

function toggleDrop() {
    if (destMarker.getAnimation() !== null) {
        destMarker.setAnimation(null);
    } else {
        destMarker.setAnimation(google.maps.Animation.DROP);
    }
}


// function distance(coord1, coord2) {
//     var latPoint = Math.abs(coord1.lat());
//     var lngPoint = Math.abs(coord1.lng());

//     var latCurr = Math.abs(coord2.lat());
//     var lngCurr = Math.abs(coord2.lng());

//     var distX = (4761 / latPoint) * Math.abs(lngPoint - lngCurr);
//     var distY = 54.6 * Math.abs(latPoint - latCurr);

//     var dist = Math.sqrt(distX * distX + distY * distY); 
//     return dist;
// }

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function milesToMeter(miles) {
    return 1609.34 * miles;
}

function secondsToMinutes(seconds) {
    return seconds / 60;
}


function requestDuration(originString, destString) {
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" 
        + originString + "&destinations= " + destString + "&key=" + googleAPIKey;
    //console.log("Distance matrix call: " + url);
    var response = httpGet(url);
    var obj = JSON.parse(response);
    //console.log(obj);
    if (obj.status === "OK") {
        return obj.rows[0].elements[0].duration.value;
    } else {
        return 0;
    }
}

function requestRestaurants(options) {

    var terms = 'food';
    var ll =  destCoord.lat() + "," + destCoord.lng();
    var category_filter = "";
    for (var i = 0; i < options.length; i++) {
        url = url + options[i];
        if (i !== options.length - 1) {
            url = url + ",";
        }
    }

    var accessor = {
        consumerSecret: authYelp.consumerSecret,
        tokenSecret: authYelp.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', ll]);
    parameters.push(['sort', 1]);
    parameters.push(['category_filter',category_filter]);
    parameters.push(['oauth_consumer_key', authYelp.consumerKey]);
    parameters.push(['oauth_consumer_secret', authYelp.consumerSecret]);
    parameters.push(['oauth_token', authYelp.accessToken]);

    var message = { 
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters 
    };

    OAuth.setTimestampAndNonce(message);  
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
    var url = OAuth.addToURL(message.action,parameterMap);

    var response = httpGet(url);
    //var response = UrlFetchApp.fetch(url).getContentText();
    //var responseObject = Utilities.jsonParse(response);
    var obj = JSON.parse(response);
    var businesses = obj.businesses;
    var restaurants = [];
    console.log(obj);
    for (var i = 0; i < businesses.length; i++) {
        var restaurant = {};
        restaurant.name = businesses[i].name;
        restaurant.rating = businesses[i].rating;
        restaurant.phone = businesses[i].phone;
        restaurant.rating_img_url_small = businesses[i].rating_img_url_small;
        restaurant.image_url = businesses[i].image_url;
        var address = "";
        var addressArray = businesses[i].location.display_address;
        for (var j = 0; j < addressArray.length; j++) {
            address = address + " " + addressArray[j];
        }
        restaurant.categories = businesses[i].categories[0];
        restaurant.address = address;
        restaurant.coordinate = businesses[i].location.coordinate;
        //console.log(restaurant);
        restaurants.push(restaurant);
    }
    return restaurants;
}


function search() {
    options = ["Japanese", "Fast food"];
    var restaurants = requestRestaurants(options);
    var farthestRestaurant = getFarthestRestaurant(restaurants);
    console.log("You have " + secondsToMinutes(farthestRestaurant.duration) + " minute(s) to decide");

    // var myLatLng = {lat: farthestRestaurant.coordinate.latitude, lng: farthestRestaurant.coordinate.longitude};
    // destMarker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     draggable: true,
    //     title: "Hi"
    // });

    restaurants = sortByProximity(restaurants);
    restaurants = sortByRating(restaurants);
}


function getFarthestRestaurant(restaurants) {
    var farthestRestaurant = restaurants[0];
    var originString = currentCoord.lat() + "," + currentCoord.lng();
    var destString = restaurants[0].coordinate.latitude + "," + restaurants[0].coordinate.longitude; 
    var duration = requestDuration(originString, destString);
    farthestRestaurant.duration = duration;

    for (var i = 1; i < restaurants.length; i++) {
        var originString = currentCoord.lat() + "," + currentCoord.lng();
        var destString = restaurants[i].coordinate.latitude + "," + restaurants[i].coordinate.longitude; 
        var duration = requestDuration(originString, destString);
        restaurants[i].duration = duration;
        if (duration > farthestRestaurant.duration) {
            farthestRestaurant = restaurants[i];
        }
    }
    return farthestRestaurant;
}

function sortByProximity(restaurants) {
    restaurants.sort(function(a, b) { 
        return a.duration - b.duration;
    });
    // for (var i = 0; i < restaurants.length; i++) {
    //     console.log(restaurants[i].name + ": " + restaurants[i].duration);
    // }
    return restaurants;
}

function sortByRating(restaurants) {
    restaurants.sort(function(a ,b) {
        return b.rating - a.rating;
    });
    // for (var i = 0; i < restaurants.length; i++) {
    //     console.log(restaurants[i].name + ": " + restaurants[i].rating);
    // }
    return restaurants;
}