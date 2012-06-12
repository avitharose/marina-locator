marina.googleMap = function(options) {
  var map = {}, googleMap;

  map.positionChanged = function(position) {
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    googleMap.currentLocation.setPosition(latlng);
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

  var createMap = function() {
    var latlng = new google.maps.LatLng(options.coords.latitude, options.coords.longitude);
    var mapOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    map.addMarinaLayer();
    map.addLocationMarkerTo({latlng: latlng});
    return map;
  };

  return createMap();
};
