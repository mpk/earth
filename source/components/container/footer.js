/**
 *	App information
 */
import classNames from 'bem-class-names';
import React from 'react';
import t from '../../i18n';

class Footer extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<div className={cx('about')}>
					<span className={cx('header')}>{t('label.createdBy')}</span>
					<a className={cx('link')} href="https://polko.me" target="blank">mpk</a>
				</div>

				<div className={cx('sources')}>
					<span className={cx('header')}>{t('label.dataSources')}</span>
					<a className={cx('link')} href="http://earthquake.usgs.gov/" target="blank">USGS</a>
					<a className={cx('link')} href="http://visibleearth.nasa.gov/" target="blank">NASA Visible Earth</a>
					<a className={cx('link')} href="https://svs.gsfc.nasa.gov/" target="blank">NASA Scientific Visualization Studio</a>
				</div>
			</div>
		);
	}

	shouldComponentUpdate() {
		return false;
	}

}

let cx = classNames('container-footer');

export default Footer;