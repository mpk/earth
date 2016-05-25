import matchers from '../support/matchers';
import GeoPoint from '../../source/utils/geo-point';

describe('GeoPoint', () => {

	beforeAll(() => jasmine.addMatchers(matchers));

	describe('constructor', () => {

		it('creates point at 0, 0', () => {
			let point = new GeoPoint();

			expect(point).toBeGeoPoint(0, 0);
		});

		it('creates specified point', () => {
			let point = new GeoPoint(48, 17);

			expect(point).toBeGeoPoint(48, 17);
		});

		it('clamps latitude', () => {
			let point1 = new GeoPoint(-95.2, 15.2);
			let point2 = new GeoPoint(95.2, 15.2);

			expect(point1).toBeGeoPoint(-90, 15.2);
			expect(point2).toBeGeoPoint(90, 15.2);
		});

		it('has read-only fields', () => {
			let point = new GeoPoint(43.7, 15.2);

			expect(() => point.lat = 48).toThrow();
			expect(() => point.lon = 17).toThrow();
		});

	});

	describe('fromObject()', () => {

		it('creates instance', () => {
			let point = GeoPoint.fromObject({ lat: 43.7, lon: 15.2 });

			expect(point).toBeGeoPoint(43.7, 15.2);
		});

	});

	describe('normalize()', () => {

		it('normalizes longitude', () => {
			let point = new GeoPoint(43.7, 185.2);
			let result = point.normalize();

			expect(result).toBeGeoPoint(43.7, -174.8);
			expect(point).toBeGeoPoint(43.7, 185.2);
		});

	});

	describe('lerp()', () => {

		it('interpolates between points', () => {
			let point1 = new GeoPoint(48, 17);
			let point2 = new GeoPoint(-6, -3);
			let result = GeoPoint.lerp(point1, point2, 0.4);

			expect(result).toBeGeoPoint(26.4, 9);
		});

		it('interpolates between points over antimeridian', () => {
			let point1 = new GeoPoint(50, 170);
			let point2 = new GeoPoint(60, -170);
			let result = GeoPoint.lerp(point1, point2, 0.4);

			expect(result).toBeGeoPoint(54, 34);
		});

		it('interpolates between normalized points over antimeridian', () => {
			let point1 = new GeoPoint(50, 170);
			let point2 = new GeoPoint(60, -170);
			let result = GeoPoint.lerp(point1, point2, 0.4, true);

			expect(result).toBeGeoPoint(54, 178);
		});

	});

	describe('getEuclideanDistance()', () => {

		it('calculates Euclidean length between points', () => {
			let point1 = new GeoPoint(48, 17);
			let point2 = new GeoPoint(-6, -3);
			let result = GeoPoint.getEuclideanDistance(point1, point2);

			expect(result).toBeCloseTo(57.584720195552, 12);
		});

		it('calculates Euclidean length between points over antimeridian', () => {
			let point1 = new GeoPoint(50, 170);
			let point2 = new GeoPoint(60, -170);
			let result = GeoPoint.getEuclideanDistance(point1, point2);

			expect(result).toBeCloseTo(340.147027033899, 12);
		});

		it('calculates Euclidean length between normalized points over antimeridian', () => {
			let point1 = new GeoPoint(50, 170);
			let point2 = new GeoPoint(60, -170);
			let result = GeoPoint.getEuclideanDistance(point1, point2, true);

			expect(result).toBeCloseTo(22.360679774998, 12);
		});

	});

});