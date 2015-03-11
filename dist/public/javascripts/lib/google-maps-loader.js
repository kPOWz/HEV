var google_maps_loaded_def = null;

define(['bluebird.min'],function() {
  
  if(!google_maps_loaded_def) {
    
  google_maps_loaded_def = P.defer();  //.pending() should be exposed by bluebird but erroring as undefined

  window.google_maps_loaded = function() {
    google_maps_loaded_def.resolve(google.maps);  
  }

  require(['http://maps.googleapis.com/maps/api/js?v=3.exp&callback=google_maps_loaded&key=AIzaSyBL0KrKrs7oKIS0Dlo3s9-ktwCt2iwCE1s&sensor=false&libraries=places,visualization']
    ,function(){},function(err) {
    google_maps_loaded_def.reject(err);
      //throw err; // maybe freak out a little?
  });
    
  }
  
  return google_maps_loaded_def.promise;
  
});