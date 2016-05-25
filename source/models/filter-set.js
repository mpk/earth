/**
 *	Immutable set of filters
 */
class FilterSet {

	/**
	 *	@param {Array.<{ id: string, checkObject: function, value: *}>} filters
	 */
	constructor( filters ) {
		this.filters = filters;
	}

	/**
	 *	Get value of the specified filter.
	 *
	 *	@param {string} id
	 *	@return {*}
	 */
	getValue( id ) {
		return Array.find(this.filters, ( filter ) => filter.id == id).value;
	}

	/**
	 *	Set value of the specified filter.
	 *
	 *	@param {string} id
	 *	@param {*} value
	 *	@return {FilterSet}
	 */
	setValue( id, value ) {
		let filters = this.filters.map(( object ) => Object.assign({}, object));

		Array.find(filters, ( filter ) => filter.id == id).value = value;

		return new FilterSet(filters);
	}

	/**
	 *	Check if the specified object passes all filters.
	 *
	 *	@param {object} object
	 *	@return {boolean}
	 */
	checkObject( object ) {
		for (let i = 0; i < this.filters.length; i += 1) {
			if (!this.filters[i].checkObject(this.filters[i].value, object)) {
				return false;
			}
		}

		return true;
	}

}

export default FilterSet;