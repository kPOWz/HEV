//depends on  google maps js api
// map
//places service
// zoom thresholds
var NEIGHBORHOOD = (function(){
  
  //private, closed up into NEIGHBORHOOD namespace
  //array of sets of markers
  var layers=[];
  var requests = {};
  var neighborhoodViewZoomThreshold = 15;


  var hideMarkers = function(key){ 
    if(layers.length < 1) return;

    var shownLayer;
  	if(layers[key]) {
      shownLayer= layers[key];
      delete layers[key];
    }
  	//TODO: how can we avoid quadratic with an algorithm?
  	layers.forEach(function(layer){
  		layer.forEach(function(marker){
  			marker.marker.setVisible(false);
  		})
  	});

  	if(!layers[key]) layers[key] = shownLayer;
  }

  var showMarkers = function(markersArray){
  	markersArray.forEach(function(markerContainer){
      markerContainer.marker.setVisible(true);
    });
  }

  var fetchMarkers = function(request, callback, placesService){
  	placesService.nearbySearch(request, callback);
  }

  var changeCategory = function(key, placesService){
	  hideMarkers(key)

	  //if an infopane was set durring init, do this
	  var infoPane = document.getElementById('place-detail-pane-close'); //TODO: MOVE
	  if(infoPane) infoPane.click(); //TODO: MOVE

	  if(layers[key] != undefined){
  		showMarkers(layers[key]);
	  }
	  else{
	  	for(var i = 0; i < requests[key].length; i++){
	  		fetchMarkers(requests[key][i].request, requests[key][i].callback, placesService);
	  	}
	  }
	}
  
  return {
    switchLayer : function(key, map, placesService){
    	changeCategory(key, placesService);
    	if(map.getZoom() < 17) map.setZoom(17);
    },
    addRequest : function(key, request, callback){
  		if(requests[key] == undefined){
  	  		requests[key] = [{ request: request, callback : callback}];}
  		else{
    			requests[key].push({ request: request, callback : callback});}
    },
    addLayer : function(key, layer){
      if(layers[key] == undefined) layers[key] = layer; //layer may be marker set
    },
    drawLayer : function(key, placesService){
      if(layers[key] == undefined) {
        fetchMarkers(requests[key].request, requests[key].callback, placesService);
      }
      //layer already requested
      else{
        showMarkers(layers[key]);
      }
    },
    draw : function(shape, map){
      if(map.getZoom() <= neighborhoodViewZoomThreshold){
        shape.setMap(map); // || settings.map

      }else{
        kmlLayer.setMap(null);
      }
	}
  };
})();