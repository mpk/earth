/**
 *	App options
 */
import TimeRange from './utils/time-range';

export default {

	initTimeRange: new TimeRange(1404172800000, 1435708799000),
	maxTimeRange: new TimeRange(1262304000000, 1475279999000),

	animationSpeed: 5000000,

	minCameraDistance: 1.25,
	maxCameraDistance: 6,

	quakeGroups: [
		{ magnitude: 4, color: '#1a9850' },
		{ magnitude: 5, color: '#91cf60' },
		{ magnitude: 6, color: '#d9ef8b' },
		{ magnitude: 7, color: '#fee08b' },
		{ magnitude: 8, color: '#fc8d59' },
		{ magnitude: 9, color: '#d73027' }
	],
	selectedQuakeColor: '#ff0000'

};