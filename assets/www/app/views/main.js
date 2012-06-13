marina.views.main = function() {
  var view = {}, defaultPosition = {
    coords: {
      latitude: 47.688157,
      longitude: - 122.425461
    }
  };

  var connectedView = {
    geoSuccess: function(position) {
      marina.map = marina.googleMap({coords: position.coords});
    }, 
    
    geoFail: function(e) {
      console.log(e);
      this.geoSuccess(defaultPosition);
    },

    show: function() {
      console.log('connected');
      try {
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.getFail);
      } catch(err) {
        connectedView.geoFail(err);
      }
    }
  };

  var disconnectedView = {
    show: function() {
      console.log('disconnected');
      $('#map_canvas').html('No connection!');
    }
  };

  var state = function() {
    document.addEventListener("deviceready", function() {
      document.addEventListener("online", state().show, false);
      document.addEventListener("offline", state().show, false);
    }, false);
    return function() {
      if (marina.util.isConnected()) {
        return connectedView;
      }
      return disconnectedView;
    };
  }();

  view.show = function() {
    state().show();
  };

  return view;
}();
