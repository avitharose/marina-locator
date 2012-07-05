marina.filter = function() {
  var filter = {};

  filter.nameMatches = function(value, criteria) {
    return value.name.match(new RegExp(criteria, 'gi'));
  };

  filter.descriptionMatches = function(value, criteria) {
    return $(value.description).text().match(new RegExp(criteria, 'gi'));
  };

  filter.byAll = function(values, criteria) {
    var byName = filter.byName(values, criteria);
    var byDesc = filter.byDescription(values, criteria);
    return _.union(byName, byDesc);
  };

  var filterBy = function(matcher, values, criteria) {
    var filtered = [], cnt, value;
    for(cnt = 0; cnt < values.length; cnt++) {
      value = values[cnt];
      if (matcher(value, criteria)) {
        filtered.push(value);
      }
    }
    return filtered;
  };

  filter.byName = function(values, criteria) {
    return filterBy(filter.nameMatches, values, criteria);
  };

  filter.byDescription = function(values, criteria) {
    return filterBy(filter.descriptionMatches, values, criteria);
  };

  return filter;

}();
