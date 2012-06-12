marina.views.main = function() {
  var view = {}, defaultPosition = {
    coords: {
      latitude: 47.688157,
      longitude: - 122.425461
    }
  };

  var success = function(position) {
    marina.map = marina.googleMap({coords: position.coords});
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

  view.show = function() {
    if (marina.util.isConnected()) {
      connected();
      document.addEventListener("online", connected, false);
    } else {
      $('#map_canvas').html('No connection!');
      document.addEventListener("offline", disconnected, false);
    }
  };

  return view;
}();
