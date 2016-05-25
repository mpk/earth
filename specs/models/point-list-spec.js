import FilterSet from '../../source/models/filter-set';
import PointList from '../../source/models/point-list';
import Quake from '../../source/models/quake';
import TimeRange from '../../source/utils/time-range';

describe('PointList', () => {

	let pointList = null;
	let pointListSlice = null;
	let pointListSliceFilter = null;

	beforeEach(() => {
		pointList = new PointList({
			'2013': [],
			'2014': [createQuake(1388534400000, 8.1), createQuake(1406851200000, 5.2), createQuake(1412121600000, 4.3)],
			'2015': false,
			'2016': [createQuake(1454284800000, 7.5)]
		});

		pointListSlice = pointList.getSlice({
			timeRange: new TimeRange(1404172800000, 1463404505000),
			filters: null
		});

		pointListSliceFilter = pointList.getSlice({
			timeRange: new TimeRange(1404172800000, 1463404505000),
			otherFilters: new FilterSet([{
				id: 'magnitude',
				checkObject: ( value, quake ) => quake.data.magnitude > value,
				value: 5
			}])
		});
	});

	describe('getChunk()', () => {

		it('returns value of the chunk', () => {
			let result = pointList.getDataChunk('2014');

			expect(result.length).toBe(3);
		});

	});

	describe('setChunk()', () => {

		it('sets value of the chunk', () => {
			let result = pointList.setDataChunk('2015', [createQuake(10, 1)]);

			expect(result.getDataChunk('2015').length).toBe(1);
			expect(pointList.getDataChunk('2015')).toBe(false);
		});

	});

	describe('getSlice()', () => {

		it('iterates over points', () => {
			let result = [];

			pointListSlice.forEach(( quake ) => result.push(quake.data.magnitude));

			expect(result).toEqual([5.2, 4.3, 7.5]);
		});

		it('iterates over points with 5+ magnitude filter', () => {
			let result = [];

			pointListSliceFilter.forEach(( quake ) => result.push(quake.data.magnitude));

			expect(result).toEqual([5.2, 7.5]);
		});

	});

	describe('getClosest()', () => {

		it('finds closest points', () => {
			let result = pointListSlice.getClosest({ x: 0, y: 0, z: 1 }, 1);

			expect(result.length).toBe(3);
		});

		it('finds zero points with small tolerance', () => {
			let result = pointListSlice.getClosest({ x: 0, y: 0, z: 1 }, 0.01);

			expect(result.length).toBe(0);
		});

	});

});

function createQuake( quakeTime, quakeMagnitude ) {
	return new Quake({
		id: Math.random(),
		time: quakeTime,
		coords: { lat: 48, lon: 17 }
	}, {
		magnitude: quakeMagnitude
	});
}