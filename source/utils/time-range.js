/**
 *	Immutable time range
 */
import moment from 'moment';

class TimeRange {

	/**
	 *	@param {number} start - Unix offset in ms
	 *	@param {number} end - Unix offset in ms
	 */
	constructor( start, end ) {
		this.start = start;
		this.end = end;

		Object.freeze(this);
	}

	/**
	 *	Create a time range from an object with `start` and `end` properties.
	 *
	 *	@param {{ start: number, end: number }} object
	 *	@return {TimeRange}
	 */
	static fromObject( object ) {
		return new TimeRange(object.start, object.end);
	}

	/**
	 *	Set one endpoint of this range.
	 *
	 *	@param {string} endpoint - 'start' or 'end'
	 *	@param {number} value - Unix offset in ms
	 *	@return {TimeRange}
	 */
	setEndpoint( endpoint, value ) {
		if (endpoint == 'start') {
			return new TimeRange(Math.min(value, this.end), this.end);
		} else if (endpoint == 'end') {
			return new TimeRange(this.start, Math.max(value, this.start));
		}
	}

	/**
	 *	Iterate over each period between endpoints.
	 *	The callback function receives Moment instance set to the first day of a period.
	 *
	 *	@param {string} key - Period name ('year', 'month', etc.)
	 *	@param {function} callback
	 */
	forEach( key, callback ) {
		let startTime = moment.utc(this.start).startOf(key);
		let endTime = moment.utc(this.end).startOf(key);

		while (startTime.valueOf() <= endTime.valueOf()) {
			callback.call(this, startTime.clone());

			startTime.add(1, key);
		}
	}

	/**
	 *	Iterate over each period between endpoints and return array from callback results.
	 *	The callback function receives Moment instance set to the first day of a period.
	 *
	 *	@param {string} key - Period name ('year', 'month', etc.)
	 *	@param {function} callback
	 *	@return {Array.<*>}
	 */
	map( key, callback ) {
		let results = [];

		this.forEach(key, ( moment ) => results.push(callback(moment)));

		return results;
	}

	/**
	 *	Get range length.
	 *
	 *	@return {number}
	 */
	getSize() {
		return this.end - this.start;
	}

}

export default TimeRange;