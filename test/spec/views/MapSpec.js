var coords;
var google = function() {
};
google.maps = function() {
};
google.maps.MapTypeId = function() {
};

describe('Google Map', function() {

  var options = {};

  beforeEach(function() {
    coords = {
      lattitude: 1,
      longitude: 2
    };
    options.coords = coords;
    google.maps.LatLng = jasmine.createSpy();
    google.maps.MapTypeId.TERRAIN = jasmine.createSpy();
    document.getElementById = jasmine.createSpy();
    google.maps.Map = jasmine.createSpy();
    google.maps.KmlLayer = jasmine.createSpy();
    google.maps.KmlLayer.prototype.setMap = jasmine.createSpy();
    google.maps.Marker = jasmine.createSpy();
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

});
