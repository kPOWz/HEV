/**
 * GoogleMapsAPI Loader Module
 * 
 * Returns a promise that resolves with the google.maps object when all of the google maps api loading process is complete
 * 
 * Example Usage:
 *
 * 	define([ 'app/lib/google-maps-loader' ], function(GoogleMapsLoader){
 * 		GoogleMapsLoader.done(function(GoogleMaps){
 *			// your google maps code here!
 *			var geocoder = new GoogleMaps.Geocoder();
 *		}).fail(function(){	
 *			console.error("ERROR: Google maps library failed to load");
 *		});
 *	});
 *
 *	-OR-
 *
 *	define([ 'app/lib/google-maps-loader' ], function(GoogleMapsLoader){
 * 		GoogleMapsLoader.done(function(){
 *			// your google maps code here!
 *			var geocoder = new google.maps.Geocoder();
 *		}).fail(function(){	
 *			console.error("ERROR: Google maps library failed to load");
 *		});
 *	});
 *
 */

var google_maps_loaded_def = null;

define(['npo'],function() {
  
  if(!google_maps_loaded_def) {
    
  // google_maps_loaded_def = $.Deferred();

  window.google_maps_loaded = function() {
    //google_maps_loaded_def.resolve(google.maps);
    //google_maps_loaded_def = Promise.resolve(google.maps);
     Promise.resolve(google.maps);
    //fulfill(google.maps);    
  }

   var google_maps_loaded_def = new Promise(function(fulfill, reject) {
      require(['http://maps.googleapis.com/maps/api/js?v=3.exp&callback=google_maps_loaded&key=AIzaSyBL0KrKrs7oKIS0Dlo3s9-ktwCt2iwCE1s&sensor=false&libraries=places,visualization']
          ,function(){
            fulfill(google.maps);
          },function(err) {
            //google_maps_loaded_def =Promise.reject(new Error('Whatever'));
            reject(new Error('Whatever'));
            //google_maps_loaded_def.reject();
            //throw err; // maybe freak out a little?
        });
    });
    
  }
  
  //return google_maps_loaded_def.promise();
  return google_maps_loaded_def;
  
});