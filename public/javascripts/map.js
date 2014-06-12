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
    zoom: 16,
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
      types: ['cafe', 'bar', 'night_club', 'lounge']
  };

  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch(requestCategorizedStore, storeCallback);
  placesService.nearbySearch(requestUncategorizedStore, storeCallback);

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
      console.log(anchor.id + ' no has click!');
      addClickEvent(anchor);
      console.log(anchor);
      console.log(anchor.id + ' now has click? ' + anchor.click);
    }
    console.log('clicking...');
    anchor.click(); 
    });
}

function changeCategory(sender){
  sender.className = sender.value; 
  hideMarkers(sender.value)
  infowindow.close();
  var infoPane = document.getElementById('place-detail-pane-close');
  if(infoPane) infoPane.click();

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

function addClickEvent(ele){
  console.log(typeof(ele));
  console.log(ele.prototype);
  if(typeof ele!='undefined' && !ele.prototype.click) {
    ele.prototype.click=function() {
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

google.maps.event.addDomListener(window, 'load', initialize); 
