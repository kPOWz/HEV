define([ 'google-maps-loader', 'promises_poly' ], function(GoogleMapsLoader){
		GoogleMapsLoader.done(function(){
			requirejs(['app/map.min']);
		}, function(error){ console.error("ERROR: Google maps library failed to load"); });
	});

