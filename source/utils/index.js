/**
 *	General utilities
 */
let utils = {

	/**
	 *	Print number with thousands separated.
	 *
	 *	@param {number} value
	 *	@return {string}
	 */
	formatNumber( value ) {
		return value.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ');
	},

	/**
	 *	Group the specified array by the result of the iteratee.
	 *
	 *	@param {Array.<*>} array
	 *	@param {function} iteratee
	 *	@return {object}
	 */
	groupBy( array, iteratee ) {
		let result = {};

		array.forEach(( value ) => {
			let key = iteratee.call(this, value);

			if ({}.hasOwnProperty.call(result, key)) {
				result[key].push(value);
			} else {
				result[key] = [value];
			}
		});

		return result;
	},

	/**
	 *	Detect if the WebGL is available and supports ANGLE_instanced_arrays.
	 *
	 *	@return {boolean}
	 */
	hasWebGL() {
		let canvas = document.createElement('canvas');
		let ctx;

		try {
			ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		} catch ( ex ) {
			ctx = null;
		}

		if (ctx) {
			if (!ctx.getExtension('ANGLE_instanced_arrays')) {
				console.error('Extension ANGLE_instanced_arrays is not supported.');

				return false;
			} else {
				return true;
			}
		} else {
			console.error('Cannot create WebGL context.');

			return false;
		}
	}

};

/**
 *	Display pixel ratio (1 = standard display, 2 = high-resolution display).
 *	@type {number}
 */
export const PixelRatio = Number(window.devicePixelRatio) >= 1.5 ? 2 : 1;

export default utils;