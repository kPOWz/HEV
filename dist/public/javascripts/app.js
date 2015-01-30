requirejs.config({
    "baseUrl": "javascripts/lib",
    "paths": {
      "app": "..",
      "google_maps": "//maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBL0KrKrs7oKIS0Dlo3s9-ktwCt2iwCE1s&sensor=false&libraries=places,visualization"
    }
});

// Load the main app module to start the app
requirejs(["app/map.min"]);