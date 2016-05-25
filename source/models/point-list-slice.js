/**
 *	Point list slice (filtered view without allocations)
 *
 *	This class should be initialized from PointList only.
 */
class PointListSlice {

	/**
	 *	@param {PointList} pointList
	 *	@param {object} filters
	 *	@param {TimeRange} filters.timeRange
	 *	@param {FilterSet} filters.otherFilters
	 */
	constructor( pointList, filters ) {
		this.pointList = pointList;
		this.filters = filters;

		this.length = this.forEach();
	}

	/**
	 *	Iterate over points in this slice (from oldest to newest).
	 *
	 *	@param {function=} callback
	 *	@return {number} Number of points in this slice
	 */
	forEach( callback ) {
		let loadedChunks = Object.keys(this.pointList.dataChunks).sort()
			.map(( name ) => this.pointList.dataChunks[name])
			.filter(( dataChunk ) => Array.isArray(dataChunk));

		let iteratorIndex = -1;

		for (let chunkIndex = 0; chunkIndex < loadedChunks.length; chunkIndex += 1) {
			let loadedChunk = loadedChunks[chunkIndex];

			for (let i = 0; i < loadedChunk.length; i += 1) {
				let point = loadedChunk[i];

				let passesTimeFilter = point.time >= this.filters.timeRange.start && point.time <= this.filters.timeRange.end;
				if (passesTimeFilter) {
					if (!this.filters.otherFilters || this.filters.otherFilters.checkObject(point)) {
						iteratorIndex += 1;
						if (callback) {
							callback.call(this, point, iteratorIndex);
						}
					}
				}
			}
		}

		return iteratorIndex + 1;
	}

	/**
	 *	Get points that are around the specified position.
	 *
	 *	@param {Vector3} position
	 *	@param {number} maxDistance
	 *	@return {Array.<Point>}
	 */
	getClosest( position, maxDistance ) {
		let closestPoints = [];

		this.forEach(( point ) => {
			let distance = point.position.distanceTo(position);
			if (distance < maxDistance) {
				closestPoints.push(point);
			}
		});

		return closestPoints;
	}

}

export default PointListSlice;