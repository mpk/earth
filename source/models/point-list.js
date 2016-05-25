/**
 *	Immutable point list
 *
 *	Points are stored in named chunks (e.g. for each quarter of year) and should be iterated with PointListSlice instance (getSlice() method).
 *	Each chunk should contain an array of points (chunks with types other than array are ignored during iteration).
 */
import PointListSlice from './point-list-slice';

class PointList {

	/**
	 *	@param {object=} dataChunks
	 */
	constructor( dataChunks = {} ) {
		this.dataChunks = dataChunks;
	}

	/**
	 *	Get value of the specified data chunk.
	 *
	 *	@param {string} id
	 *	@return {*}
	 */
	getDataChunk( id ) {
		return this.dataChunks[id];
	}

	/**
	 *	Set value of the specified data chunk.
	 *
	 *	@param {string} id
	 *	@param {*} value
	 *	@return {PointList}
	 */
	setDataChunk( id, value ) {
		let dataChunks = Object.assign({}, this.dataChunks, { [id]: value });

		return new PointList(dataChunks);
	}

	/**
	 *	Create a new filtered view on this point list.
	 *
	 *	@param {object} filters
	 *	@param {TimeRange} filters.timeRange
	 *	@param {FilterSet} filters.otherFilters
	 *	@return {PointListSlice}
	 */
	getSlice( filters ) {
		return new PointListSlice(this, filters);
	}

}

export default PointList;