/**
 *	Error element
 */
import classNames from 'bem-class-names';
import React from 'react';

class Error extends React.Component {

	render() {
		return (
			<div className={cx()}>
				<svg className={cx('icon')}>
					<circle cx="32" cy="32" r="28"></circle>
					<circle cx="24" cy="24" r="4"></circle>
					<circle cx="40" cy="24" r="4"></circle>
					<path d="M20,43 c8,-6,16,-6,24,0"></path>
				</svg>
				<span className={cx('text')}>
					{this.props.text}
				</span>
			</div>
		);
	}

}

let cx = classNames('container-error');

export default Error;