marina.googleMap = function(options) {
	var map = {},
	googleMap, infoWindow, markers = {};
	var util = marina.util;

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
			preserveViewport: true,
			suppressInfoWindows: true
		};
		var marinaLayer = new google.maps.KmlLayer('https://maps.google.com/maps/ms?ie=UTF8&authuser=0&msa=0&output=kml&msid=217422876588338854635.0004c133df227ae5aa19c', marinaLayerOptions);
		marinaLayer.setMap(googleMap);
		google.maps.event.addListener(marinaLayer, 'status_changed', function() {
			marina.util.stopSpinner();
		});

		google.maps.event.addListener(marinaLayer, 'click', function(event) {
			var featureData = event.featureData;
			featureData.getPosition = function() {
				return event.latLng;
			};

			// console.log(featureData.infoWindowHtml);
			var content = '<div id="details">' + featureData.infoWindowHtml + '</div>';

			var options = {
				content: content,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size( - 100, 0),
				zIndex: null,
				boxStyle: {
					background: "url('images/tipbox-200.png') no-repeat",
					opacity: 0.75,
					width: "200px"
				},
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "images/close.png",
				infoBoxClearance: new google.maps.Size(45, 20),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
			};
			var ib = new InfoBox(options);
			ib.open(googleMap, featureData);
		});
	};

	function createDisplayFor(label, value) {
		var content = '<div><h2>' + label + '</h2>';
		content += util.displayValue(value) + '</div>';
		return content;
	}

	function createDetailContent(place) {
		var content = '<div id="details">';
		content += '<h3>' + place.name + '</h3>';
		content += '<div><h2>Rating</h2><img alt="' + place.rating + '" src="images/ratings/' + place.rating + '-stars.png"></img>';
		content += createDisplayFor('Phone', place.formatted_phone_number);
		content += createDisplayFor('Address', place.formatted_address);
		if (place.website) {
			content += '<div><a target="_blank" href=' + util.displayValue(place.website) + '>Website</a></div>';
		}
		content += '</div>';
		return content;
	}

	function displayDetailOnClickFor(place, marker) {
		google.maps.event.addListener(marker, 'click', function() {
			var request = {
				reference: place.reference
			};
			var service = new google.maps.places.PlacesService(googleMap);
			service.getDetails(request, function(place, status) {
				console.log('recieved details for: ' + place.name);
				displayInfoWindowFor(place, marker);
			});
		});
	}

	function createInfoBox(options) {
		var infoBoxOptions = {
			content: options.content,
			disableAutoPan: options.disableAutoPan || false,
			maxWidth: options.maxWidth || 0,
			pixelOffset: options.pixelOffset || new google.maps.Size( - 100, 0),
			zIndex: options.zIndex || null,
			boxStyle: options.boxStype || {
				background: "url('images/tipbox-200.png') no-repeat",
				opacity: 0.75,
				width: "200px"
			},
			closeBoxMargin: options.closeBoxMargin || "10px 2px 2px 2px",
			closeBoxURL: options.closeBoxURL || "images/close.png",
			infoBoxClearance: options.infoBoxClearance || new google.maps.Size(45, 20),
			isHidden: options.isHidden || false,
			pane: options.pane || "floatPane",
			enableEventPropagation: options.enableEventPropagation || false
		};
		var ib = new InfoBox(infoBoxOptions);
		ib.open(googleMap, options.marker);
	}

	function displayInfoWindowFor(place, marker) {
		createInfoBox({
      marker:  marker,
			content: createDetailContent(place),
			pixelOffset: new google.maps.Size( - 80, 0),
			boxStyle: {
				background: "url('images/tipbox-160.png') no-repeat",
				opacity: 0.75,
				width: "180px"
			}
		});
	}

	function createMarker(place, options) {
		var marker = new google.maps.Marker({
			icon: 'images/' + options.image + '.png',
			map: googleMap,
			position: place.geometry.location
		});
		displayDetailOnClickFor(place, marker);
		return marker;
	}

	function searchFor(options) {
		markers[options.type] = [];
		try {
			var request = {
				bounds: googleMap.getBounds(),
				types: [options.type]
			};
			var service = new google.maps.places.PlacesService(googleMap);
			service.search(request, function(results, status) {
				var marker;
				console.log('search complete: ' + status + ' found: ' + results.length);
				for (var i = 0; i < results.length; i++) {
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
		for (var i = 0; i < markers[type].length; i++) {
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
				searchFor({
					type: searchType,
					image: image
				});
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
			searchFor({
				type: searchType,
				image: image
			});
		});
	}

	map.addViewChangeHandler = function() {
		google.maps.event.addListener(googleMap, 'dragend', updateOptionMarkers);
		google.maps.event.addListener(googleMap, 'zoom_changed', updateOptionMarkers);
	};

	var createMap = function() {
		var latlng = new google.maps.LatLng(options.coords.latitude, options.coords.longitude);
		var noPOIStyles = [{
			featureType: "poi",
			stylers: [{
				visibility: "off"
			}]
		}];
		var mapOptions = {
			zoom: 12,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			mapTypeControl: false,
			streetViewControl: false,
			styles: noPOIStyles
		};
		googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
		infoWindow = new google.maps.InfoWindow();
		map.addMarinaLayer();
		map.addLocationMarkerTo({
			latlng: latlng
		});
		map.addOptionsHandler();
		map.addViewChangeHandler();
		return map;
	};

	return createMap();
};

