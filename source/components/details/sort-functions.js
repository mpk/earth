/**
 *	Sort and group functions for magnitude, time and depth properties
 */
import moment from 'moment';
import t from '../../i18n';
import utils from '../../utils';

export default {

	magnitude: {

		/**
		 *	Group earthquakes by integer magnitude.
		 *
		 *	@param {Array.<Point>} points
		 *	@return {object}
		 */
		getGroups( points ) {
			return utils.groupBy(points, ( quake ) => quake.magnitudeFloor);
		},

		/**
		 *	Sort order function for groups.
		 *
		 *	@param {number} sortDirection - 1 or -1
		 *	@return {function}
		 */
		sortGroups( sortDirection ) {
			return ( groupID1, groupID2 ) => (groupID1 - groupID2) * sortDirection;
		},

		/**
		 *	@param {string} groupID
		 *	@return {string}
		 */
		getGroupName( groupID ) {
			return `${t('label.magnitude')} ${groupID} - ${groupID}.9`;
		},

		/**
		 *	Sort order function for points.
		 *
		 *	@param {number} sortDirection - 1 or -1
		 *	@return {function}
		 */
		sortPoints( sortDirection ) {
			return ( quake1, quake2 ) => (quake1.data.magnitude - quake2.data.magnitude) * sortDirection;
		}

	},

	time: {

		/**
		 *	Group earthquakes by month.
		 *
		 *	@param {Array.<Point>} points
		 *	@return {object}
		 */
		getGroups( points ) {
			return utils.groupBy(points, ( quake ) => moment.utc(quake.time).format('YYYY-MM'));
		},

		/**
		 *	Sort order function for groups.
		 *
		 *	@param {number} sortDirection - 1 or -1
		 *	@return {function}
		 */
		sortGroups( sortDirection ) {
			return ( groupID1, groupID2 ) => groupID1.localeCompare(groupID2) * sortDirection;
		},

		/**
		 *	@param {string} groupID
		 *	@return {string}
		 */
		getGroupName( groupID ) {
			return moment(groupID, 'YYYY-MM').format('MMMM YYYY');
		},

		/**
		 *	Sort order function for points.
		 *
		 *	@param {number} sortDirection - 1 or -1
		 *	@return {function}
		 */
		sortPoints( sortDirection ) {
			return ( quake1, quake2 ) => (quake1.time - quake2.time) * sortDirection;
		}

	},

	depth: {

		/**
		 *	Sort order function for points.
		 *
		 *	@param {number} sortDirection - 1 or -1
		 *	@return {function}
		 */
		sortPoints( sortDirection ) {
			return ( quake1, quake2 ) => (quake2.data.depth - quake1.data.depth) * sortDirection;
		}

	}

};