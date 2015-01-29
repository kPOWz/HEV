var map, placesService, resultList, infowindow, kmlLayer;
var places = [];

var uncategorizedStoreInclude = ['Bargain Basket', 'Liberty Gifts', 'Hammer Pharmacy', 'Ephemera', 'Found Things', 'Jett and Monkey\'s Dog Shoppe'
  , 'Subsect Skateboard Shop', 'Vanity & Glamour Cosmetics / VGCosmetic Makeup Artists','Porch Light', 'Green Goods For The Home', 'Metroretro'];

var storeTypes = ['furniture_store','clothing_store','bicycle_store','home_goods_store','jewelry_store','pet_store'
      ,'shoe_store','grocery_or_supermarket', 'art_gallery' , 'book_store','thrift_store'];

function initialize() {
  var centerLatlng = new google.maps.LatLng(41.58950,-93.612);
  var styles = [
  	{ featureType: "road", elementType: "geometry.fill", stylers: [ { color: "#cccccc" } ] },
  	{ featureType: "road", elementType: "labels.text.fill", stylers: [ { color: "#000000" } ] },
    { featureType:"landscape.man_made", elementType: "geometry.fill", stylers:[{hue:0},{saturation:100},{lightness:100}]},
    { featureType:"poi", elementType:"labels", stylers:[{visibility:"off"}]},
    { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers:[{"color": "#D1AB38"},{ "lightness": -35 }]}
  ];

  var mapOptions = {
    zoom: 15,
    maxZoom: 19,
    minZoom: 15,
    center: centerLatlng,
    backgroundColor: '#FFFFFF',
    styles: styles,
    mapTypeControl: false,
  };

  var mapCanvas = document.getElementById('map-canvas');
  map = new google.maps.Map(mapCanvas,mapOptions);

  //var bikeLayer = new google.maps.BicyclingLayer();
  //bikeLayer.setMap(map);
    
 var requestCategorizedStore = {
      location: centerLatlng,
      radius: 250,
      types: storeTypes
  };

  var requestUncategorizedStore = {
      location: centerLatlng,
      radius: 200,
      types: ['store']
  };

  var requestDining = {
      location: centerLatlng,
      radius: 300,
      types: ['restaurant', 'cafe']
  };

  var requestDrink = {
      location: centerLatlng,
      radius: 450,
      types: ['cafe', 'bar', 'night_club', 'lounge']
  };
  NEIGHBORHOOD.addRequest(0, requestCategorizedStore, callback);
  NEIGHBORHOOD.addRequest(0, requestUncategorizedStore, callback);
  NEIGHBORHOOD.addRequest(1, requestDrink, callback);
  NEIGHBORHOOD.addRequest(2, requestDining, callback);
  PLACE.addCustomCategory(0, storeTypes, uncategorizedStoreInclude);

  kmlLayer = new google.maps.FusionTablesLayer({
    query: {
      select: 'geometry',
      from: '1400IQGlzH5dGWJsruolfKlOXFXjUkJvxUXPD8QCW',
      where: "'NHNAME' = 'Historic East Village'"
    },
    styles:[{polygonOptions:{fillOpacity: 0.1, strokeColor: "#CC3333"}}]
  });
  NEIGHBORHOOD.draw(kmlLayer, map);

  placesService = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(map, 'zoom_changed', setNeighborhood);

}

function callback(results, status, pagination) {
  var resultsCount = 0;

	if(status != google.maps.places.PlacesServiceStatus.OK){
		return;
	}
  var cat = document.getElementById('select-cat');
  if(cat) var key = cat.value;

	createPlaces(results, places, key);
  resultsCount += results.length;

	if (pagination.hasNextPage) {	 	
	 	pagination.nextPage();
	}else{
    console.log(resultsCount);
    if(cat) NEIGHBORHOOD.addLayer(key, places);
    createInfoWindows(places);
  }
}

function createPlaces(pagedResults, places, key){
	for (var i = 0; i < pagedResults.length; i++) {
    var place = pagedResults[i];
		var marker = PLACE.createMarker(map, place, key);
    if(marker && marker.getPosition()){
      var generatedMarkerId = PLACE.getMarkerUniqueId(marker.getPosition().lat(), marker.getPosition().lng());
      places.push({markerId: generatedMarkerId, marker: marker, reference: place.reference});
    }
  }
}

function createInfoWindows(markers){
  for (var i = 0; i < markers.length; i++) {
    INFOWINDOW.createInfoWindow(markers[i], placesService, infowindow, map);
  }
}

function changeCategory(sender){
  places = [];
  sender.className = sender.options[sender.selectedIndex].innerHTML.toLowerCase();;
  infowindow.close();
  NEIGHBORHOOD.switchLayer(sender.value, map, placesService);
}

function setNeighborhood(event){
  if(map.getZoom() <= 15){
    kmlLayer.setMap(map);

  }else{
    kmlLayer.setMap(null);
  }
}

google.maps.event.addDomListener(window, 'load', initialize); 
