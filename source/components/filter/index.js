/**
 *	Magnitude filter
 */
import classNames from 'bem-class-names';
import React from 'react';
import Tappable from '../shared/tappable';
import t from '../../i18n';

class Filter extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<div className={cx('header')}>
					{t('label.filter')}
				</div>

				{this.props.quakeGroups.map(( group ) => {
					let selected = (this.props.filters.getValue('magnitude') & 2 ** group.magnitude);

					return (
						<Tappable className={cx('value', { 'selected': selected })} onTap={this.handleTap.bind(this, group.magnitude)} key={group.magnitude}>
							<span className={cx('value-icon')} style={{ backgroundColor: selected ? group.color : undefined }}>
								{selected ?
									<svg className={cx('value-icon-tick')}>
										<path d="M5,8 l2,2 l4,-4"></path>
									</svg>
									: null}
							</span>
							<span>M {group.magnitude} - {group.magnitude}.9</span>
						</Tappable>
					);
				})}
			</div>
		);
	}

	shouldComponentUpdate( nextProps ) {
		return nextProps.filters !== this.props.filters || nextProps.quakeGroups !== this.props.quakeGroups;
	}

	/**
	 *	@private
	 *	@param {number} magnitude
	 */
	handleTap( magnitude ) {
		this.props.actions.setFilterValue('magnitude', this.props.filters.getValue('magnitude') ^ 2 ** magnitude);
	}

}

let cx = classNames('filter');

export default Filter;