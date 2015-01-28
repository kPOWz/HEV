
//depends on google maps api 
//make map configurable
//make colors configurable
var MARKER = (function(){

	// var colors = {
	// 	shop : '#40AD48',
	// 	dine : '#EC008B',
	// 	drink : '#00ADEF'
	// }
	var colors = ['#40AD48','#EC008B','#00ADEF']
	var getMarkerUniqueId= function(lat, lng) {
	    return lat + '_' + lng;
	}
	 
	var makeMarker = function(color, placeLoc, place){

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

	return{
		createMarker : function(map, place, key){
			var placeLoc = place.geometry.location;
	  		return makeMarker(colors[key], placeLoc, place);
    	},	
    	getMarkerUniqueId : function(lat, lng){
	    	return lat + '_' + lng;
		}
	}  

})();