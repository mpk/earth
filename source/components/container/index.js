/**
 *	Parent container
 */
import classNames from 'bem-class-names';
import React from 'react';
import * as reactRedux from 'react-redux';
import * as redux from 'redux';
import Error from './error';
import Footer from './footer';
import Intro from './intro';
import Details from '../details';
import Events from '../events';
import Filter from '../filter';
import Screen from '../screen';
import { RendererError } from '../screen/renderer';
import Timeline from '../timeline';
import Loader from '../shared/loader';
import Tappable from '../shared/tappable';
import actions from '../../actions';
import t from '../../i18n';
import options from '../../options';

class Container extends React.Component {

	componentDidMount() {
		document.addEventListener('touchmove', ( event ) => {
			// Do not prevent list scrolling
			let targetNode = event.target;

			while (targetNode) {
				if (targetNode.className == 'details-list') {
					return;
				}

				targetNode = targetNode.parentNode;
			}

			event.preventDefault();
		});
	}

	render() {
		let boundActions = redux.bindActionCreators(actions, this.props.dispatch);

		if (this.props.rendererError) {
			return (
				<div className={cx()}>
					{(this.props.rendererError == RendererError.InitFailure) ?
						<Error text={t('text.rendererInitFailure')} />
						: <Error text={t('text.rendererCrash')} />}
				</div>
			);
		} else if (!this.props.resources) {
			return (
				<div className={cx()}>
					{(this.props.resources === null) ?
						<Intro />
						: <Error text={t('text.resourcesError')} />}
				</div>
			);
		} else {
			let dataLoading = Object.keys(this.props.pointList.dataChunks)
				.some(( name ) => this.props.pointList.dataChunks[name] === true);

			return (
				<div className={cx()}>
					<Screen
						actions = {boundActions}
						resources = {this.props.resources}
						pointList = {this.props.pointListSlice}
						frameTime = {this.props.frameTime}
						selectedPoints = {this.props.selectedPoints}
						cameraPosition = {this.props.cameraPosition}
						cameraDistance = {this.props.cameraDistance} />

					<Timeline
						actions = {boundActions}
						pointList = {this.props.pointListSlice}
						timeRange = {this.props.timeRange}
						frameTime = {this.props.frameTime}
						maxTimeRange = {options.maxTimeRange} />

					<Footer />

					<Filter
						actions = {boundActions}
						filters = {this.props.filters}
						quakeGroups = {options.quakeGroups} />

					<Tappable className={cx('events-button')} onTap={boundActions.setEventListVisible.bind(this, true)}>
						{t('link.historicalEvents')}
					</Tappable>

					{dataLoading ?
						<div className={cx('data-loader')}>
							<Loader size={32} lineWidth={3} />
							{t('label.loadingData')}
						</div>
						: null}

					{(this.props.selectedPoints.length !== 0) ?
						<Details
							actions = {boundActions}
							points = {this.props.selectedPoints}
							sortProperty = {this.props.sortProperty}
							sortDirection = {this.props.sortDirection}
							quakeGroups = {options.quakeGroups} />
						: null}

					{this.props.eventListVisible ?
						<Events actions={boundActions} />
						: null}
				</div>
			);
		}
	}

}

let cx = classNames('container');

export default reactRedux.connect(( state ) => state)(Container);