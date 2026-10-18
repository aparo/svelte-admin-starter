import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import LineItemsEditor, { nextLineItemId, type EditableLine } from './LineItemsEditor.svelte';
import QuickCreateClient from './QuickCreateClient.svelte';

describe('domain component compatibility entry points', () => {
	it('renders existing invoice values and calculated totals through the shared entry point', () => {
		const items: EditableLine[] = [
			{
				id: 3,
				description: 'Consulting',
				qty: '2',
				unit_price: '50',
				discount_percent: '10',
				taxable: true,
				myinvois_classification: '',
				myinvois_tax_type: '',
				myinvois_exemption_reason: '',
				myinvois_unit_code: ''
			}
		];
		const html = render(LineItemsEditor, { props: { items, taxRate: 0.08 } }).body;
		expect(html).toContain('Consulting');
		expect(html).toContain('MYR 90.00');
		expect(html).toContain('MYR 97.20');
		expect(nextLineItemId(items)).toBe(4);
	});

	it('retains the customer creation trigger through its previous import path', () => {
		const html = render(QuickCreateClient, { props: { onCreated: () => {} } }).body;
		expect(html).toContain('aria-label="New client"');
		expect(html).toContain('type="button"');
	});
});
