import FilterSet from '../../source/models/filter-set';

describe('FilterSet', () => {

	let filters = null;

	beforeEach(() => {
		filters = new FilterSet([{
			id: 'div2',
			checkObject: ( value, object ) => object % value === 0,
			value: 2
		}, {
			id: 'notDiv11',
			checkObject: ( value, object ) => object % value !== 0,
			value: 11
		}]);
	});

	describe('getValue()', () => {

		it('retrieves filter value', () => {
			expect(filters.getValue('div2')).toBe(2);
			expect(filters.getValue('notDiv11')).toBe(11);
		});

	});

	describe('setValue()', () => {

		it('sets filter value', () => {
			let result = filters.setValue('notDiv11', 100);

			expect(result.getValue('notDiv11')).toBe(100);

			expect(filters.getValue('notDiv11')).toBe(11);
			expect(result).not.toBe(filters);
		});

	});

	describe('checkObject()', () => {

		it('checks all filters', () => {
			expect(filters.checkObject(6)).toBe(true);
			expect(filters.checkObject(11)).toBe(false);
			expect(filters.checkObject(22)).toBe(false);
		});

	});

});