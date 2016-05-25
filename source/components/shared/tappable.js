/**
 *	Wrapper component that fires press/move/release/tap/zoom events for both mouse and touch inputs
 *
 *	@see https://github.com/JedWatson/react-tappable
 */
import math from 'math';
import React from 'react';

class Tappable extends React.Component {

	constructor() {
		super();

		this.startX = 0;
		this.startY = 0;

		this.prevX = 0;
		this.prevY = 0;

		this.distX = 0;
		this.distY = 0;

		this.prevDistance = null;

		this.pointerTarget = null;
		this.onlyPointer = true;
	}

	render() {
		let thisProps = {};

		PropsToCopy.forEach(( name ) => thisProps[name] = this.props[name]);

		thisProps.style = Object.assign({}, TouchStyles, this.props.style);

		thisProps.ref = 'nativeElement';

		thisProps.onTouchStart = this.handlePointerPress.bind(this);
		thisProps.onTouchMove = this.handlePointerMove.bind(this);
		thisProps.onTouchEnd = this.handlePointerRelease.bind(this);
		thisProps.onMouseDown = this.handlePointerPress.bind(this);
		thisProps.onWheel = this.handleWheel.bind(this);

		return React.createElement(this.props.component || 'div', thisProps, this.props.children);
	}

	/**
	 *	Get reference to wrapped DOM element.
	 *
	 *	@return {Element}
	 */
	getElement() {
		return this.refs.nativeElement;
	}

	/**
	 *	@private
	 *	@param {MouseEvent | TouchEvent} event
	 */
	handlePointerPress( event ) {
		let pointer = this.getPointer(event);
		let mouseEvent = (event.type == 'mousedown');

		this.onlyPointer = mouseEvent || (event.touches.length == 1);

		if (mouseEvent) {
			if (blockMouseEvents) {
				// Unblock mouse events for next event
				blockMouseEvents = false;

				return;
			}

			if (event.button !== 0) {
				return;
			}

			document.addEventListener('mousemove', this.fnPointerMove = this.handlePointerMove.bind(this));
			document.addEventListener('mouseup', this.fnPointerRelease = this.handlePointerRelease.bind(this));
		} else {
			// If the touch event fires, block subsequent mouse events
			blockMouseEvents = true;
		}

		if (this.onlyPointer) {
			this.startX = this.prevX = pointer.clientX;
			this.startY = this.prevY = pointer.clientY;

			this.distX = 0;
			this.distY = 0;

			this.startTime = Date.now();
			this.pointerTarget = event.target;

			if (this.props.onPointerPress) {
				this.props.onPointerPress.call(this, { clientX: pointer.clientX, clientY: pointer.clientY });
			}
		}

		if (!this.props.enableDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 *	@private
	 *	@param {MouseEvent | TouchEvent} event
	 */
	handlePointerMove( event ) {
		let pointer = this.getPointer(event);
		let mouseEvent = (event.type == 'mousemove');

		if (this.props.enableDefault && mouseEvent && blockMouseEvents) {
			return;
		}

		if (this.onlyPointer) {
			let dtX = pointer.clientX - this.prevX;
			let dtY = pointer.clientY - this.prevY;

			let dtStartX = pointer.clientX - this.startX;
			let dtStartY = pointer.clientY - this.startY;

			this.distX += Math.abs(dtX);
			this.distY += Math.abs(dtY);

			// Do not apply threshold if tap event listener does not exist
			if (!this.props.onTap || this.distX + this.distY >= PressDistanceThreshold) {
				if (this.props.onPointerMove) {
					this.props.onPointerMove.call(this, {
						dtX, dtY,
						dtStartX, dtStartY,
						startX: this.startX, startY: this.startY,
						clientX: pointer.clientX, clientY: pointer.clientY
					});
				}
			}

			this.prevX = pointer.clientX;
			this.prevY = pointer.clientY;
		} else {
			if (event.touches.length == 2) {
				// Pinch-to-zoom
				let pointer1 = event.touches[0];
				let pointer2 = event.touches[1];

				let dtX = pointer1.clientX - pointer2.clientX;
				let dtY = pointer1.clientY - pointer2.clientY;

				let distance = Math.sqrt(dtX ** 2 + dtY ** 2);
				let dtDistance = (this.prevDistance || distance) - distance;
				this.prevDistance = distance;

				if (this.props.onZoom) {
					this.props.onZoom.call(this, { dtY: dtDistance * 1.5 });
				}
			}
		}

		if (!this.props.enableDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 *	@private
	 *	@param {MouseEvent | TouchEvent} event
	 */
	handlePointerRelease( event ) {
		let pointer = this.getPointer(event);
		let mouseEvent = (event.type == 'mouseup');

		if (this.props.enableDefault && mouseEvent && blockMouseEvents) {
			return;
		}

		if (mouseEvent) {
			document.removeEventListener('mousemove', this.fnPointerMove);
			document.removeEventListener('mouseup', this.fnPointerRelease);
		}

		if (this.onlyPointer) {
			let callRelease = true;

			if (this.distX + this.distY < PressDistanceThreshold) {
				if (this.props.onTap) {
					this.props.onTap.call(this, { clientX: this.startX, clientY: this.startY });
					callRelease = false;
				}
			}

			if (callRelease) {
				if (this.props.onPointerRelease) {
					let dtStartX = pointer.clientX - this.startX;
					let dtStartY = pointer.clientY - this.startY;
					let elapsedTime = Date.now() - this.startTime;

					this.props.onPointerRelease.call(this, { dtStartX, dtStartY, elapsedTime });
				}
			}

			this.pointerTarget = null;
		}

		this.prevDistance = null;

		if (!this.props.enableDefault) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 *	@private
	 *	@param {WheelEvent} event
	 */
	handleWheel( event ) {
		let deltaY = event.deltaY;

		if (Math.abs(deltaY) !== 0) {
			if (event.deltaMode == 1) {
				// Normalize delta value from lines to pixels (helps Firefox/Win)
				deltaY *= 10;
			}

			// Reduce values from desktop browsers to match MacBook touchpad values
			let dtY = math.clamp(deltaY, -40, 40);

			if (this.props.onZoom) {
				this.props.onZoom.call(this, { dtY });
			}
		}

		if (this.props.onZoom) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 *	Extract object that contains coordinates from mouse or touch event.
	 *
	 *	@private
	 *	@param {MouseEvent | TouchEvent} event
	 *	@return {object}
	 */
	getPointer( event ) {
		if (event.targetTouches && event.targetTouches.length) {
			return event.targetTouches[0];
		} else if (event.changedTouches && event.changedTouches.length) {
			return event.changedTouches[0];
		} else {
			return event;
		}
	}

}

let blockMouseEvents = false;

const PropsToCopy = ['className'];
const TouchStyles = {
	WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
	WebkitTouchCallout: 'none'
};
const PressDistanceThreshold = 16;

export const HasTouchSupport = ('ontouchstart' in window);

export default Tappable;