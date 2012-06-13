var appCallback, $ = function(func) {
  appCallback = func;
};

var document = function() {
};

describe("Main view creation", function() {

  var view = {};

  beforeEach(function() {
    document.addEventListener = jasmine.createSpy();  
    marina.views.main = jasmine.createSpy();
    view.show = jasmine.createSpy();
    marina.views.main.andReturn(view);
  });

  it("should listen for deviceReady", function() {
    appCallback();
    expect(document.addEventListener).toHaveBeenCalled();
  });

  it("should show on deviceReady event", function() {
    appCallback();
    document.addEventListener.mostRecentCall.args[1]();
    expect(marina.views.main).toHaveBeenCalled();
    expect(view.show).toHaveBeenCalled();
  });

});
