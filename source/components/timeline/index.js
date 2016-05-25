/**
 *	Timeline
 */
import classNames from 'bem-class-names';
import React from 'react';
import Data from './data';
import Track from './track';

class Timeline extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<Data
					actions = {this.props.actions}
					pointList = {this.props.pointList}
					timeRange = {this.props.timeRange}
					frameTime = {this.props.frameTime} />

				<Track
					actions = {this.props.actions}
					timeRange = {this.props.timeRange}
					frameTime = {this.props.frameTime}
					maxTimeRange = {this.props.maxTimeRange} />
			</div>
		);
	}

}

let cx = classNames('timeline');

export default Timeline;