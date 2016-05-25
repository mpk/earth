import matchers from '../support/matchers';
import TimeRange from '../../source/utils/time-range';

describe('TimeRange', () => {

	beforeAll(() => jasmine.addMatchers(matchers));

	describe('constructor', () => {

		it('creates specified range', () => {
			let timeRange = new TimeRange(10, 20);

			expect(timeRange).toBeTimeRange(10, 20);
		});

		it('has read-only fields', () => {
			let timeRange = new TimeRange(10, 20);

			expect(() => timeRange.start = 5).toThrow();
			expect(() => timeRange.end = 15).toThrow();
		});

	});

	describe('fromObject()', () => {

		it('creates instance', () => {
			let timeRange = TimeRange.fromObject({ start: 10, end: 20 });

			expect(timeRange).toBeTimeRange(10, 20);
		});

	});

	describe('setEndpoint()', () => {

		it('sets start endpoint', () => {
			let timeRange = new TimeRange(10, 20);
			let result = timeRange.setEndpoint('start', 5);

			expect(result).toBeTimeRange(5, 20);
			expect(timeRange).toBeTimeRange(10, 20);
		});

		it('sets end endpoint', () => {
			let timeRange = new TimeRange(10, 20);
			let result = timeRange.setEndpoint('end', 15);

			expect(result).toBeTimeRange(10, 15);
			expect(timeRange).toBeTimeRange(10, 20);
		});

	});

	describe('forEach()', () => {

		it('iterates over each month', () => {
			let timeRange = new TimeRange(1404172800000, 1435708799000);
			let result = [];

			timeRange.forEach('month', ( moment ) => result.push(moment.month()));

			expect(result).toEqual([6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]);
		});

		it('iterates over each year', () => {
			let timeRange = new TimeRange(1404172800000, 1435708799000);
			let result = [];

			timeRange.forEach('year', ( moment ) => result.push(moment.year()));

			expect(result).toEqual([2014, 2015]);
		});

	});

	describe('map()', () => {

		it('maps each month', () => {
			let timeRange = new TimeRange(1404172800000, 1435708799000);
			let result = timeRange.map('month', ( moment ) => moment.month());

			expect(result).toEqual([6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]);
		});

		it('maps each year', () => {
			let timeRange = new TimeRange(1404172800000, 1435708799000);
			let result = timeRange.map('year', ( moment ) => moment.year());

			expect(result).toEqual([2014, 2015]);
		});

	});

	describe('getSize()', () => {

		it('retuns range length', () => {
			let timeRange = new TimeRange(10, 75);
			let result = timeRange.getSize();

			expect(result).toBe(65);
		});

	});

});