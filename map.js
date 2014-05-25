var map, placesService, resultList, infowindow;
var requestStore, requestDining, requestDrink; //requestService;

var resultsCount = 0;

var uncategorizedStoreInclude = ['Bargain Basket', 'Liberty Gifts', 'Hammer Pharmacy', 'Ephemera', 'Found Things', 'Jett and Monkey\'s Dog Shoppe'
  , 'Subsect Skateboard Shop', 'Vanity & Glamour Cosmetics / VGCosmetic Makeup Artists','Porch Light', 'Green Goods For The Home', 'Metroretro'];

var storeTypes = ['furniture_store','clothing_store','bicycle_store','home_goods_store','jewelry_store','pet_store'
      ,'shoe_store','grocery_or_supermarket', 'art_gallery' , 'book_store'];

var storeMarkers = [];
var diningMarkers = [];
var drinkMarkers = [];
var serviceMarkers = [];

function initialize() {
  var centerLatlng = new google.maps.LatLng(41.58950,-93.612);
  var styles = [
  	{ featureType: "road", elementType: "geometry.fill", stylers: [ { color: "#cccccc" } ] },
  	{ featureType: "road", elementType: "labels.text.fill", stylers: [ { color: "#000000" } ] },
    { featureType:"landscape.man_made", elementType: "geometry.fill", stylers:[{hue:0},{saturation:100},{lightness:100}]},
    {featureType:"poi", elementType:"labels", stylers:[{visibility:"off"}]} 
  ];

  var mapOptions = {
    zoom: 17,
    maxZoom: 19,
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

  //var bikeLayer = new google.maps.BicyclingLayer();
  //bikeLayer.setMap(map);
      
    var hevCoords = [
      new google.maps.LatLng(41.5905, -93.6176),
      new google.maps.LatLng(41.5945, -93.5983),
      new google.maps.LatLng(41.5897, -93.5968),
      new google.maps.LatLng(41.5898, -93.5980),
      new google.maps.LatLng(41.5862, -93.6161),
      new google.maps.LatLng(41.5876, -93.6166),
      new google.maps.LatLng(41.5885, -93.6169),
      new google.maps.LatLng(41.5895, -93.6172),
      new google.maps.LatLng(41.5900, -93.6174),
      new google.maps.LatLng(41.5905, -93.6176)
  ];

  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.5,
    scale: 4
  };

  // Construct the polyline
  hevBoundaries = new google.maps.Polyline({
    path: hevCoords,
    strokeOpacity: 0,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }],
    map: map   
  });
    
 requestCategorizedStore = {
      location: centerLatlng,
      radius: 250,
      types: storeTypes
  };

  requestUncategorizedStore = {
      location: centerLatlng,
      radius: 200,
      types: ['store']
  };

  requestDining = {
      location: centerLatlng,
      radius: 300,
      types: ['restaurant', 'cafe']
  };

  requestDrink = {
      location: centerLatlng,
      radius: 450,
      types: ['cafe', 'bar', 'night_club', 'lounge'] //'establishment'
  };

  // requestService = {
  //     location: centerLatlng,
  //     radius: 250,
  //     types: ['spa', ,'gym', 'florist','pharmacy', 'doctor', 'dentist', 'veterinary_care', 'place_of_worship', 'church', 'hair_care'
  //               ,'grocery_or_supermarket'] //'atm' glaza, ricochet, bike collective, phtography, up down, house of bricks, wooly's, new oriental food store, east village spa, beehive, architect
  // };

  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch(requestCategorizedStore, storeCallback);
  placesService.nearbySearch(requestUncategorizedStore, storeCallback);

  var templateSelect = document.querySelector('#templateSelectCategory');
  var clone = document.importNode(templateSelect.content, true);
  var tmp = document.createElement("div");
  tmp.appendChild(clone);
  tmp.index = 1;
  tmp.id = 'select-container';
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(tmp);

  infowindow = new google.maps.InfoWindow();
}
 
function makeMarker(color, placeLoc, place){

  var circleIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    fillColor: color,
    fillOpacity: 1.0,
    strokeColor: 'white',
    strokeOpacity: 1.0,
    strokeWeight: 1

  };

	return new google.maps.Marker({
  	icon: circleIcon,
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

function drinkCallback(results, status, pagination) {
  callback(results, status, pagination, drinkMarkers) 
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

	if (pagination.hasNextPage) {	 	
	 	pagination.nextPage();
	}else{
    console.log(resultsCount);
    createInfoWindows(markers);
  }
}

function createMarkers(pagedResults, markers){
	for (var i = 0; i < pagedResults.length; i++) {
    var place = pagedResults[i];
		var marker = createMarker(place);
    if(marker){
      markers.push({markerId: marker.__gm_id, marker: marker, reference: place.reference})
    }
  }
}

function createMarker(place) {

	var marker;
  var placeLoc = place.geometry.location;
  console.log(place.name + ":\t " + place.types);
  var iconUrl;

  var cat = document.getElementById('select-cat').value;

  if(cat == 'shop') {

    var categorizedStore = place.types.some(function(placeType){
                      return (storeTypes.indexOf(placeType) > -1);
                    });
    var storeInclude = uncategorizedStoreInclude.indexOf(place.name) > -1;
    if(categorizedStore || storeInclude){
      marker = makeMarker('#40AD48', placeLoc, place); 
    }
  }
  if(cat == 'dine') marker = makeMarker('#EC008B', placeLoc, place);
  if(cat == 'drink') marker = makeMarker('#00ADEF', placeLoc, place);
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
    var cat = document.getElementById('select-cat').value;
    if(storeMarkers.length > 0 && cat == 'shop'){
      var markerMatch = storeMarkers.filter(function( obj ) {
        return obj.markerId == marker.__gm_id;
      });
    }
    if(diningMarkers.length > 0 && cat == 'dine'){
      var markerMatch = diningMarkers.filter(function( obj ) {
        return obj.markerId == marker.__gm_id;
      });
    }
    if(drinkMarkers.length > 0 && cat == 'drink'){
      var markerMatch = drinkMarkers.filter(function( obj ) {
        return obj.markerId == marker.__gm_id;
      });
    }

      var request = {
        reference: markerMatch[0].reference
      }
      placesService.getDetails(request, function(place, status){

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var t = document.querySelector('#templateInfoWindow');

            t.content.querySelector('.p-name').innerHTML = '<strong>' + place.name + '</strong>';
            var phoneElement = t.content.querySelector('.phone');
            phoneElement.href = "tel:" + place.formatted_phone_number;
            phoneElement.innerHTML = place.formatted_phone_number;
            t.content.querySelector('.p-street-address').innerHTML = place.address_components[0].short_name 
              + " " + place.address_components[1].short_name;
            //t.content.querySelector('.p-extended-address').innerHTML = place.address_components;


            //t.content.querySelector('img').src = 'hev-logo.png';
            var clone = document.importNode(t.content, true);
            var tmp = document.createElement("div");
            tmp.appendChild(clone);
            console.log(tmp.innerHTML); 
            infowindow.setContent(tmp.innerHTML);
            infowindow.open(map, markerMatch[0].marker);

        }else{
          console.warn("not ok place with reference" + markerMatch[0].reference)
        }

      });

    });
}

function changeCategory(sender){
  sender.className = sender.value; 
  hideMarkers(sender.value)
  infowindow.close();

  if(sender.value == 'shop') {
    if(storeMarkers.length > 0) showMarkers(storeMarkers);
    else placesService.nearbySearch(requestStore, storeCallback);
  }
  if(sender.value == 'dine') {
    if(diningMarkers.length > 0) showMarkers(diningMarkers);
    else placesService.nearbySearch(requestDining, diningCallback);
  }
  if(sender.value == 'drink') {
    if(drinkMarkers.length > 0) showMarkers(drinkMarkers);
    else placesService.nearbySearch(requestDrink, drinkCallback);
  }
}

function hideMarkers(category){

  if(category == 'shop') {
    diningMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
    drinkMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
  }

  if(category == 'dine') {
    storeMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
    drinkMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
  }

  if(category == 'drink') {
    storeMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
    diningMarkers.forEach(function(markerContainer){
      markerContainer.marker.setVisible(false);
    });
  }

}

function showMarkers(markersArray){
  markersArray.forEach(function(markerContainer){
      markerContainer.marker.setVisible(true);
    });
}

google.maps.event.addDomListener(window, 'load', initialize); 
