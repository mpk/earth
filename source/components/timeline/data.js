/**
 *	Timeline data (time range, animation, number of earthquakes)
 */
import classNames from 'bem-class-names';
import moment from 'moment';
import React from 'react';
import Tappable from '../shared/tappable';
import t from '../../i18n';
import utils from '../../utils';

class Data extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<div className={cx('time')}>
					<span>{moment.utc(this.props.timeRange.start).format(DateFormat)} UTC – {moment.utc(this.props.timeRange.end).format(DateFormat)} UTC</span>

					{this.props.frameTime ?
						<Tappable className={cx('animation-button')} onTap={this.props.actions.stopAnimation.bind(this)}>
							<svg className={cx('animation-button-icon')}>
								<path d="M0,10 l8,0 l0,8 l-8,0 Z"></path>
							</svg>
							<span>{t('link.stopAnimation')}</span>
						</Tappable>
						: <Tappable className={cx('animation-button')} onTap={this.props.actions.startAnimation.bind(this)}>
							<svg className={cx('animation-button-icon')}>
								<path d="M0,9 l8,5 l-8,5 Z"></path>
							</svg>
							<span>{t('link.startAnimation')}</span>
						</Tappable>}
				</div>

				<div className={cx('count')}>
					{t('label.earthquakeCount', {
						count: utils.formatNumber(this.props.pointList.length),
						smart_count: this.props.pointList.length // eslint-disable-line camelcase
					})}
				</div>
			</div>
		);
	}

	shouldComponentUpdate( nextProps ) {
		return nextProps.pointList !== this.props.pointList || nextProps.timeRange !== this.props.timeRange
			|| nextProps.frameTime !== this.props.frameTime;
	}

}

let cx = classNames('timeline-data');

const DateFormat = 'DD.MM.YYYY HH:mm';

export default Data;