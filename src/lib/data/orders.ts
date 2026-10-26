// Mock orders for the local list and detail-drawer demo. No backend involved.
export interface DemoOrder {
	id: string;
	number: string;
	customer: string;
	email: string;
	date: string;
	items: { name: string; qty: number; price: number }[];
	total: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export type OrderStatus = DemoOrder['status'];

// --- Mock data ----------------------------------------------------------
export const demoOrders: DemoOrder[] = [
	{
		id: 'ord_1',
		number: 'ORD-2048',
		customer: 'Olivia Martin',
		email: 'olivia.martin@example.com',
		date: '2026-06-08',
		items: [
			{ name: 'Aurora Desk Lamp', qty: 1, price: 89 },
			{ name: 'Walnut Pen Holder', qty: 2, price: 24 }
		],
		total: 137,
		status: 'pending'
	},
	{
		id: 'ord_2',
		number: 'ORD-2047',
		customer: 'Liam Johnson',
		email: 'liam.johnson@example.com',
		date: '2026-06-07',
		items: [
			{ name: 'Mechanical Keyboard', qty: 1, price: 149 },
			{ name: 'Braided USB-C Cable', qty: 3, price: 14 }
		],
		total: 191,
		status: 'processing'
	},
	{
		id: 'ord_3',
		number: 'ORD-2046',
		customer: 'Sophia Miller',
		email: 'sophia.miller@example.com',
		date: '2026-06-07',
		items: [{ name: 'Linen Throw Blanket', qty: 2, price: 65 }],
		total: 130,
		status: 'shipped'
	},
	{
		id: 'ord_4',
		number: 'ORD-2045',
		customer: 'Noah Brown',
		email: 'noah.brown@example.com',
		date: '2026-06-06',
		items: [
			{ name: 'Ceramic Pour-Over Set', qty: 1, price: 78 },
			{ name: 'Single-Origin Beans', qty: 4, price: 19 }
		],
		total: 154,
		status: 'delivered'
	},
	{
		id: 'ord_5',
		number: 'ORD-2044',
		customer: 'Emma Williams',
		email: 'emma.williams@example.com',
		date: '2026-06-05',
		items: [{ name: 'Studio Monitor Stand', qty: 2, price: 112 }],
		total: 224,
		status: 'processing'
	},
	{
		id: 'ord_6',
		number: 'ORD-2043',
		customer: 'James Wilson',
		email: 'james.wilson@example.com',
		date: '2026-06-05',
		items: [
			{ name: 'Leather Cardholder', qty: 1, price: 45 },
			{ name: 'Travel Notebook', qty: 2, price: 18 }
		],
		total: 81,
		status: 'cancelled'
	},
	{
		id: 'ord_7',
		number: 'ORD-2042',
		customer: 'Charlotte Anderson',
		email: 'charlotte.anderson@example.com',
		date: '2026-06-04',
		items: [
			{ name: 'Aurora Desk Lamp', qty: 2, price: 89 },
			{ name: 'Smart Power Strip', qty: 1, price: 39 }
		],
		total: 217,
		status: 'delivered'
	},
	{
		id: 'ord_8',
		number: 'ORD-2041',
		customer: 'Benjamin Davis',
		email: 'benjamin.davis@example.com',
		date: '2026-06-03',
		items: [{ name: 'Wireless Earbuds Pro', qty: 1, price: 179 }],
		total: 179,
		status: 'shipped'
	},
	{
		id: 'ord_9',
		number: 'ORD-2040',
		customer: 'Amelia Garcia',
		email: 'amelia.garcia@example.com',
		date: '2026-06-02',
		items: [
			{ name: 'Bamboo Drawer Organizer', qty: 3, price: 22 },
			{ name: 'Matte Storage Bins', qty: 2, price: 16 }
		],
		total: 98,
		status: 'pending'
	},
	{
		id: 'ord_10',
		number: 'ORD-2039',
		customer: 'Lucas Rodriguez',
		email: 'lucas.rodriguez@example.com',
		date: '2026-06-01',
		items: [
			{ name: '4K Webcam', qty: 1, price: 129 },
			{ name: 'Adjustable Ring Light', qty: 1, price: 54 }
		],
		total: 183,
		status: 'delivered'
	},
	{
		id: 'ord_11',
		number: 'ORD-2038',
		customer: 'Mia Moore',
		email: 'mia.moore@example.com',
		date: '2026-05-31',
		items: [{ name: 'Insulated Water Bottle', qty: 4, price: 28 }],
		total: 112,
		status: 'processing'
	},
	{
		id: 'ord_12',
		number: 'ORD-2037',
		customer: 'Henry Taylor',
		email: 'henry.taylor@example.com',
		date: '2026-05-30',
		items: [
			{ name: 'Standing Desk Converter', qty: 1, price: 199 },
			{ name: 'Anti-Fatigue Mat', qty: 1, price: 49 }
		],
		total: 248,
		status: 'shipped'
	}
];
