var marina = {};

describe('marina filter', function() {

  beforeEach(function() {
		marina.marinas = [
      { 
        name: 'mega marina',
        description: '<div><ul><li><font>">Guest moorage</font></li></ul></div>'
      },
      { 
        name: 'marina for mega yachts',
        description: '<div id="Guest">big</div>'
      },
		  { 
        name: 'big marina',
        description: '<div><ul><li><font>">guest moorage</font></li></ul></div>'
      }
    ];

  });

  describe('by all field filter', function() {

    it('should find marina where name or description contains criteria', function() {
			var filteredMarinas = marina.filter.byAll(marina.marinas, 'big');
			// expect(filteredMarinas.length).toEqual(2);
			expect(filteredMarinas[0].name).toEqual('big marina');
			expect(filteredMarinas[1].name).toEqual('marina for mega yachts');
    });

  });

	describe('name filter', function() {

		it('should find by name beginning with search criteria', function() {
			var filteredMarinas = marina.filter.byName(marina.marinas, 'mega');
			expect(filteredMarinas[0].name).toEqual('mega marina');
		});

		it('should find by name containing with search criteria', function() {
			var filteredMarinas = marina.filter.byName(marina.marinas, 'mega');
			expect(filteredMarinas[1].name).toEqual('marina for mega yachts');
		});

	});

  describe('description filter', function() {

		it('should find a marina where the description contain criteria', function() {
			var filteredMarinas = marina.filter.byDescription(marina.marinas, 'Guest moorage');
			expect(filteredMarinas[0].name).toEqual('mega marina');
		});

		it('should find a marina where the description contain criteria regardless of case', function() {
			var filteredMarinas = marina.filter.byDescription(marina.marinas, 'Guest moorage');
			expect(filteredMarinas[1].name).toEqual('big marina');
		});

		it('should not find a marina where the html tag contains criteria', function() {
			var filteredMarinas = marina.filter.byDescription(marina.marinas, 'Guest');
			expect(filteredMarinas.length).toEqual(2);
		});

  });

});

