var coords;
var google = function() {
};
google.maps = function() {
};
google.maps.MapTypeId = function() {
};
google.maps.event = function() {
};

describe('Google Map', function() {

  var options = {}, latlng, googleMap, currentLocation, div;

  beforeEach(function() {
    $ = function(id) {
      $arg = id;
      return div;
    };

    div = jasmine.createSpy();
    div.bind = jasmine.createSpy();

    coords = {
      lattitude: 1,
      longitude: 2
    };
    options.coords = coords;
    latlng = jasmine.createSpy();
    google.maps.LatLng = jasmine.createSpy();
    google.maps.LatLng.andReturn(latlng);
    google.maps.MapTypeId.TERRAIN = jasmine.createSpy();
    document.getElementById = jasmine.createSpy();

    googleMap = jasmine.createSpy();
    google.maps.Map = jasmine.createSpy();
    google.maps.Map.andReturn(googleMap);

    google.maps.event.addListener = jasmine.createSpy();

    google.maps.InfoWindow = jasmine.createSpy();

    google.maps.KmlLayer = jasmine.createSpy();
    google.maps.KmlLayer.prototype.setMap = jasmine.createSpy();

    currentLocation = jasmine.createSpy();
    google.maps.Marker = jasmine.createSpy();
    google.maps.Marker.andReturn(currentLocation);

    navigator.geolocation.watchPosition = jasmine.createSpy();
  });

  it('should create the latlng based on coords passed in', function() {
    marina.googleMap(options);
    expect(google.maps.LatLng).toHaveBeenCalledWith(coords.latitude, coords.longitude);
  });

  it('should use the #map_canvas as the location for the map', function() {
    marina.googleMap(options);
    expect(document.getElementById).toHaveBeenCalledWith(mapCanvas);
  });

  it('should create a google map', function() {
    marina.googleMap(options);
    expect(google.maps.Map).toHaveBeenCalled();
  });

  it('should zoom map correctly', function() {
    marina.googleMap(options);
    expect(google.maps.Map.mostRecentCall.args[1].zoom).toEqual(12);
  });

  it('should center map on passed in coords', function() {
    marina.googleMap(options);
    expect(google.maps.Map.mostRecentCall.args[1].center).toEqual(latlng);
  });

  it('should be a terrain map', function() {
    marina.googleMap(options);
    expect(google.maps.Map.mostRecentCall.args[1].mapTypeId).toEqual(google.maps.MapTypeId.TERRAIN);
  });

  describe('marina layer', function() {
    
    it('should be on the google map', function() {
      marina.googleMap(options);
      expect(google.maps.KmlLayer.prototype.setMap).toHaveBeenCalled();
    });
    
  });

  describe('on position change', function() {

    var setPosition, map, newPosition;

    beforeEach(function() {
      newPosition = {coords: {latitude: 123, longitude: 456}};
      setPosition = jasmine.createSpy();
      currentLocation.setPosition = setPosition;
      map = marina.googleMap(options);
    });

    it('should update the current location marker', function() {
      map.positionChanged(newPosition);
      expect(map.currentLocation.setPosition).toHaveBeenCalled();
    });

    it('should create a new latlng with change coords', function() {
      map.positionChanged(newPosition);
      expect(google.maps.LatLng).toHaveBeenCalledWith(123, 456);
    });

  });

  describe('current location marker', function() {

    it('should be at the coords passed in', function() {
      marina.googleMap(options);
      expect(google.maps.Marker.mostRecentCall.args[0].position).toEqual(latlng);
    });

    it('should be on the google map', function() {
      marina.googleMap(options);
      expect(google.maps.Marker.mostRecentCall.args[0].map).toEqual(googleMap);
    });

    it('should be aware of location changes', function() {
      var map = marina.googleMap(options);
      expect(navigator.geolocation.watchPosition).toHaveBeenCalledWith(map.positionChanged);
    });

  });

  describe('options', function() {

    it('should be updated on click', function() {
      marina.googleMap(options);
      expect(google.maps.event.addListener).toHaveBeenCalled();
    });

  });

});
