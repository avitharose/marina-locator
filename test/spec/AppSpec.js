var appCallback, $ = function(func) {
  appCallback = func;
};

var document = function() {
};

describe("App startupn", function() {

  var view = {}, origMain;

  beforeEach(function() {
    document.addEventListener = jasmine.createSpy();  
    origMain = marina.views.main;
    marina.views.main = jasmine.createSpy();
    view.show = jasmine.createSpy();
    marina.views.main.andReturn(view);
  });

  afterEach(function() {
    marina.views.main = origMain;
  });

  it("should listen for deviceReady", function() {
    appCallback();
    expect(document.addEventListener).toHaveBeenCalled();
  });

  it("should show main view on deviceReady event", function() {
    appCallback();
    document.addEventListener.mostRecentCall.args[1]();
    expect(marina.views.main).toHaveBeenCalled();
    expect(view.show).toHaveBeenCalled();
  });

});
