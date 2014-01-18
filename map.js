var map;
var placesService;
var resultList;

function initialize() {

	// Center of Map
    var centerLatlng = new google.maps.LatLng(41.590187,-93.611094);
    
	// Create an array of styles.
  var styles = [
  
  	{ featureType: "road", elementType: "geometry.fill", stylers: [ { color: "#cccccc" } ] },
  	{ featureType: "road", elementType: "labels.text.fill", stylers: [ { color: "#000000" } ] },
  	{ featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [ { color: "#404041"}, { weight: 5 } ] },
  	{ featureType: "landscape", elementType: "geometry.fill", stylers: [ { color: "#ffffff" } ] }
  
  ];


  var mapOptions = {
    zoom: 17,
    maxZoom: 18,
    minZoom: 15,
    center: centerLatlng,
    backgroundColor: '#FFFFFF',
    styles: styles,
    mapTypeControl: false,
  };
  
  // Define HEV boundary
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
      
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
  
 /* var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    },
    map: map
  });*/


// Construct the polygon.
  hevBoundaries = new google.maps.Polygon({
    paths: hevCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0,
    
  }); 
  hevBoundaries.setMap(map);
  
  // Services: Places  1210
var request = {
    location: centerLatlng,
    radius: 700,
   // rankBy: google.maps.places.RankBy.DISTANCE,
    types: ['store', 'food', 'restaurant', 'cafe', 'bar', 'nightclub',
			'furniture_store', 'clothing_store', 'home_goods_store', 'pet_store']
};

placesService = new google.maps.places.PlacesService(map);
placesService.nearbySearch(request, callback);
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
  

function callback(results, status, pagination) {

	if(status != google.maps.places.PlacesServiceStatus.OK){
		return;
	}

	createMarkers(results);

	if (pagination.hasNextPage) {	 	
	 	pagination.nextPage();
	}
}
  
function createMarkers(pagedResults){
	for (var i = 0; i < pagedResults.length; i++) {
		createMarker(pagedResults[i]);
    }
}

function createMarker(place) {

	var marker;
    var placeLoc = place.geometry.location;

    var iconUrl;
    switch (place.types[0]) {
   	case 'restaurant':
        marker = makeMarker('#EC008B', placeLoc); //#EC008B pink - eat
        break;
    case 'bar':
    case 'nightclub':
    	marker = makeMarker('#00ADEF', placeLoc); //#00ADEF blue - drink
        break;
    case 'store':
    case 'furniture_store':
    case 'clothing_store':
    case 'home_goods_store':
    case 'pet_store':
    	marker = makeMarker('#40AD48', placeLoc);  //#40AD48 green - shop
        break;
    case 'cafe':
    	marker = makeMarker('red', placeLoc); // blue - drink
        break;
    default:
    	marker = makeMarker('aqua', placeLoc);
    }
}

google.maps.event.addDomListener(window, 'load', initialize); 
