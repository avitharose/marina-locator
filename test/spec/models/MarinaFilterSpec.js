var marina = {};

describe('marina filter', function() {

  beforeEach(function() {
		marina.marinas = [
      { name: 'mega marina' },
      { name: 'marina for mega yachts' },
		  { name: 'mini marina' }
    ];
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

});

