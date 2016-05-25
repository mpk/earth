/**
 *	Historical events list
 */
import classNames from 'bem-class-names';
import React from 'react';
import events from './events';
import Tappable from '../shared/tappable';
import t from '../../i18n';
import GeoPoint from '../../utils/geo-point';
import TimeRange from '../../utils/time-range';

class Events extends React.Component {

	componentDidMount() {
		document.addEventListener('keydown', this.fnKeyDown = this.handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.fnKeyDown);
	}

	render() {
		return (
			<Tappable className={cx('backdrop')} onTap={this.handleBackdropTap.bind(this)}>
				<div className={cx()} onMouseDown={( event ) => event.stopPropagation()} onTouchStart={( event ) => event.stopPropagation()}>
					<div className={cx('header')}>
						{t('label.historicalEvents')}
					</div>

					<table>
						<tbody>
							{events.map(( event ) => {
								return (
									<tr key={event.id}>
										<td>
											{event.description}
										</td>
										<td>
											<Tappable className={cx('view-button')} onTap={this.handleTap.bind(this, event)}>
												{t('link.view')}
											</Tappable>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Tappable>
		);
	}

	/**
	 *	@private
	 *	@param {object} event
	 */
	handleTap( event ) {
		this.props.actions.setEvent({ ...event,
			timeRange: TimeRange.fromObject(event.timeRange),
			cameraPosition: GeoPoint.fromObject(event.cameraPosition) });
	}

	/**
	 *	@private
	 *	@param {KeyboardEvent} event
	 */
	handleKeyDown( event ) {
		if (event.keyCode == EscapeCode) {
			this.props.actions.setEventListVisible(false);
		}
	}

	/**
	 *	@private
	 */
	handleBackdropTap() {
		this.props.actions.setEventListVisible(false);
	}

}

let cx = classNames('events');

const EscapeCode = 27;

export default Events;