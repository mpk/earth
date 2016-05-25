/**
 *	App loading screen
 */
import classNames from 'bem-class-names';
import React from 'react';
import Loader from '../shared/loader';
import t from '../../i18n';

class Intro extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<div>{t('text.description')}</div>
				<div className={cx('resource-loader')}>
					<Loader size={96} lineWidth={5} />
				</div>
			</div>
		);
	}

}

let cx = classNames('container-intro');

export default Intro;