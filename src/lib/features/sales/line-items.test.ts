import { describe, expect, it } from 'vitest';
import { nextLineItemId, lineTotal, summarizeLines, type EditableLine } from './line-items';

describe('line-item IDs', () => {
	it('adds distinct keyed rows to an existing invoice without changing incoming IDs', () => {
		const incoming = [{ id: 1 }, { id: 2 }, { id: 12 }];
		const blankId = nextLineItemId(incoming);
		const withBlank = [...incoming, { id: blankId }];
		const catalogId = nextLineItemId(withBlank, blankId);
		const withCatalog = [...withBlank, { id: catalogId }];

		expect(blankId).toBe(13);
		expect(catalogId).toBe(14);
		expect(new Set(withCatalog.map((item) => item.id)).size).toBe(withCatalog.length);
		expect(withCatalog.slice(0, incoming.length)).toEqual([{ id: 1 }, { id: 2 }, { id: 12 }]);
	});

	it('keeps allocation monotonic when an added row is removed or new input arrives', () => {
		expect(nextLineItemId([{ id: 1 }], 14)).toBe(15);
		expect(nextLineItemId([{ id: 1 }, { id: 50 }], 14)).toBe(51);
		expect(nextLineItemId([])).toBe(1);
	});
});

describe('invoice preview totals', () => {
	const line: EditableLine = {
		id: 1,
		description: 'Service',
		qty: '2',
		unit_price: '50',
		discount_percent: '10',
		taxable: true,
		myinvois_classification: '',
		myinvois_tax_type: '',
		myinvois_exemption_reason: '',
		myinvois_unit_code: ''
	};

	it('applies discounts before tax and excludes non-taxable lines from tax', () => {
		const items = [line, { ...line, id: 2, taxable: false }];
		expect(lineTotal(line)).toBe(90);
		const summary = summarizeLines(items, 0.08);
		expect(summary.subtotal).toBe(180);
		expect(summary.tax).toBeCloseTo(7.2);
		expect(summary.total).toBeCloseTo(187.2);
		expect(items[0]).toEqual(line);
	});

	it('supports empty and temporarily cleared numeric inputs while editing', () => {
		expect(summarizeLines([], 0.08)).toEqual({ subtotal: 0, tax: 0, total: 0 });
		expect(lineTotal({ ...line, qty: '' })).toBe(0);
		expect(lineTotal({ ...line, unit_price: '' })).toBe(0);
		expect(lineTotal({ ...line, discount_percent: '' })).toBe(100);
	});
});
