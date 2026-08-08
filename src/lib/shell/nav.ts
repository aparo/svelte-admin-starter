// Navigation model for the admin shell: grouped sidebar routes + lookup helper.
import type { Component } from 'svelte';
import type { Pathname } from '$app/types';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Users from '@lucide/svelte/icons/users';
import Table from '@lucide/svelte/icons/table';
import ClipboardList from '@lucide/svelte/icons/clipboard-list';
import ComponentIcon from '@lucide/svelte/icons/component';
import ChartLine from '@lucide/svelte/icons/chart-line';
import Sparkles from '@lucide/svelte/icons/sparkles';
import User from '@lucide/svelte/icons/user';
import Settings from '@lucide/svelte/icons/settings';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import Inbox from '@lucide/svelte/icons/inbox';
import SquareKanban from '@lucide/svelte/icons/square-kanban';
import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Tag from '@lucide/svelte/icons/tag';
import CreditCard from '@lucide/svelte/icons/credit-card';

export interface NavItem {
	titleKey: string;
	href: Pathname;
	icon: Component;
	badge?: string | number;
}

export interface NavGroup {
	labelKey: string;
	items: NavItem[];
}

export const navGroups: NavGroup[] = [
	{
		labelKey: 'nav.groupOverview',
		items: [{ titleKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard }]
	},
	{
		labelKey: 'nav.groupManagement',
		items: [
			{ titleKey: 'nav.users', href: '/users', icon: Users },
			{ titleKey: 'nav.tables', href: '/tables', icon: Table },
			{ titleKey: 'nav.forms', href: '/forms', icon: ClipboardList }
		]
	},
	{
		labelKey: 'nav.groupApps',
		items: [
			{ titleKey: 'nav.calendar', href: '/calendar', icon: CalendarDays },
			{ titleKey: 'nav.inbox', href: '/inbox', icon: Inbox },
			{ titleKey: 'nav.kanban', href: '/kanban', icon: SquareKanban }
		]
	},
	{
		labelKey: 'nav.groupCommerce',
		items: [
			{ titleKey: 'nav.orders', href: '/orders', icon: ShoppingBag },
			{ titleKey: 'nav.cart', href: '/cart', icon: ShoppingCart }
		]
	},
	{
		labelKey: 'nav.groupShowcase',
		items: [
			{ titleKey: 'nav.components', href: '/components', icon: ComponentIcon },
			{ titleKey: 'nav.icons', href: '/icons', icon: Sparkles },
			{ titleKey: 'nav.charts', href: '/charts', icon: ChartLine }
		]
	},
	{
		labelKey: 'nav.groupBilling',
		items: [
			{ titleKey: 'nav.pricing', href: '/pricing', icon: Tag },
			{ titleKey: 'nav.billing', href: '/billing', icon: CreditCard }
		]
	},
	{
		labelKey: 'nav.groupAccount',
		items: [
			{ titleKey: 'nav.profile', href: '/profile', icon: User },
			{ titleKey: 'nav.settings', href: '/settings', icon: Settings }
		]
	}
];

/**
 * Find the nav item whose `href` is the longest prefix of `pathname`.
 * Returns the owning group alongside the matched item, or `undefined`.
 */
export function findNavItem(pathname: string): { group: NavGroup; item: NavItem } | undefined {
	let best: { group: NavGroup; item: NavItem } | undefined;
	for (const group of navGroups) {
		for (const item of group.items) {
			const isMatch = pathname === item.href || pathname.startsWith(item.href + '/');
			if (!isMatch) continue;
			if (!best || item.href.length > best.item.href.length) {
				best = { group, item };
			}
		}
	}
	return best;
}
