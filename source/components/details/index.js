/**
 *	Details of selected earthquakes
 */
import classNames from 'bem-class-names';
import React from 'react';
import List from './list';
import Options from './options';
import t from '../../i18n';

class Details extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<div className={cx('header')}>
					{t('label.details')}
				</div>

				<Options
					actions = {this.props.actions}
					sortProperty = {this.props.sortProperty}
					sortDirection = {this.props.sortDirection} />

				<List
					points = {this.props.points}
					sortProperty = {this.props.sortProperty}
					sortDirection = {this.props.sortDirection}
					quakeGroups = {this.props.quakeGroups} />

				<div className={cx('footer')}>
					{t('label.selectedCount', { count: this.props.points.length })}
				</div>
			</div>
		);
	}

	shouldComponentUpdate( nextProps ) {
		return nextProps.points !== this.props.points || nextProps.sortProperty !== this.props.sortProperty
			|| nextProps.sortDirection !== this.props.sortDirection || nextProps.quakeGroups !== this.props.quakeGroups;
	}

}

let cx = classNames('details');

export default Details;