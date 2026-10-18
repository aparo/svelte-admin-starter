export interface EditableLine {
	id: number;
	description: string;
	qty: string;
	unit_price: string;
	discount_percent: string;
	taxable: boolean;
	myinvois_classification: string;
	myinvois_tax_type: string;
	myinvois_exemption_reason: string;
	myinvois_unit_code: string;
}

/** Keep new keyed rows distinct from incoming rows and earlier local additions. */
export function nextLineItemId(items: readonly Pick<EditableLine, 'id'>[], previousId = 0): number {
	return items.reduce((highest, item) => Math.max(highest, item.id), previousId) + 1;
}

export interface ServiceItem {
	id: number;
	name: string;
	description?: string | null;
	default_unit_price: number;
	is_taxable: boolean;
	allow_multiple?: boolean;
	myinvois_classification?: string | null;
	myinvois_tax_type?: string | null;
	myinvois_exemption_reason?: string | null;
	myinvois_unit_code?: string | null;
}

/** Preview arithmetic; authoritative tax calculation belongs to the backend. */
export function lineTotal(row: EditableLine): number {
	return (
		(Number(row.qty) || 0) *
		(Number(row.unit_price) || 0) *
		(1 - (Number(row.discount_percent) || 0) / 100)
	);
}

export function summarizeLines(items: readonly EditableLine[], taxRate: number) {
	let subtotal = 0;
	let tax = 0;
	for (const item of items) {
		const amount = lineTotal(item);
		subtotal += amount;
		if (item.taxable) tax += amount * taxRate;
	}
	return { subtotal, tax, total: subtotal + tax };
}
