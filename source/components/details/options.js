/**
 *	Earthquake list options (sort property and direction)
 */
import classNames from 'bem-class-names';
import React from 'react';
import sortFunctions from './sort-functions';
import Tappable from '../shared/tappable';
import t from '../../i18n';

class Options extends React.Component {

	render() {
		return (
			<div className={cx()}>
				{Object.keys(sortFunctions).map(( sortProperty ) => {
					let selected = (this.props.sortProperty == sortProperty);

					return (
						<Tappable className={cx('option', { 'selected': selected })} onTap={this.handleOptionTap.bind(this, sortProperty)} key={sortProperty}>
							{selected ?
								<svg className={cx('option-icon')}>
									{(this.props.sortDirection == 1) ?
										<path d="M5,7 l5,8 l-10,0 Z"></path>
										: <path d="M5,15 l5,-8 l-10,0 Z"></path>}
								</svg>
								: null}

							{t(`label.${sortProperty}`)}
						</Tappable>
					);
				})}
			</div>
		);
	}

	/**
	 *	@private
	 *	@param {object} sortProperty
	 */
	handleOptionTap( sortProperty ) {
		let sortDirection = this.props.sortDirection;

		if (sortProperty == this.props.sortProperty) {
			sortDirection = -sortDirection;
		}

		this.props.actions.setSortFunction(sortProperty, sortDirection);
	}

}

let cx = classNames('details-options');

export default Options;