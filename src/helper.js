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
		return total;
	}
	return 0
}


export function calculateTotal(items) {
	let totalWithoutVatCents = 0;
	let totalVatCents = 0;
	
	items.forEach(item => {
			const vatRate = item.taxes[0].tax_rate; // No division by 100
			const priceCents = Math.round(item.price * 100); // Convert price to cents
			const vatAmountCents = Math.round((priceCents * vatRate * quantity) / 100);
			
			totalWithoutVatCents += priceCents * item.quantity;
			totalVatCents += vatAmountCents;
	});
	
	const totalPriceCents = totalWithoutVatCents + totalVatCents;
	
	// Convert totals back to dollars and round to 2 decimal places
	const totalWithoutVat = (totalWithoutVatCents / 100).toFixed(2);
	const totalVat = (totalVatCents / 100).toFixed(2);
	const totalPrice = (totalPriceCents / 100).toFixed(2);
	
	return { 
			totalWithoutVat, 
			totalVat,
			totalPrice 
	};
}
