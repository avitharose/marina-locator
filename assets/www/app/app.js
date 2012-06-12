var marina = {};

$(function() {

	function addLocationMarkerTo(map, latlng) {
		marina.currentLocation = new google.maps.Marker({
			position: latlng,
			map: map,
			icon: 'images/sailboat.png',
			title: "Your location"
		});
    navigator.geolocation.watchPosition(positionChanged);
	}

	function deviceReady() {
		var defaultPosition = {
			coords: {
				latitude: 47.688157,
				longitude: - 122.425461
			}
		};

		var success = function(position) {
			var coords = position.coords;
			var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
			var myOptions = {
				zoom: 12,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};
			marina.map = marina.googleMap(myOptions);
			var marinaLayerOptions = {
				preserveViewport: true
			};
			var marinaLayer = new google.maps.KmlLayer('https://maps.google.com/maps/ms?ie=UTF8&authuser=0&msa=0&output=kml&msid=217422876588338854635.0004c133df227ae5aa19c', marinaLayerOptions);
			marinaLayer.setMap(marina.map.googleMap);

			marina.map.addLocationMarkerTo({latlng: latlng});
		};

		var fail = function(e) {
      console.log(e);
      if (marina.util.isConnected()) {
			  success(defaultPosition);
      } else {
        $('#map_canvas').html('No connection!');
      }
		};

    var connected = function() {
      console.log('connected');
      try {
		    navigator.geolocation.getCurrentPosition(success, fail);
      } catch(err) {
        console.log(err);
        success(defaultPosition);
      }
    };

    var disconnected = function() {
      $('#map_canvas').html('No connection!');
    };

    var positionChanged = function(position) {
			var coords = position.coords;
			var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
      marina.currentLocation.setPosition(latlng);
    };

    if (marina.util.isConnected()) {
		  connected();
	    document.addEventListener("online", connected, false);
    } else {
      $('#map_canvas').html('No connection!');
	    document.addEventListener("offline", disconnected, false);
    }
	}

	document.addEventListener("deviceready", deviceReady, false);

});

