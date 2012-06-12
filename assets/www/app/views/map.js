marina.googleMap = function(mapOptions) {
  var map = {};

  map.googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  map.positionChanged = function(position) {
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    map.googleMap.currentLocation.setPosition(latlng);
  };

	map.addLocationMarkerTo = function(opts) {
		map.currentLocation = new google.maps.Marker({
			position: opts.latlng,
			map: map.googleMap,
			icon: 'images/sailboat.png',
			title: "Your location"
		});
    navigator.geolocation.watchPosition(map.positionChanged);
	};

  return map;
};
