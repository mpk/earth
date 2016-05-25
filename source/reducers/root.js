/**
 *	Root reducer
 */
import math from 'math';
import { handleActions } from 'redux-actions';
import options from '../options';
import FilterSet from '../models/filter-set';
import PointList from '../models/point-list';
import Quake from '../models/quake';
import GeoPoint from '../utils/geo-point';
import TimeRange from '../utils/time-range';

export default handleActions({

	LoadResourcesSuccess( state, action ) {
		return { ...state, resources: action.payload };
	},

	LoadResourcesError( state ) {
		return { ...state, resources: false };
	},

	SetTimeRange( state, action ) {
		let pointListSlice = getPointListSlice({ ...state, timeRange: action.payload });

		return { ...state, timeRange: action.payload, pointListSlice };
	},

	LoadDataChunkRequest( state, action ) {
		let pointList = state.pointList.setDataChunk(action.payload, true);

		return { ...state, pointList };
	},

	LoadDataChunkSuccess( state, action ) {
		let { id, data } = action.payload;

		let pointList = state.pointList.setDataChunk(id, data.map(( object ) => new Quake(object, object.data)));
		let pointListSlice = getPointListSlice({ ...state, pointList });

		return { ...state, pointList, pointListSlice };
	},

	LoadDataChunkError( state, action ) {
		let pointList = state.pointList.setDataChunk(action.payload, false);

		return { ...state, pointList };
	},

	SetFilterValue( state, action ) {
		let { id, value } = action.payload;

		let filters = state.filters.setValue(id, value);
		let pointListSlice = getPointListSlice({ ...state, filters });

		return { ...state, filters, pointListSlice };
	},

	SelectPoints( state, action ) {
		return { ...state, selectedPoints: action.payload };
	},

	SetSortFunction( state, action ) {
		return { ...state, ...action.payload };
	},

	SetFrameTime( state, action ) {
		return { ...state, frameTime: action.payload };
	},

	SetCameraPosition( state, action ) {
		return { ...state, cameraPosition: action.payload };
	},

	SetCameraDistance( state, action ) {
		let cameraDistance = math.clamp(action.payload, options.minCameraDistance, options.maxCameraDistance);

		return { ...state, cameraDistance };
	},

	SetEventListVisible( state, action ) {
		return { ...state, eventListVisible: action.payload };
	},

	SetEvent( state ) {
		return { ...state, eventListVisible: false };
	},

	ReportRendererError( state, action ) {
		return { ...state, rendererError: action.payload };
	}

}, {
	pointList: new PointList(),
	pointListSlice: (new PointList()).getSlice(),

	timeRange: new TimeRange(0, 0),
	frameTime: 0,

	filters: new FilterSet([{
		id: 'magnitude',
		checkObject: ( value, point ) => !!(value & point.magnitudeBit),
		value: 1008 // Bitfield
	}]),

	selectedPoints: [],
	sortProperty: 'magnitude',
	sortDirection: -1,

	cameraPosition: new GeoPoint(),
	cameraDistance: 4.5,

	eventListVisible: false,

	resources: null,
	rendererError: null
});

function getPointListSlice( state ) {
	return state.pointList.getSlice({
		timeRange: state.timeRange,
		otherFilters: state.filters
	});
}