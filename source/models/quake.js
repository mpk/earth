/**
 *	Earthquake
 */
import Point from './point';

class Quake extends Point {

	/**
	 *	@see {Point}
	 *	@param {object} point
	 *	@param {object} data
	 */
	constructor( point, data ) {
		super(point);

		this.data = data;

		// Precalculate stuff (for performance)
		this.magnitudeFloor = parseInt(this.data.magnitude);
		this.magnitudeBit = 2 ** this.magnitudeFloor;
	}

}

export default Quake;