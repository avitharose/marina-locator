var navigator = {}, coords, mapCanvas = 'map_canvas', mapOptions;

describe('Main view', function() {
  var $arg;

  beforeEach(function() {
    marina.util = function() {
      var util = {};
      util.connectedState = false;
      util.isConnected = function() {
        return util.connectedState;
      };
      return util;
    }();

    setFixtures('<select id="map-options"><option value="opt1">Opt1</option></select>');
    appendSetFixtures('<div id="map_canvas"></div>');

  });

  it('should exists', function() {
    expect(marina.views.main).toBeDefined();
  });

  describe('connected view', function() {

    var origGoogleMap;

    beforeEach(function() {
      marina.util.connectedState = true;
      coords = {
        lattitude: 1,
        longitude: 2
      };
      origGoogleMap = marina.googleMap;
      marina.googleMap = jasmine.createSpy();
    });

    afterEach(function() {
      marina.googleMap = origGoogleMap;
    });

    it('should enhance options for multi select list', function() {
      navigator.geolocation = {
        getCurrentPosition: function(success, fail) {
          success({ coords: coords });
        }
      };
      marina.views.main().show();
      console.log('opts text: ' + $('#map-options').parent().text());
      expect($("#map-options").multiselect("widget").find(":checkbox").length).toEqual(1);
    });

    it('should create map with coords when geo available', function() {
      navigator.geolocation = {
        getCurrentPosition: function(success, fail) {
          success({ coords: coords });
        }
      };
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
      expect($('#map_canvas').text()).toEqual('No connection!');
    });

  });

});
