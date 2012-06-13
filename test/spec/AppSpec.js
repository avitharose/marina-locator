var appCallback, $ = function(func) {
  appCallback = func;
};

var document = function() {
};

describe("Player", function() {

  beforeEach(function() {
    document.addEventListener = jasmine.createSpy();  
  });

  it("should listen for deviceReady", function() {
    appCallback();
    expect(document.addEventListener).toHaveBeenCalled();
  });

});
