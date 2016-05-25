/**
 *	Action creators
 */
import BezierEasing from 'bezier-easing';
import math from 'math';
import { createAction } from 'redux-actions';
import THREE from 'three';
import options from './options';
import GeoPoint from './utils/geo-point';
import resourceLoader from './utils/resource-loader';
import Transition from './utils/transition';

let actions = {

	loadResources( resources ) {
		return ( dispatch ) => {
			resourceLoader.load(resources).then(( loadedResources ) => {
				dispatch(createAction('LoadResourcesSuccess')(loadedResources));

				dispatch(actions.setTimeRange(options.initTimeRange));
			}).catch(( error ) => {
				console.error(error);
				dispatch(createAction('LoadResourcesError')());
			});
		};
	},

	setTimeRange( timeRange ) {
		return ( dispatch, getState ) => {
			dispatch(actions.stopAnimation());

			dispatch(createAction('SetTimeRange')(timeRange));

			// Load necessary data
			let state = getState();

			state.timeRange.forEach('quarter', ( moment ) => {
				let chunkID = moment.format('YYYY-MM');

				if (!state.pointList.getDataChunk(chunkID)) {
					dispatch(createAction('LoadDataChunkRequest')(chunkID));

					resourceLoader.load({ data: `static/data/${chunkID}.json` }).then(( resources ) => {
						dispatch(createAction('LoadDataChunkSuccess')({ id: chunkID, data: resources.data }));
					}).catch(( error ) => {
						console.error(error);
						dispatch(createAction('LoadDataChunkError')(chunkID));
					});
				}
			});
		};
	},

	setFilterValue: createAction('SetFilterValue', ( id, value ) => ({ id, value })),

	selectPoints: createAction('SelectPoints'),

	setSortFunction: createAction('SetSortFunction', ( sortProperty, sortDirection ) => ({ sortProperty, sortDirection })),

	startAnimation() {
		return ( dispatch, getState ) => {
			let timeRange = getState().timeRange;

			Transition.start('Animation', timeRange.start, timeRange.end, timeRange.getSize() / options.animationSpeed)
				.on('update', ( value ) => dispatch(createAction('SetFrameTime')(value)))
				.on('end', () => dispatch(createAction('SetFrameTime')(0)));
		};
	},

	stopAnimation() {
		return ( dispatch ) => {
			Transition.stop('Animation');

			dispatch(createAction('SetFrameTime')(0));
		};
	},

	setCameraPosition( cameraPosition, animationDuration = 0 ) {
		return ( dispatch, getState ) => {
			Transition.stop('Event');
			Transition.stop('CameraPosition');

			if (animationDuration) {
				let startCameraPosition = getState().cameraPosition;

				Transition.start('CameraPosition', 0, 1, animationDuration, BezierEasing(0, 0, 0.25, 1))
					.on('update', ( value ) => {
						let newCameraPosition = GeoPoint.lerp(startCameraPosition, cameraPosition, value);
						dispatch(createAction('SetCameraPosition')(newCameraPosition));
					});
			} else {
				dispatch(createAction('SetCameraPosition')(cameraPosition));
			}
		};
	},

	setCameraDistanceRelative( dtDistance ) {
		return ( dispatch, getState ) => {
			Transition.stop('Event');

			let prevTransition = Transition.stop('CameraDistance');
			let prevValueTo = (prevTransition && prevTransition.valueTo) || getState().cameraDistance;
			let valueTo = math.clamp(prevValueTo + dtDistance, options.minCameraDistance, options.maxCameraDistance);

			Transition.start('CameraDistance', 0, valueTo, 100)
				.on('update', () => {
					let cameraDistance = getState().cameraDistance + (valueTo - getState().cameraDistance) * 0.3;
					dispatch(createAction('SetCameraDistance')(cameraDistance));
				});
		};
	},

	setEventListVisible: createAction('SetEventListVisible'),

	setEvent( event ) {
		return ( dispatch, getState ) => {
			dispatch(actions.stopAnimation());
			Transition.stop('CameraPosition');
			Transition.stop('CameraDistance');

			dispatch(createAction('SetEvent')(event));

			dispatch(actions.setTimeRange(event.timeRange));

			let startCameraPosition = getState().cameraPosition.normalize();
			let startCameraDistance = getState().cameraDistance;
			let eventDistance = GeoPoint.getEuclideanDistance(startCameraPosition, event.cameraPosition, true);

			Transition.start('Event', 0, 1, 1500, BezierEasing(0.42, 0, 0.58, 1))
				.on('update', ( value ) => {
					let cameraPosition = GeoPoint.lerp(startCameraPosition, event.cameraPosition, value, true);
					let cameraDistance = THREE.ShapeUtils.b2(value, startCameraDistance,
						math.mapLinearClamp(eventDistance, 0, 180, event.cameraDistance, 4.5), event.cameraDistance);

					dispatch(createAction('SetCameraPosition')(cameraPosition));
					dispatch(createAction('SetCameraDistance')(cameraDistance));
				});
		};
	},

	reportRendererError: createAction('ReportRendererError')

};

export default actions;