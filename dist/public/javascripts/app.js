requirejs.config({
    "baseUrl": "javascripts/lib",
    "paths": {
      "app": "..",
      "promises_poly": "https://www.promisejs.org/polyfills/promise-done-6.1.0.min",
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);