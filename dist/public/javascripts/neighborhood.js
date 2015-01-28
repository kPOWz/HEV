//require google maps js api
var NEIGHBORHOOD = (function(){
  
  //private, closed up into NEIGHBORHOOD namespace
  //array of sets of markers
  var layers=[];
  var requests = {};


  var hideMarkers = function(key){ 
    if(layers.length < 1) return;

    var shownLayer;
  	if(layers[key]) shownLayer= layers.splice(key,1);
  	//TODO: how can we avoid quadratic with an algorithm?
  	layers.forEach(function(layer){
  		layer.forEach(function(marker){
  			marker.marker.setVisible(false);
  		})
  	});

  	if(layers[key]) layers.push(shownLayer);
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
	  //infowindow.close(); //TODO: needs to be one global window not sure where it should be ... if it has anything to do with neighborhood, maker, place modules - seems like an independent thing

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
    	shape.setMap(map); // || settings.map
	}
  };
})();