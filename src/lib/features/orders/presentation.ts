import type { BadgeTone } from '$lib/core/components/shared/StatusBadge.svelte';
import type { OrderStatus } from '$lib/data/orders';

export const ORDER_STATUSES = {
	pending: { label: 'Pending', tone: 'warning' },
	processing: { label: 'Processing', tone: 'info' },
	shipped: { label: 'Shipped', tone: 'brand' },
	delivered: { label: 'Delivered', tone: 'success' },
	cancelled: { label: 'Cancelled', tone: 'danger' }
} as const satisfies Record<OrderStatus, { label: string; tone: BadgeTone }>;

export function statusTone(status: OrderStatus): BadgeTone {
	return ORDER_STATUSES[status]?.tone ?? 'neutral';
}

export function statusLabel(status: OrderStatus): string {
	return ORDER_STATUSES[status]?.label ?? status;
}
