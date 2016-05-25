/**
 *	Smooth transition between values with optional easing
 */
import BezierEasing from 'bezier-easing';
import Emitter from 'component-emitter';
import math from 'math';

class Transition {

	/**
	 *	@param {number} valueFrom
	 *	@param {number} valueTo
	 *	@param {number} duration - Transition duration in ms
	 *	@param {BezierEasing=} easing
	 */
	constructor( valueFrom, valueTo, duration, easing = BezierEasing(0, 0, 1, 1) ) {
		this.valueFrom = valueFrom;
		this.valueTo = valueTo;

		this.startTime = Date.now();
		this.stopTime = this.startTime + duration;

		this.easing = easing;

		this.active = true;

		this.handlePaint = this.handlePaint.bind(this);
		this.handlePaint();
	}

	/**
	 *	Stop this transition.
	 */
	stop() {
		this.active = false;
	}

	/**
	 *	@private
	 */
	handlePaint() {
		if (this.active) {
			window.requestAnimationFrame(this.handlePaint);

			let unitInput = math.mapLinearClamp(Date.now(), this.startTime, this.stopTime, 0, 1);
			let value = math.mapLinearClamp(this.easing(unitInput), 0, 1, this.valueFrom, this.valueTo);

			if (math.fuzzyEquals(value, this.valueTo)) {
				this.stop();
			}

			this.emit('update', value);

			if (!this.active) {
				this.emit('end');
			}
		}
	}

}

Emitter(Transition.prototype);

let cachedInstances = {};

export default {

	/**
	 *	Start a transition between the specified numeric values.
	 *
	 *	@param {string} id
	 *	@param {number} valueFrom
	 *	@param {number} valueTo
	 *	@param {number} duration - Transition duration in ms
	 *	@param {BezierEasing=} easing - Default is linear
	 *	@return {Transition}
	 */
	start( id, valueFrom, valueTo, duration, easing ) {
		if (cachedInstances[id]) {
			cachedInstances[id].stop();
		}

		cachedInstances[id] = new Transition(valueFrom, valueTo, duration, easing);

		return cachedInstances[id];
	},

	/**
	 *	Stop the specified transition and return its data.
	 *
	 *	@param {string} id
	 *	@return {?{ valueFrom: number, valueTo: number }}
	 */
	stop( id ) {
		if (cachedInstances[id]) {
			cachedInstances[id].stop();
			let prevValues = { valueFrom: cachedInstances[id].valueFrom, valueTo: cachedInstances[id].valueTo };

			delete cachedInstances[id];

			return prevValues;
		}

		return null;
	}

};