marina.filter = function() {
  var filter = {};

  filter.byName = function(values, criteria) {
    var filtered = [], cnt, value;
    for(cnt = 0; cnt < values.length; cnt++) {
      value = values[cnt];
      if (value.name.match(criteria)) {
        filtered.push(value);
      }
    }
    return filtered;
  };

  return filter;

}();
