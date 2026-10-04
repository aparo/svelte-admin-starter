import type { Column } from '$lib/components/shared';
import type { DemoProduct } from '$lib/data/products';

export const columns: Column<DemoProduct>[] = [
	{ key: 'name', header: 'Product', sortable: true, searchable: true },
	{ key: 'category', header: 'Category', sortable: true, searchable: true },
	{ key: 'price', header: 'Price', sortable: true, align: 'right' },
	{ key: 'stock', header: 'Stock', sortable: true, align: 'right' },
	{ key: 'status', header: 'Status' }
];
