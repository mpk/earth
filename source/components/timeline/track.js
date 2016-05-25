/**
 *	Timeline range selector
 */
import classNames from 'bem-class-names';
import math from 'math';
import React from 'react';
import Tappable from '../shared/tappable';
import TimeRange from '../../utils/time-range';

class Track extends React.Component {

	constructor() {
		super();

		this.activeEndpoint = null;
	}

	render() {
		let rangeOffset = {
			left: `${math.mapLinearClamp(this.props.timeRange.start, this.props.maxTimeRange.start, this.props.maxTimeRange.end, 0, 100)}%`,
			right: `${math.mapLinearClamp(this.props.timeRange.end, this.props.maxTimeRange.end, this.props.maxTimeRange.start, 0, 100)}%`
		};

		let frameTimeOffset = {
			left: `${math.mapLinearClamp(this.props.frameTime, this.props.timeRange.start, this.props.timeRange.end, 0, 100)}%`
		};

		return (
			<Tappable className={cx()} ref="track" onPointerPress={this.handlePointerPress.bind(this, null)}
					onPointerMove={this.handlePointerMove.bind(this)}>
				<div className={cx('slot')}>
					{this.props.maxTimeRange.map('year', ( moment ) => {
						let tickOffset = {
							left: `${math.mapLinearClamp(moment.valueOf(), this.props.maxTimeRange.start, this.props.maxTimeRange.end, 0, 100)}%`
						};

						return (
							<div className={cx('label-tick')} key={moment.valueOf()} style={tickOffset}>
								<div className={cx('label-text')}>{moment.year()}</div>
							</div>
						);
					})}

					<div className={cx('range')} ref="range" style={rangeOffset}>
						{this.props.frameTime ?
							<div className={cx('frame-time')} style={frameTimeOffset}></div>
							: null}

						<div className={cx('handle-left')}>
							<Tappable className={cx('handle-area')} onPointerPress={this.handlePointerPress.bind(this, 'start')}
								onPointerMove={this.handlePointerMove.bind(this)} />
						</div>
						<div className={cx('handle-right')}>
							<Tappable className={cx('handle-area')} onPointerPress={this.handlePointerPress.bind(this, 'end')}
								onPointerMove={this.handlePointerMove.bind(this)} />
						</div>
					</div>
				</div>
			</Tappable>
		);
	}

	shouldComponentUpdate( nextProps ) {
		return nextProps.timeRange !== this.props.timeRange || nextProps.frameTime !== this.props.frameTime
			|| nextProps.maxTimeRange !== this.props.maxTimeRange;
	}

	/*
	 *	@private
	 *	@param {?string} key - 'start', 'end' or null (if the pointer target is the track)
	 *	@param {object} event
	 */
	handlePointerPress( key, event ) {
		this.activeEndpoint = key;

		if (this.activeEndpoint !== null) {
			let rangeRect = this.refs.range.getBoundingClientRect();

			if (rangeRect.width < RangeThreshold) {
				// Handler click areas overlaps themselves below RangeThreshold, so the handle closer to the pointer should became the active endpoint
				if (rangeRect.width === 0) {
					this.activeEndpoint = (event.clientX < rangeRect.left) ? 'start' : 'end';
				} else {
					this.activeEndpoint = (Math.abs(event.clientX - rangeRect.left) < Math.abs(event.clientX - rangeRect.right)) ? 'start' : 'end';
				}
			}
		}

		this.trackRect = this.refs.track.getElement().getBoundingClientRect();
		this.trackStepSize = this.trackRect.width / this.props.maxTimeRange.getSize();
		this.startValue = this.activeEndpoint ? this.props.timeRange[this.activeEndpoint] : null;
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handlePointerMove( event ) {
		if (this.activeEndpoint === null) {
			// Create range from scratch if the user has clicked on the track
			if (Math.abs(event.dtStartX) > TrackThreshold) {
				// Determine new range boundaries
				let startTime = math.mapLinearClamp(event.startX - this.trackRect.left, 0, this.trackRect.width,
					this.props.maxTimeRange.start, this.props.maxTimeRange.end);
				let thisTime = math.mapLinearClamp(event.clientX - this.trackRect.left, 0, this.trackRect.width,
					this.props.maxTimeRange.start, this.props.maxTimeRange.end);

				// Determine active endpoint based on movement direction
				if (event.dtStartX > 0) {
					this.props.actions.setTimeRange(new TimeRange(startTime, thisTime));
					this.activeEndpoint = 'end';
				} else {
					this.props.actions.setTimeRange(new TimeRange(thisTime, startTime));
					this.activeEndpoint = 'start';
				}

				this.startValue = thisTime;
			}
		} else {
			let dtStep = Math.round(event.dtStartX / this.trackStepSize);
			let newValue = math.clamp(this.startValue + dtStep, this.props.maxTimeRange.start, this.props.maxTimeRange.end);

			this.props.actions.setTimeRange(this.props.timeRange.setEndpoint(this.activeEndpoint, newValue));
		}
	}

}

let cx = classNames('timeline-track');

const TrackThreshold = 4;
const RangeThreshold = 64;

export default Track;