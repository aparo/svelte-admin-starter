import { describe, expect, it } from 'vitest';
import { nextLineItemId } from './LineItemsEditor.svelte';

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
