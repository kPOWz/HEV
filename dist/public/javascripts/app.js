requirejs.config({
    "baseUrl": "javascripts/lib",
    "paths": {
      "app": "..",
    }
});

// Load the main app module to start the app
define([ 'google-maps-loader', 'modernizr.custom.63874'], function(GoogleMapsLoader){
		GoogleMapsLoader.then(function(){
			requirejs(['app/map.min']);
		}, function(error){ console.error("ERROR: Google maps library failed to load"); });
	});