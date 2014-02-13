var map, placesService, resultList, infowindow;
/*var placesService;
var resultList;*/

var infowindow;
var resultsCount = 0;
//var markers = [];

var storeMarkers = [];
var diningMarkers = [];
var serviceMarkers = [];

//createInfoWindows();

function initialize() {

	// Center of Map
  var centerLatlng = new google.maps.LatLng(41.590187,-93.611094);
    
	// Create an array of styles.
  var styles = [
    //{ stylers: [ {inverse_lightness: true} ] },
  	{ featureType: "road", elementType: "geometry.fill", stylers: [ { color: "#cccccc" } ] },
  	{ featureType: "road", elementType: "labels.text.fill", stylers: [ { color: "#000000" } ] },
    { featureType:"landscape.man_made", elementType: "geometry.fill", stylers:[{hue:0},{saturation:100},{lightness:100}]},
    {featureType:"poi",elementType:"label",stylers:[{visibility:"simplified"}]} 
  ];


  var mapOptions = {
    zoom: 16,
    maxZoom: 18,
    minZoom: 15,
    center: centerLatlng,
    backgroundColor: '#FFFFFF',
    styles: styles,
    mapTypeControl: false,
  };
  
  // Define HEV boundary
  //TODO: via KML instead
  var mapCanvas = document.getElementById('map-canvas');
  map = new google.maps.Map(mapCanvas,mapOptions);
      
    var hevCoords = [
      new google.maps.LatLng(41.5905, -93.6176),
      new google.maps.LatLng(41.5945, -93.5983),
      new google.maps.LatLng(41.5897, -93.5968),
      new google.maps.LatLng(41.5898, -93.5980),
      new google.maps.LatLng(41.5863, -93.6160),
      new google.maps.LatLng(41.5862, -93.6161),
      new google.maps.LatLng(41.5876, -93.6166),
      new google.maps.LatLng(41.5885, -93.6169),
      new google.maps.LatLng(41.5895, -93.6172),
      new google.maps.LatLng(41.5900, -93.6174),
      new google.maps.LatLng(41.5905, -93.6176)
  ];

  // Construct the polygon.
  hevBoundaries = new google.maps.Polygon({
    paths: hevCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0,
    
  }); 
  hevBoundaries.setMap(map);
    
  var requestStore = {
      location: centerLatlng,
      radius: 250,
      types: ['clothing_store','bicycle_store','home_goods_store','jewelry_store','pet_store','shoe_store','store']
  };

  var requestDining = {
      location: centerLatlng,
      radius: 250,
      types: ['restaurant', 'cafe', 'bar']
  };

  var requestService = {
      location: centerLatlng,
      radius: 250,
      types: ['spa', 'atm','gym', 'florist','pharmacy']
  };

  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch(requestStore, storeCallback);
  //placesService.nearbySearch(requestDining, diningCallback);
  //placesService.nearbySearch(requestService, serviceCallback);

  //var t = document.querySelector('#catTemplate');
  //t.content.querySelector('img').src = 'hev-logo.png';
  //var clone = document.importNode(t.content, true);
  //mapCanvas.appendChild(clone);

  infowindow = new google.maps.InfoWindow();
}
 
function makeMarker(color, placeLoc){
  
  	return new google.maps.Marker({
    	icon: {
      		path: google.maps.SymbolPath.CIRCLE,
      		scale: 6,
      		fillColor: color,
      		fillOpacity: 1.0,
      		strokeColor: 'white',
      		strokeOpacity: 1.0,
      		strokeWeight: 1
    	},
    	map: map,
    	position: placeLoc
  	}); 
}  

function storeCallback(results, status, pagination) {
  callback(results, status, pagination, storeMarkers) 
}

function diningCallback(results, status, pagination) {
  callback(results, status, pagination, diningMarkers) 
}

function serviceCallback(results, status, pagination) {
  callback(results, status, pagination, serviceMarkers);
}

function callback(results, status, pagination, markers) {

	if(status != google.maps.places.PlacesServiceStatus.OK){
		return;
	}

	createMarkers(results, markers);
  resultsCount += results.length;
  //categorizePlaces(results); //remove

	if (pagination.hasNextPage) {	 	
	 	pagination.nextPage();
	}else{
    //var t = document.querySelector('#catTemplate');
    //var catList = t.content.querySelector('#categories');
    //remove
    /*categories.forEach(function(category) { 
      var li = document.createElement('li');
      li.innerText = category[0] + "-" + category[1]; 
      catList.appendChild(li);
    });*/
    console.log(resultsCount);
    createInfoWindows(markers);
    /*t.content.querySelector('#totalHevPlaces').innerText = resultsCount;
    var mapCanvas = document.getElementById('map-canvas');
    var clone = document.importNode(t.content, true);
    mapCanvas.appendChild(clone);*/
  }
}

function createMarkers(pagedResults, markers){
	for (var i = 0; i < pagedResults.length; i++) {
    var place = pagedResults[i];
		var marker = createMarker(place);
    //markers.push({reference: place.reference, marker: marker});
    markers.push({markerId: marker.__gm_id, marker: marker, reference: place.reference})
    //createMarkerInfoWindow(marker, place.reference);
  }
}

function mostImportantType(types){
  var dict = {};
  types.forEach(function(type){
      //add property to dictionary each time
      scorePlaceType(type, dict)
    });

  var keys = Object.keys(dict);
  var highest = Math.max.apply(Math, keys);
  return dict[highest];
}

function scorePlaceType(type, dict){

  var score;
  switch (type) {
    case 'pharmacy':
    case 'spa':
    case 'gym':
      score = 5;
      break;
    case 'cafe':
      score = 4;
      break;
    case 'restaurant':
      score = 3;
      break;
    case 'bar':
      score = 2;
      break;
    case 'store':
      score = 1;
      break;
    default:
      score = 0;
  }

  dict[score] = type;
}

function createMarker(place) {

	var marker;
  var placeLoc = place.geometry.location;
  console.log(place.name + ":\t " + place.types);
  var iconUrl;

  var type = mostImportantType(place.types);

  switch (type) {
    case 'pharmacy':
    case 'spa':
    case 'gym':
        marker = makeMarker('red', placeLoc); // red - other service
        break;
   	case 'restaurant':
        marker = makeMarker('#EC008B', placeLoc); //#EC008B pink - eat
        break;
    case 'cafe':
        marker = makeMarker('aqua', placeLoc); //aqua cafe
        break;
    case 'bar':
  	     marker = makeMarker('#00ADEF', placeLoc); //#00ADEF blue - drink
        break;
    case 'store':
    	marker = makeMarker('#40AD48', placeLoc);  //#40AD48 green - shop
        break;
    default:
    	marker = makeMarker('black', placeLoc);
    }
  return marker;
}

function createInfoWindows(markers){
  for (var i = 0; i < markers.length; i++) {
    createInfoWindow(markers[i].marker, markers[i].reference);
  }
}

function createInfoWindow(marker, placeReference){
  console.log("reference: " + placeReference);
  google.maps.event.addListener(marker, 'click', function() {

      var markerMatch = storeMarkers.filter(function( obj ) {
        return obj.markerId == marker.__gm_id;
      });

      var request = {
        reference: markerMatch[0].reference
      }
      placesService.getDetails(request, function(place, status){

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            infowindow.setContent(place.name);
            infowindow.open(map, markerMatch[0].marker);

        }else{
          console.warn("not ok place with reference" + markerMatch[0].reference)
        }

      });

    });
    /*var request = {
      reference: placeReference
    };
    placesService.getDetails(request, function(place, status){
      
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if(place){
          console.log(" ok for " + place.name + " with ref " + placeReference);
        }else{
          console.log(" ok no place ");
        }
          google.maps.event.addListener(marker, 'click', function() {
            var marker = this;
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
      }
      else{
        if(place){
        console.log("not ok for " + place.name);
        }else{
          console.log("not ok no place for place w/ ref " + placeReference);
        }
      }
  });*/
}

google.maps.event.addDomListener(window, 'load', initialize); 
