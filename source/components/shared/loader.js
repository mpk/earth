/**
 *	Loading indicator
 */
import classNames from 'bem-class-names';
import React from 'react';
import THREE from 'three';
import { PixelRatio } from '../../utils';

class Loader extends React.Component {

	constructor() {
		super();

		this.arcStart = 0;
		this.arcEnd = 0;

		this.needsRender = true;
		this.handlePaint = this.handlePaint.bind(this);
	}

	componentDidMount() {
		this.ctx = this.refs.canvas.getContext('2d');
		this.ctx.scale(PixelRatio, PixelRatio);

		this.ctx.lineWidth = this.props.lineWidth;
		this.ctx.lineCap = 'round';

		this.handlePaint();
	}

	componentWillUnmount() {
		this.needsRender = false;
	}

	render() {
		return (
			<canvas className={cx()} ref="canvas" width={this.props.size * PixelRatio}
				height={this.props.size * PixelRatio} style={{ width: this.props.size, height: this.props.size }}>
			</canvas>
		);
	}

	/**
	 *	@private
	 */
	handlePaint() {
		if (this.needsRender) {
			window.requestAnimationFrame(this.handlePaint);

			this.ctx.clearRect(0, 0, this.props.size, this.props.size);

			this.arcStart = this.getPosition(Date.now());
			this.arcEnd = this.getPosition(Date.now() - TimeDelay);

			this.ctx.beginPath();
			this.ctx.arc(this.props.size / 2, this.props.size / 2, Math.round(0.375 * this.props.size), this.arcStart, this.arcEnd, true);
			this.ctx.strokeStyle = Color;
			this.ctx.stroke();
		}
	}

	/**
	 *	@private
	 *	@param {number} currentTime
	 *	@return {number}
	 */
	getPosition( currentTime ) {
		let t = (currentTime % Duration) / Duration;

		return THREE.ShapeUtils.b3(t, 0, 0.8, 0.2, 1) * Math.PI * 2;
	}

}

let cx = classNames('loader');

const Color = '#fff';
const Duration = 1500;
const TimeDelay = 500;

export default Loader;