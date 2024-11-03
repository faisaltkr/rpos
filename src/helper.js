import Decimal from 'decimal.js-light';

/**
 * Usage
 * sum(0.1, 0.2) or sum([0.1, 0.2])
 */
export function sum(...args) {
	let numbers;
	if (Array.isArray(args[0])) {
		numbers = args[0];
	} else {
		numbers = args;
	}
	if (numbers instanceof Array) {
		const total = numbers.reduce((acc, current) => {
			return acc.add(current);
		}, new Decimal(0))
		return new Decimal(total).toString();
	}
	return ''
}