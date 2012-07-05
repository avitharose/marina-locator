marina.filter = function() {
  var filter = {};

  filter.byAll = function(values, criteria) {
    var byName = filter.byName(values, criteria);
    var byDesc = filter.byDescription(values, criteria);
    var cnt = 0;
    $.each(byDesc, function(index, value) {
      if(byName.indexOf(value) === -1) {
        byName.push(value);
      }
    });
    return byName;
  };

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
    var filtered = [], cnt, value, description;
    for(cnt = 0; cnt < values.length; cnt++) {
      value = values[cnt];
      description = $(value.description).text();
      if (description.match(new RegExp(criteria, 'gi'))) {
        filtered.push(value);
      }
    }
    return filtered;
  };

  return filter;

}();
