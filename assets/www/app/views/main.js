marina.views.main = function() {
  var defaultPosition = {
    coords: {
      latitude: 47.688157,
      longitude: - 122.425461
    }
  };

  var connectedView = function() {

    var view = {}; 
    var geoSuccess = function(position) {
      marina.map = marina.googleMap({coords: position.coords});
    };
    var geoFail = function(e) {
      console.log('Failed to get geolocation, using default location' + e);
      geoSuccess(defaultPosition);
    };

    view.show = function() {
      console.log('connected');
      try {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
      } catch(err) {
        geoFail(err);
      }
    };
    return view;
  }();

  var disconnectedView = function() {
    var view = {};
    view.show = function() {
      console.log('disconnected');
      $('#map_canvas').html('No connection!');
    };
  }();

  return function() {
    console.log('return main view state function');
    return function() {
     console.log('adding main view envent listerners for state');
     document.addEventListener("online", connectedView.show, false);
     document.addEventListener("offline", disconnectedView.show, false);
      console.log('main state function');
      if (marina.util.isConnected()) {
        return connectedView;
      }
      return disconnectedView;
    };
  }();
}();
