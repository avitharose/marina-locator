describe('Main view', function() {

  it('should exists', function() {
    expect(marina.views.main).toBeDefined();
  });

  describe('disconnected view', function() {

    var div = {}, mapCanvas = '#map_canvas', $arg;
    
    beforeEach(function() {
      marina.util = {
        isConnected: function() {
          return false;
        }
      };
      div.html = jasmine.createSpy();
      $ = function(id) {
        $arg = id;
        return div;
      };
    });

    it('should show disconnected message in #map_canvas', function() {
      marina.views.main().show();
      expect($arg).toEqual(mapCanvas);
    });

    it('should show disconnected message as html', function() {
      marina.views.main().show();
      expect(div.html).toHaveBeenCalled();
    });

  });

});
