//depends on google maps api
//depends on PLACE
//depends on places service
//depends on modernizr
var INFOWINDOW = (function(){

	//TODO: infowindow singleton

	var addClickEvent = function(ele){
	  if(typeof ele!='undefined' && !ele.click) {
	    ele.click=function() {
	        var evt = this.ownerDocument.createEvent('MouseEvents');
	        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	        this.dispatchEvent(evt);
	    }
	  }
	}

	var getDetails = function(placeReference, infoWindow){
  		var request = {
    		reference: placeReference
      	}
	      
		placesService.getDetails(request, function(place, status){
			//TODO: switch to DocumentFragment depending on performance
			var content = '<a href="#" id="place-detail-pane-close" class="button">X</a>'
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			  content = content
			    +  '<div class="h-card">'
			    + '<p class="p-name"><strong>'+ place.name +'</strong></p>'
			    + '<div class="p-tel tel">'
			    +   '<dt>Phone: </dt>'
			    +   '<dd><a class="value phone" href="tel:'+place.formatted_phone_number+'"> '+place.formatted_phone_number+'</a></dd>'
			    + '</div>'
			    + '<p class="p-adr h-adr">'
			        +'<div class="p-street-address street-address" >'+place.address_components[0].short_name 
			          + " " + place.address_components[1].short_name+'</div>'
			      +'</p>'
			    +'</div>';
			}else{
			  console.warn("not ok place with reference" + markerContainer.reference);
			  content =  content
			    + '<p class="p-name"><strong>place detail could not be retrieved </strong></p>';
			}
			if(Modernizr.csstransitions && Modernizr.csstransforms){
			    var placeDetail = document.getElementById('place-detail-pane'); //TODO: factor out
			    if(placeDetail){
			        placeDetail.innerHTML = content;
			    }
			  }
			else{
			  infoWindow.setContent(content);
			  infoWindow.open(map, markerContainer.marker);
			}
		});
	}

	return{

		createInfoWindow : function(markerContainer, placesService, infoWindow, map){
			
			google.maps.event.addListener(markerContainer.marker, 'click', function() {
    			getDetails(markerContainer.reference, infoWindow);
		    	var anchor = document.getElementById('trigger-detail-pane'); //TODO: factor out
			    if(!anchor.click){
			      addClickEvent(anchor);
			    }
			    anchor.click(); 
		    });
		}

	};

})();