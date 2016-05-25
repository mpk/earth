/**
 *	Screen
 */
import classNames from 'bem-class-names';
import React from 'react';
import Renderer, { RendererError } from './renderer';
import Tappable, { HasTouchSupport } from '../shared/tappable';
import GeoPoint from '../../utils/geo-point';

class Screen extends React.Component {

	componentDidMount() {
		this.renderer = new Renderer(this.refs.canvas.getElement(), this.props.resources);

		this.renderer.on('crash', () => {
			this.props.actions.reportRendererError(RendererError.Crash);
			this.renderer = null;
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight - TimelineHeight);
		this.renderer.setCamera(this.props.cameraPosition, this.props.cameraDistance);

		window.addEventListener('resize', () => {
			if (this.renderer) {
				this.renderer.setSize(window.innerWidth, window.innerHeight - TimelineHeight);
			}
		});
	}

	render() {
		return (
			<div className={cx()}>
				<Tappable component="canvas" className={cx('canvas')} ref="canvas" onPointerMove={this.handlePointerMove.bind(this)}
					onPointerRelease={this.handlePointerRelease.bind(this)} onZoom={this.handleZoom.bind(this)} onTap={this.handleTap.bind(this)} />
			</div>
		);
	}

	componentDidUpdate( prevProps ) {
		if (this.renderer) {
			if (prevProps.cameraPosition !== this.props.cameraPosition || prevProps.cameraDistance !== this.props.cameraDistance) {
				this.renderer.setCamera(this.props.cameraPosition, this.props.cameraDistance);
			}

			if (prevProps.pointList !== this.props.pointList) {
				this.renderer.setPoints(this.props.pointList);
			}

			if (prevProps.selectedPoints !== this.props.selectedPoints) {
				this.renderer.setSelectedPoints(this.props.selectedPoints);
			}

			if (prevProps.frameTime !== this.props.frameTime) {
				this.renderer.setFrameTime(this.props.frameTime);
			}
		}
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handlePointerMove( event ) {
		let speedFactor = this.renderer.getScale(this.props.cameraDistance) / 45;

		this.props.actions.setCameraPosition(new GeoPoint(
			this.props.cameraPosition.lat + event.dtY * speedFactor,
			this.props.cameraPosition.lon - event.dtX * speedFactor
		));

		this.lastPointerMoveTime = Date.now();
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handlePointerRelease( event ) {
		let speedFactor = this.renderer.getScale(this.props.cameraDistance) / 45;

		if (event.elapsedTime < 300 && (Date.now() - this.lastPointerMoveTime) < 25) {
			// Camera momentum
			this.props.actions.setCameraPosition(new GeoPoint(
				this.props.cameraPosition.lat + event.dtStartY * speedFactor,
				this.props.cameraPosition.lon - event.dtStartX * speedFactor
			), 350);
		}
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handleZoom( event ) {
		let speedFactor = this.renderer.getScale(this.props.cameraDistance) / 750;

		this.props.actions.setCameraDistanceRelative(event.dtY * speedFactor);
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handleTap( event ) {
		// Convert pointer coordinates to GL coordinates
		let normX = (event.clientX / window.innerWidth) * 2 - 1;
		let normY = -((event.clientY / (window.innerHeight - TimelineHeight)) * 2 - 1);

		let clickPosition = this.renderer.getPosition(normX, normY);
		if (clickPosition) {
			let closestPoints = this.props.pointList.getClosest(clickPosition, this.renderer.getScale(this.props.cameraDistance) * TapRadius);
			this.props.actions.selectPoints(closestPoints);
		} else {
			this.props.actions.selectPoints([]);
		}
	}

}

let cx = classNames('screen');

const TapRadius = HasTouchSupport ? 0.006 : 0.003;
const TimelineHeight = 140;

export default Screen;