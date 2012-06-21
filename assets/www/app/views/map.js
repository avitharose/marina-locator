marina.googleMap = function(options) {
  var map = {}, googleMap, infoWindow, markers = {};

  map.positionChanged = function(position) {
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    map.currentLocation.setPosition(latlng);
  };

	map.addLocationMarkerTo = function(opts) {
		map.currentLocation = new google.maps.Marker({
			position: opts.latlng,
			map: googleMap,
			icon: 'images/sailboat.png',
			title: "Your location"
		});
    navigator.geolocation.watchPosition(map.positionChanged);
	};

  map.addMarinaLayer = function() {
    var marinaLayerOptions = {
      preserveViewport: true
    };
    var marinaLayer = new google.maps.KmlLayer('https://maps.google.com/maps/ms?ie=UTF8&authuser=0&msa=0&output=kml&msid=217422876588338854635.0004c133df227ae5aa19c', marinaLayerOptions);
    marinaLayer.setMap(googleMap);
    google.maps.event.addListener(marinaLayer, 'status_changed', function() {
      marina.util.stopSpinner();
    });
  };
  
  function createMarker(place, options) {
    var marker = new google.maps.Marker({
      icon: 'images/' + options.image + '.png',
      map: googleMap,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      var content = '<h3>' + place.name + '</h3>';
      content += '<span class="title">Rating:</span>';
      content += '<span class="info">' + place.rating + '</span>';
      infoWindow.setContent(content);
      infoWindow.open(googleMap, this);
      infoWindow.currentPlaceId = place.id;

      var request = {
        reference: place.reference
      };
      var service = new google.maps.places.PlacesService(googleMap);
      service.getDetails(request, function(place, status) {
        console.log('recieved details for: ' + place.name); 
        var content = '<div id="details">'; 
        content += '<h3>' + place.name + '</h3>';
        content += '<div><h2>Rating:</h2>' + place.rating + '</div>';
        content += '<div><h2>Phone:</h2>' + place.formatted_phone_number + '</div>';
        content += '<div><h2>Address:</h2></div><div>' + place.formatted_address + '</div>';
        content += '<div><a target="_blank" href=' + place.website + '>Website</a></div>';
        content += '</div>';
        if (infoWindow.currentPlaceId === place.id) {
          infoWindow.setContent(content);
        }
      });
    });
    return marker;
  }

  function searchFor(options) {
    markers[options.type] = [];
    try {
      var request = {
        bounds: googleMap.getBounds(),
        // location: googleMap.getCenter(),
        // radius: 3200,
        types: [options.type]
      };
      var service = new google.maps.places.PlacesService(googleMap);
      service.search(request, function(results, status) {
        var marker;
        console.log('search complete: ' + status + ' found: ' + results.length);
        for(var i = 0; i < results.length; i++) {
          marker = createMarker(results[i], options);
          markers[options.type].push(marker);
        }
        marina.util.stopSpinner();
      });
    } catch(err) {
      console.log('error doing places search: ' + err);
      marina.util.stopSpinner();
    }
  }

  function removeMarkersFor(type) {
    for(var i = 0; i < markers[type].length; i++) {
      markers[type][i].setMap(null);
    }
    markers[type] = {};
    marina.util.stopSpinner();
  }

  map.addOptionsHandler = function() {
    $('#map-options').bind('multiselectclick', function(event, ui) {
      marina.util.startSpinner();
      $(this).multiselect('close');
      var searchType = ui.value;
      var image = $(this).find('option[value="' + searchType + '"]').data('image');
      console.log('image for search: ' + image);
      console.log('mulit select click: ' + searchType);
      if (ui.checked) {
        searchFor({type: searchType, image: image});
      } else {
        removeMarkersFor(searchType);
      }
    });
  };

  function updateOptionMarkers() {
    console.log('map bounds changed');
    $('#map-options').find('option:selected').each(function(index, element) {
      marina.util.startSpinner();
      var searchType = $(element).attr('value');
      var image = $(element).data('image');
      console.log('option: ' + searchType);
      removeMarkersFor(searchType);
      marina.util.startSpinner();
      searchFor({type: searchType, image: image});
    });
  }

  map.addViewChangeHandler = function() {
    google.maps.event.addListener(googleMap, 'dragend', updateOptionMarkers);
    google.maps.event.addListener(googleMap, 'zoom_changed', updateOptionMarkers);
  };

  var createMap = function() {
    var latlng = new google.maps.LatLng(options.coords.latitude, options.coords.longitude);
    var mapOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      mapTypeControl: false,
      streetViewControl: false
    };
    googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
    map.addMarinaLayer();
    map.addLocationMarkerTo({latlng: latlng});
    map.addOptionsHandler();
    map.addViewChangeHandler();
    return map;
  };

  return createMap();
};
