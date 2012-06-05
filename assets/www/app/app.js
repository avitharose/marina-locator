var marina = {};

$(function() {

	var map;

	function loader() {
		console.log('loader');
		var state = document.readyState;
		if (state == 'loaded' || state == 'complete') {
			run();
		} else {
			if (navigator.userAgent.indexOf('Browzr') > - 1) {
				setTimeout(run, 250);
			} else {
				document.addEventListener('deviceready', run, false);
			}
		}
	}

	function addLocationMarkerTo(map, latlng) {
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			icon: 'images/sailboat.png',
			title: "Your location"
		});
	}

	function run() {
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
			var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
			var marinaLayerOptions = {
				preserveViewport: true
			};
			var marinaLayer = new google.maps.KmlLayer('https://maps.google.com/maps/ms?ie=UTF8&authuser=0&msa=0&output=kml&msid=217422876588338854635.0004c133df227ae5aa19c', marinaLayerOptions);
			marinaLayer.setMap(map);

			addLocationMarkerTo(map, latlng);
		};

		var fail = function(e) {
			success(defaultPosition);
		};

		try {
			navigator.geolocation.getCurrentPosition(win, fail);
		} catch(err) {
			success(defaultPosition);
		}
	}

	//document.addEventListener("deviceready", onDeviceReady, false);
	google.maps.event.addDomListener(window, 'load', loader);

});

