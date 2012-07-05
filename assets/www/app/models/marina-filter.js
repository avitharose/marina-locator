marina.filter = function() {
  var filter = {};

  filter.byName = function(values, criteria) {
    var filtered = [], cnt, value;
    for(cnt = 0; cnt < values.length; cnt++) {
      value = values[cnt];
      if (value.name.match(new RegExp(criteria, 'gi'))) {
        filtered.push(value);
      }
    }
    return filtered;
  };

  filter.byDescription = function(values, criteria) {
    var filtered = [], cnt, value;
    for(cnt = 0; cnt < values.length; cnt++) {
      value = values[cnt];
      if (value.description.match(new RegExp(criteria, 'gi'))) {
        filtered.push(value);
      }
    }
    return filtered;
  };

  return filter;

}();
