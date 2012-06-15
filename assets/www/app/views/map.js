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
  };
  
  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: googleMap,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(place.name);
      infoWindow.open(googleMap, this);
    });
    return marker;
  }

  function searchFor(type) {
    markers[type] = [];
    try {
      var request = {
        // bounds: googleMap.getBounds(),
        location: googleMap.getCenter(),
        radius: 3200,
        types: [type]
      };
      var service = new google.maps.places.PlacesService(googleMap);
      service.search(request, function(results, status) {
        var marker;
        console.log('search complete: ' + status + ' found: ' + results.length);
        for(var i = 0; i < results.length; i++) {
          marker = createMarker(results[i]);
          markers[type].push(marker);
        }
      });
    } catch(err) {
      console.log('error doing places search: ' + err);
    }
  }

  function removeMarkersFor(type) {
    for(var i = 0; i < markers[type].length; i++) {
      markers[type][i].setMap(null);
    }
    markers[type] = {};
  }

  map.addOptionsHandler = function() {
    $('#map-options').bind('multiselectclick', function(event, ui) {
      var searchType = ui.value;
      console.log('mulit select click: ' + searchType);
      if (ui.checked) {
        searchFor(searchType);
      } else {
        removeMarkersFor(searchType);
      }
    });
  };

  var createMap = function() {
    var latlng = new google.maps.LatLng(options.coords.latitude, options.coords.longitude);
    var mapOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
    map.addMarinaLayer();
    map.addLocationMarkerTo({latlng: latlng});
    map.addOptionsHandler();
    return map;
  };

  return createMap();
};
