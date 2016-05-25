import Quake from '../../source/models/quake';

describe('Quake', () => {

	let quake = new Quake({
		id: 'id1',
		time: 123,
		coords: { lat: 48.17, lon: 17.50 }
	}, {
		magnitude: 7.8
	});

	describe('constructor', () => {

		it('calculates magnitude data', () => {
			expect(quake.magnitudeFloor).toBe(7);
			expect(quake.magnitudeBit).toBe(128);
		});

	});

});