marina.googleMap = function(mapOptions) {
  var map = {};
  map.googleMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  return map;
};
