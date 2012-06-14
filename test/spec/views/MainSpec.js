var navigator = {}, coords;

describe('Main view', function() {
  var div = {}, mapCanvas = '#map_canvas', $arg;

  beforeEach(function() {
    marina.util = function() {
      var util = {};
      util.connectedState = false;
      util.isConnected = function() {
        return util.connectedState;
      };
      return util;
    }();

    div.html = jasmine.createSpy();
    $ = function(id) {
      $arg = id;
      return div;
    };
  });

  it('should exists', function() {
    expect(marina.views.main).toBeDefined();
  });

  describe('connected view', function() {

    beforeEach(function() {
      marina.util.connectedState = true;
      coords = {
        lattitude: 1,
        longitude: 2
      };
      navigator.geolocation = {
        getCurrentPosition: function(success, fail) {
          success({ coords: coords });
        }
      };
      marina.googleMap = jasmine.createSpy();
    });

    it('should create map with coords when geo available', function() {
      marina.views.main().show();
      expect(marina.googleMap).toHaveBeenCalledWith({coords: coords});
    });

    it('should create map with default coords when geo not available', function() {
      navigator.geolocation = {
        getCurrentPosition: function(success, fail) {
          fail('err');
        }
      };
      marina.views.main().show();
      expect(marina.googleMap).toHaveBeenCalledWith(marina.views.main().defaultPosition);
    });

  });

  describe('disconnected view', function() {

    beforeEach(function() {
      marina.util.connectedState = false;
    });

    it('should show disconnected message in #map_canvas', function() {
      marina.views.main().show();
      expect($arg).toEqual(mapCanvas);
    });

    it('should show disconnected message as html', function() {
      marina.views.main().show();
      expect(div.html).toHaveBeenCalled();
    });

  });

});
