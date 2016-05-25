/**
 *	Additional Jasmine matchers
 */
import GeoPoint from '../../source/utils/geo-point';
import TimeRange from '../../source/utils/time-range';

export default {

	toBeGeoPoint() {
		return {
			compare( actual, ...expected ) {
				let precision = expected[2] || DefaultPrecision;
				let result = {};

				result.pass = actual
					&& actual.constructor == GeoPoint
					&& toPrecision(actual.lat, precision) === toPrecision(expected[0], precision)
					&& toPrecision(actual.lon, precision) === toPrecision(expected[1], precision);

				return result;
			}
		};
	},

	toBeTimeRange() {
		return {
			compare( actual, ...expected ) {
				let result = {};

				result.pass = actual
					&& actual.constructor == TimeRange
					&& actual.start === expected[0]
					&& actual.end === expected[1];

				return result;
			}
		};
	}

};

function toPrecision( value, precision ) {
	let multiple = (1 / (10 ** precision));

	return Math.round(value / multiple) * multiple;
}

const DefaultPrecision = 12;