import utils from '../../source/utils';

describe('utils', () => {

	describe('formatNumber()', () => {

		it('formats number', () => {
			expect(utils.formatNumber(750)).toBe('750');
			expect(utils.formatNumber(7501)).toBe('7 501');
			expect(utils.formatNumber(75012)).toBe('75 012');
			expect(utils.formatNumber(750123)).toBe('750 123');
			expect(utils.formatNumber(7501234)).toBe('7 501 234');
		});

	});

	describe('groupBy()', () => {

		it('groups an array', () => {
			let source = [1, 4.2, 5.8, 1.2, 5.4];
			let result = utils.groupBy(source, ( value ) => Math.floor(value));

			expect(result).toEqual({ 1: [1, 1.2], 4: [4.2], 5: [5.8, 5.4] });
		});

	});

	describe('hasWebGL()', () => {

		it('detects WebGL presence', () => {
			expect(utils.hasWebGL()).toBe(true);
		});

	});

});