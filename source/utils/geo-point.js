/**
 *	Immutable position in WGS 84 coordinates
 */
import math from 'math';

class GeoPoint {

	/**
	 *	@param {number=} lat
	 *	@param {number=} lon
	 */
	constructor( lat = 0, lon = 0 ) {
		this.lat = math.clamp(lat, -MaxLat, MaxLat);
		this.lon = lon;

		Object.freeze(this);
	}

	/**
	 *	Create a point from an object with `lat` and `lon` properties.
	 *
	 *	@param {{ lat: number, lon: number }} object
	 *	@return {GeoPoint}
	 */
	static fromObject( object ) {
		return new GeoPoint(object.lat, object.lon);
	}

	/**
	 *	Normalize longitude coordinate.
	 *
	 *	@return {GeoPoint}
	 */
	normalize() {
		return new GeoPoint(this.lat, math.modulo(this.lon + MaxLon, 2 * MaxLon) - MaxLon);
	}

	/**
	 *	Perform linear interpolation between specified points.
	 *
	 *	@param {GeoPoint} point1
	 *	@param {GeoPoint} point2
	 *	@param {number} fraction
	 *	@param {boolean=} normCoords
	 *	@return {GeoPoint}
	 */
	static lerp( point1, point2, fraction, normCoords = false ) {
		let dtLat = point2.lat - point1.lat;
		let dtLon = point2.lon - point1.lon;

		if (normCoords && Math.abs(dtLon) > 180) {
			dtLon = (360 - Math.abs(dtLon)) * -Math.sign(dtLon);
		}

		return new GeoPoint(
			point1.lat + dtLat * fraction,
			point1.lon + dtLon * fraction
		);
	}

	/**
	 *	Calculate Euclidean distance between specified points.
	 *
	 *	@param {GeoPoint} point1
	 *	@param {GeoPoint} point2
	 *	@param {boolean=} normCoords
	 *	@return {number}
	 */
	static getEuclideanDistance( point1, point2, normCoords = false ) {
		let dtLat = point2.lat - point1.lat;
		let dtLon = point2.lon - point1.lon;

		if (normCoords && Math.abs(dtLon) > 180) {
			dtLon = 360 - Math.abs(dtLon);
		}

		return Math.sqrt(dtLat ** 2 + dtLon ** 2);
	}

}

const MaxLat = 90;
const MaxLon = 180;

export default GeoPoint;