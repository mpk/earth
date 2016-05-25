/**
 *	Earthquake details
 */
import classNames from 'bem-class-names';
import moment from 'moment';
import React from 'react';
import Tappable from '../shared/tappable';
import t from '../../i18n';

class Quake extends React.Component {

	render() {
		let instance = this.props.instance;

		let quakeColor = this.props.quakeGroups[instance.magnitudeFloor - this.props.quakeGroups[0].magnitude].color;
		let quakeHeader = (
			<div className={cx('header', { 'selected': this.props.selected })}>
				<span className={cx('header-color')} style={{ backgroundColor: quakeColor }}></span>
				<span className={cx('header-place')} title={instance.data.place}>{instance.data.place}</span>
			</div>
		);

		if (this.props.selected) {
			return (
				<div className={cx()}>
					<Tappable onTap={this.handleTap.bind(this, null)} enableDefault={true}>
						{quakeHeader}
					</Tappable>

					<div className={cx('details')}>
						<div>M {instance.data.magnitude}</div>
						<div>{moment.utc(instance.time).format(DateFormat)} UTC</div>
						<div>{t('label.depth')}: {instance.data.depth} km</div>
						<div>{t('label.coords')}: {instance.coords.lat.toFixed(4)}, {instance.coords.lon.toFixed(4)}</div>

						<a className={cx('link')} href={`http://earthquake.usgs.gov/earthquakes/eventpage/${instance.id}`} target="blank">
							{t('link.detailsSite')}
						</a>
					</div>
				</div>
			);
		} else {
			return (
				<Tappable className={cx()} onTap={this.handleTap.bind(this, instance)} enableDefault={true}>
					{quakeHeader}
				</Tappable>
			);
		}
	}

	shouldComponentUpdate( nextProps ) {
		return nextProps.instance !== this.props.instance || nextProps.selected !== this.props.selected;
	}

	/**
	 *	@private
	 *	@param {Quake} quake
	 */
	handleTap( quake ) {
		this.props.onTap.call(this, quake);
	}

}

let cx = classNames('details-quake');

const DateFormat = 'DD MMM YYYY HH:mm:ss';

export default Quake;