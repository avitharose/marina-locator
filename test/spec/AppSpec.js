var fakeElement = jasmine.createSpy(), appCallback;

var document = function() {
};

describe("App startup", function() {

  var view = {}, origMain;

  beforeEach(function() {
    document.addEventListener = jasmine.createSpy();  
    fakeElement.spin = jasmine.createSpy();
    origMain = marina.views.main;
    marina.views.main = jasmine.createSpy();
    view.show = jasmine.createSpy();
    marina.views.main.andReturn(view);
    marina.util = jasmine.createSpy();
    marina.util.startSpinner = jasmine.createSpy();
  });

  afterEach(function() {
    marina.views.main = origMain;
  });

  it("should listen for deviceReady", function() {
    marina.startup();
    expect(document.addEventListener).toHaveBeenCalled();
  });

  it("should show main view on deviceReady event", function() {
    marina.startup();
    document.addEventListener.mostRecentCall.args[1]();
    expect(marina.views.main).toHaveBeenCalled();
    expect(view.show).toHaveBeenCalled();
  });

});
