
//depends on google maps api 
//make map configurable
//make colors configurable
var PLACE = (function(){

	// var colors = {
	// 	shop : '#40AD48',
	// 	dine : '#EC008B',
	// 	drink : '#00ADEF'
	// }
	var colors = ['#40AD48','#EC008B','#00ADEF']
	var placeFilter = {};
	var exceptions = {};
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
			var categorized, exception;
			if(placeFilter[key]){
			 	categorized= place.types.some(function(placeType){
                      return (placeFilter[key].categories.indexOf(placeType) > -1);
                    });
    			exception = placeFilter[key].exceptions.indexOf(place.name) > -1;
			}
			if(placeFilter[key] == undefined || categorized || exception)
	  			return makeMarker(colors[key], placeLoc, place);
    	},	
    	getMarkerUniqueId : function(lat, lng){
	    	return lat + '_' + lng;
		}, 
		//filters places service results
		addCustomCategory : function(key, categories, exceptions){
  			placeFilter[key] = { categories: categories, exceptions : exceptions};

		}
	}  

})();