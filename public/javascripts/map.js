var map, placesService, neighborhoodPolygon, resultList, infowindow;

var requestCategorizedStore, requestUncategorizedStore, requestDining, requestDrink; //requestService;

var resultsCount = 0;

var uncategorizedStoreInclude = ['Bargain Basket', 'Liberty Gifts', 'Hammer Pharmacy', 'Ephemera', 'Found Things', 'Jett and Monkey\'s Dog Shoppe'
  , 'Subsect Skateboard Shop', 'Vanity & Glamour Cosmetics / VGCosmetic Makeup Artists','Porch Light', 'Green Goods For The Home', 'Metroretro'];

var storeTypes = ['furniture_store','clothing_store','bicycle_store','home_goods_store','jewelry_store','pet_store'
      ,'shoe_store','grocery_or_supermarket', 'art_gallery' , 'book_store','thrift_store'];

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

  // Define HEV boundary
  //TODO: via KML instead  
  var hevCoords = [
      new google.maps.LatLng(41.59533840000001,-93.6163902),
      new google.maps.LatLng(41.5945761, -93.6168087),
      new google.maps.LatLng(41.5940947, -93.6171305),
      new google.maps.LatLng(41.59387, -93.6171734),
      new google.maps.LatLng(41.5936855, -93.61730220000001),
      new google.maps.LatLng(41.5924899, -93.6178815),
      new google.maps.LatLng(41.5919042, -93.6179888),
      new google.maps.LatLng(41.5916554, -93.6179459),
      new google.maps.LatLng(41.5892482, -93.6172056),
      new google.maps.LatLng(41.5891519, -93.617152),
      new google.maps.LatLng(41.5889352, -93.6171198),
      new google.maps.LatLng(41.5887266, -93.6169696),
      new google.maps.LatLng(41.587892, -93.616755),
      new google.maps.LatLng(41.5860464, -93.6160254),
      new google.maps.LatLng(41.585934, -93.6158538),
      new google.maps.LatLng(41.5848587, -93.6155105),
      new google.maps.LatLng(41.5828043, -93.6147594),
      new google.maps.LatLng(41.582659899999996, -93.6145878),
      new google.maps.LatLng(41.5821302, -93.6142445),
      new google.maps.LatLng(41.5819215, -93.6139441),
      new google.maps.LatLng(41.5810066, -93.612442),
      new google.maps.LatLng(41.5802844, -93.6110044),
      new google.maps.LatLng(41.5792089, -93.6082578),
      new google.maps.LatLng(41.5787435, -93.6065626),
      new google.maps.LatLng(41.5784706, -93.6062407),
      new google.maps.LatLng(41.57845449999999, -93.6058116),
      new google.maps.LatLng(41.577860599999994, -93.604331),
      new google.maps.LatLng(41.5775717, -93.6033225),
      new google.maps.LatLng(41.57668890000001, -93.600812),
      new google.maps.LatLng(41.5766889, -93.6004901),
      new google.maps.LatLng(41.5763999, -93.5994601),
      new google.maps.LatLng(41.5759986, -93.5971427),
      new google.maps.LatLng(41.59018700000001, -93.5969925),
      new google.maps.LatLng(41.59581980000001, -93.5989666),
      new google.maps.LatLng(41.5949532, -93.6032796),
      new google.maps.LatLng(41.59484090000001, -93.6040306),
      new google.maps.LatLng(41.5947767, -93.60467430000001),
      new google.maps.LatLng(41.5947446, -93.6054683),
      new google.maps.LatLng(41.5947767, -93.6065197),
      new google.maps.LatLng(41.59533840000001, -93.6163902)
  ];
  neighborhoodPolygon = new google.maps.Polygon({
    path: hevCoords,
    strokeOpacity: 0,
    fillColor: '#FCEDBD',
    fillOpacity: 0.35, 
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
      types: ['cafe', 'bar', 'night_club', 'lounge']
  };

  // var hoodLayer = new google.maps.KmlLayer({
  //   url: 'https://sites.google.com/site/hevdsm/kml/boundary.kml'
  // }); 
  // hoodLayer.setMap(map);

  // var mapsEngineLayer = new google.maps.visualization.MapsEngineLayer({
  //   layerId: '00463335882591727230-12798225287603138914',
  //   map: map
  // });

  placesService = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(map, 'zoom_changed', setNeighborhood);

}

var getMarkerUniqueId= function(lat, lng) {
    return lat + '_' + lng;
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
    if(marker && marker.getPosition()){
      var generatedMarkerId = getMarkerUniqueId(marker.getPosition().lat(), marker.getPosition().lng());
      markers.push({markerId: generatedMarkerId, marker: marker, reference: place.reference});
    }
  }
}

function createMarker(place) {

	var marker;
  var placeLoc = place.geometry.location;
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
  google.maps.event.addListener(marker, 'click', function() {
    var cat = document.getElementById('select-cat').value;
    var generatedMarkerId = getMarkerUniqueId(marker.getPosition().lat(), marker.getPosition().lng());
    if(storeMarkers.length > 0 && cat == 'shop'){
      var markerMatch = storeMarkers.filter(function( obj ) {
        return obj.markerId == generatedMarkerId;
      });
    }
    if(diningMarkers.length > 0 && cat == 'dine'){
      var markerMatch = diningMarkers.filter(function( obj ) {
        return obj.markerId == generatedMarkerId;
      });
    }
    if(drinkMarkers.length > 0 && cat == 'drink'){
      var markerMatch = drinkMarkers.filter(function( obj ) {
        return obj.markerId == generatedMarkerId;
      });
    }

      var request = {
        reference: markerMatch[0].reference
      }
      
      placesService.getDetails(request, function(place, status){
      var content = '<a href="#" id="place-detail-pane-close" class="button">X</a>'
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          content = content
            +  '<div class="h-card">'
            + '<p class="p-name"><strong>'+ place.name +'</strong></p>'
            + '<div class="p-tel tel">'
            +   '<dt>Phone</dt>'
            +   '<dd><a class="value phone" href="tel:'+place.formatted_phone_number+'">'+place.formatted_phone_number+'</a></dd>'
            + '</div>'
            + '<p class="p-adr h-adr">'
                +'<div class="p-street-address street-address" >'+place.address_components[0].short_name 
                  + " " + place.address_components[1].short_name+'</div>'
              +'</p>'
            +'</div>';
        }else{
          console.warn("not ok place with reference" + markerMatch[0].reference);
          content =  content
            + '<p class="p-name"><strong>place detail could not be retrieved </strong></p>';
        }
        if(Modernizr.csstransitions && Modernizr.csstransforms){
            var placeDetail = document.getElementById('place-detail-pane');
            if(placeDetail){
                placeDetail.innerHTML = content;
            }
          }
        else{
          infowindow.setContent(content);
          infowindow.open(map, markerMatch[0].marker);
        }

      });
    
    var anchor = document.getElementById('trigger-detail-pane');
    if(!anchor.click){
      addClickEvent(anchor);
    }
    anchor.click(); 
    });
}

function changeCategory(sender){
  sender.className = sender.value; 
  hideMarkers(sender.value)
  infowindow.close();

  var infoPane = document.getElementById('place-detail-pane-close');
  if(infoPane) infoPane.click();

  if(map.getZoom() < 17) map.setZoom(17);

  if(sender.value == 'shop') {
    if(storeMarkers.length > 0) showMarkers(storeMarkers);
    else {
      placesService.nearbySearch(requestCategorizedStore, storeCallback);
      placesService.nearbySearch(requestUncategorizedStore, storeCallback);
    }
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

function addClickEvent(ele){
  if(typeof ele!='undefined' && !ele.click) {
    ele.click=function() {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
    }
  }
}

function showMarkers(markersArray){
  markersArray.forEach(function(markerContainer){
      markerContainer.marker.setVisible(true);
    });
}

function setNeighborhood(event){
  if(map.getZoom() <= 15){
    neighborhoodPolygon.setMap(map);

  }else{
    neighborhoodPolygon.setMap(null);
  }
}

google.maps.event.addDomListener(window, 'load', initialize); 
