import { describe, expect, it } from 'vitest';
import { calculateCartTotals, parsePromoCode } from './totals';

describe('cart pricing', () => {
	it.each([null, 'SAVE10'])('charges nothing for an empty cart with promo %s', (promo) => {
		expect(calculateCartTotals([], promo)).toEqual({
			subtotal: 0,
			discount: 0,
			discountedSubtotal: 0,
			shipping: 0,
			tax: 0,
			total: 0,
			itemCount: 0,
			remainingForFreeShipping: 0
		});
	});

	it('counts quantities, charges flat shipping and taxes only the item subtotal', () => {
		const totals = calculateCartTotals([
			{ price: 40, quantity: 2 },
			{ price: 20, quantity: 1 }
		]);
		expect(totals).toMatchObject({
			subtotal: 100,
			discount: 0,
			discountedSubtotal: 100,
			shipping: 9.99,
			tax: 8,
			itemCount: 3,
			remainingForFreeShipping: 100
		});
		expect(totals.total).toBeCloseTo(117.99);
	});

	it('checks free shipping after discount and taxes the discounted subtotal', () => {
		const items = [{ price: 200, quantity: 1 }];
		expect(calculateCartTotals(items).shipping).toBe(0);
		const totals = calculateCartTotals(items, 'SAVE10');
		expect(totals).toMatchObject({
			subtotal: 200,
			discount: 20,
			discountedSubtotal: 180,
			shipping: 9.99,
			tax: 14.4,
			remainingForFreeShipping: 20
		});
		expect(totals.total).toBeCloseTo(204.39);
		expect(calculateCartTotals([{ price: 250, quantity: 1 }], 'SAVE10').shipping).toBe(0);
	});

	it('does not grant a discount for an unaccepted code', () => {
		expect(calculateCartTotals([{ price: 100, quantity: 1 }], 'OTHER').discount).toBe(0);
	});

	it.each(['SAVE10', 'save10', '  SaVe10\n'])('normalizes a valid promo %j', (input) => {
		expect(parsePromoCode(input)).toBe('SAVE10');
	});

	it.each(['', ' ', 'SAVE20', 'SAVE 10', 'SAVE10!'])('rejects invalid promo %j', (input) => {
		expect(parsePromoCode(input)).toBeNull();
	});
});
