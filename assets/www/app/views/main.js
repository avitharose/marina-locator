marina.views.main = function() {

  var searchCriteriaDialog = function() {
    return $('#search-criteria-dialog');
  };

  var searchResultsDialog = {};

  var connectedView = function() {

    var view = {}; 
    view.defaultPosition = {
      coords: {
        latitude: 47.688157,
        longitude: - 122.425461
      }
    };
    var geoSuccess = function(position) {
      console.log('geolocation succesful');
      marina.map = marina.googleMap({coords: position.coords});
    };
    var geoFail = function(e) {
      console.log('Failed to get geolocation, using default location' + e);
      geoSuccess(view.defaultPosition);
    };

    view.show = function() {
      console.log('connected');
      try {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
      } catch(err) {
        geoFail(err);
      }
    };

    view.home = function() {
      navigator.geolocation.getCurrentPosition(marina.map.center, function(e) {
        console.log('no geolocation available');
        marina.map.center(view.defaultPosition);
      });
    };

    view.search = function() {
      console.log('open search dialog');
      searchCriteriaDialog().dialog('open');
    };

    var trim = function(value, size) {
      if (value.length <= 20) {
        return value;
      }
      return value.substring(0, 20) + '...';
    };

    view.performSearch = function() {
      searchCriteriaDialog().dialog('close');
      console.log('searching for: ' + $('#search-criteria').val());
      var filtered = marina.marinas.filterBy($('#search-criteria').val());

      searchResultsDialog = $('<div></div>');
      var searchResultsList = $('<ul class="mobile-list ui-widget"></ul>');
      $.each(filtered, function(index, marina) {
        console.log(marina.name);
        var searchResultsItem = $('<li class="ui-widget-content">' + trim(marina.name) + '</li>'); 
        var centerMapButton = $('<img src="images/arrow.png"></img>');
        centerMapButton.data('button', 'centerMapAt').data('button-param', marina);
        searchResultsItem.append(centerMapButton);
        buttonize(centerMapButton);
        searchResultsList.append(searchResultsItem);
      });
      searchResultsDialog.append(searchResultsList);

      searchResultsDialog.dialog({
        title: 'Search results',
        modal: true,
        draggable: false,
        resizeable: false,
        autoOpen: true
      });
    };

    view.centerMapAt = function(location) {
      console.log('center map at ' + location.name);
      searchResultsDialog.dialog('close');
      marina.map.center({ coords: location.position }, function() { 
        google.maps.event.trigger(location.mapMarker, 'click');
      });
    };

    return view;
  }();

  var disconnectedView = function() {
    var view = {};
    view.show = function() {
      console.log('disconnected');
      $('#map_canvas').html('No connection!');
    };
    view.home = $.noop();
    view.search = connectedView.search();
    return view;
  }();

  var enhanceOptionSelect = function() {
    try {
      console.log('enhance options list');
      $('#map-options').multiselect({
        height: 'auto',
        selectedText: function(numChecked, numTotal, checkedItems) {
          return $(checkedItems).map(function(index, element) {
            return $(element).attr('title');
          }).get().join(',');
        },
        noneSelectedText: 'Map options',
        header: false
      });
    } catch(err) {
      console.log('Error enhancing options: ' + err);
    }
  };

  var buttonize = function(button) {
    button.click(function() {
      var param = button.data('button-param');
      view()[button.data('button')](param);
    });
  };

  var createButtons = function() {
    console.log('create buttons');
    $('[data-button]').each(function() {
      buttonize($(this));
    });
  };

  var createDialogs = function() {
    console.log('create search dialog');
    searchCriteriaDialog().dialog({
      title: 'Enter search critiera',
      modal: true,
      draggable: false,
      resizeable: false,
      autoOpen: false
    });
  };
 
  var view = function() {
    if (marina.util.isConnected()) {
      return connectedView;
    }
    return disconnectedView;
  };

  return function() {
    console.log('return main view state function');
    return function() {
      enhanceOptionSelect();
      console.log('create dialogs');
      createDialogs();
      createButtons();
      console.log('adding main view envent listerners for state');
      document.addEventListener("online", connectedView.show, false);
      document.addEventListener("offline", disconnectedView.show, false);
      console.log('main state function');
      return view();
    };
  }();
}();
