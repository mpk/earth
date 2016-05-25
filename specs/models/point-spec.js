import matchers from '../support/matchers';
import Point from '../../source/models/point';

describe('Point', () => {

	beforeAll(() => jasmine.addMatchers(matchers));

	let point = new Point({
		id: 'id1',
		time: 123,
		coords: { lat: 48.17, lon: 17.50 }
	});

	describe('constructor', () => {

		it('has basic fields', () => {
			expect(point.id).toBe('id1');
			expect(point.time).toBe(123);
		});

		it('calculates coordinates', () => {
			expect(point.coords).toBeGeoPoint(48.17, 17.50);

			expect(point.position.x).toBeCloseTo(0.200547526473, 12);
			expect(point.position.y).toBeCloseTo(0.745126901925, 12);
			expect(point.position.z).toBeCloseTo(0.636055492589, 12);

			expect(point.rotation.x).toBeCloseTo(0.730071226109, 12);
			expect(point.rotation.y).toBeCloseTo(0.305432619099, 12);
		});

	});

});