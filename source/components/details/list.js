/**
 *	Earthquake list
 */
import classNames from 'bem-class-names';
import React from 'react';
import Quake from './quake';
import sortFunctions from './sort-functions';

class List extends React.Component {

	constructor() {
		super();

		this.state = {
			selectedPoint: null
		};
	}

	render() {
		return (
			<div className={cx()}>
				{this.mapGroups(sortFunctions[this.props.sortProperty], ( groupID, points ) => {
					return (
						<div className={cx('group')} key={groupID || 1}>
							{groupID ?
								<div className={cx('header')}>{sortFunctions[this.props.sortProperty].getGroupName(groupID)}</div>
								: null}

							{points.map(( point ) => {
								return (
									<Quake instance={point} selected={this.state.selectedPoint == point}
										onTap={this.handlePointTap.bind(this)} key={point.id}
										quakeGroups={this.props.quakeGroups} />
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}

	/**
	 *	Group points and return array of groups from callback results.
	 *	The callback function receives group ID and array of points.
	 *
	 *	@private
	 *	@param {object} sortProperty
	 *	@param {function} callback
	 *	@return {Array.<*>}
	 */
	mapGroups( sortProperty, callback ) {
		if (sortProperty.getGroups) {
			// Sort property creates groups
			let pointGroups = sortProperty.getGroups(this.props.points);
			let results = [];

			Object.keys(pointGroups).sort(sortProperty.sortGroups(this.props.sortDirection)).forEach(( groupID ) => {
				let points = pointGroups[groupID].sort(sortProperty.sortPoints(this.props.sortDirection));

				results.push(callback.call(this, groupID, points));
			});

			return results;
		} else {
			// Sort property does not create groups
			return callback.call(this, null, this.props.points.slice(0).sort(sortProperty.sortPoints(this.props.sortDirection)));
		}
	}

	/**
	 *	@private
	 *	@param {Point} point
	 */
	handlePointTap( point ) {
		this.setState({
			selectedPoint: point
		});
	}

}

let cx = classNames('details-list');

export default List;