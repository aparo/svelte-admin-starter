// Navigation model for the admin shell: grouped sidebar routes + lookup helper.
import type { Component } from 'svelte';
import type { Pathname } from '$app/types';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Users from '@lucide/svelte/icons/users';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import Inbox from '@lucide/svelte/icons/inbox';
import SquareKanban from '@lucide/svelte/icons/square-kanban';
import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Tag from '@lucide/svelte/icons/tag';
import CreditCard from '@lucide/svelte/icons/credit-card';
import ComponentIcon from '@lucide/svelte/icons/component';
import Sparkles from '@lucide/svelte/icons/sparkles';
import ChartLine from '@lucide/svelte/icons/chart-line';
import List from '@lucide/svelte/icons/list';
import FormInput from '@lucide/svelte/icons/form-input';
import User from '@lucide/svelte/icons/user';
import Settings from '@lucide/svelte/icons/settings';

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

const configuredNavGroups: NavGroup[] = [
	{
		labelKey: 'nav.groupOverview',
		items: [{ titleKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard }]
	},
	{
		labelKey: 'nav.groupManagement',
		items: [
			{ titleKey: 'nav.users', href: '/users', icon: Users },
			{ titleKey: 'nav.tables', href: '/tables', icon: List },
			{ titleKey: 'nav.forms', href: '/forms', icon: FormInput }
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

export function filterNavGroups(groups: NavGroup[], routes: ReadonlySet<string>): NavGroup[] {
	return groups
		.map((group) => ({ ...group, items: group.items.filter((item) => routes.has(item.href)) }))
		.filter((group) => group.items.length > 0);
}

const appRoutes = new Set(
	Object.keys(import.meta.glob('/src/routes/**/+page.svelte'))
		.filter((file) => file.includes('/(app)/'))
		.map((file) => file.slice('/src/routes/(app)'.length, -'/+page.svelte'.length))
);

/** Only render configured destinations whose route still exists. */
export const navGroups = filterNavGroups(configuredNavGroups, appRoutes);

/** Find the longest matching navigation path. */
export function findNavItem(pathname: string): { group: NavGroup; item: NavItem } | undefined {
	let best: { group: NavGroup; item: NavItem } | undefined;
	for (const group of navGroups) {
		for (const item of group.items) {
			const isMatch = pathname === item.href || pathname.startsWith(item.href + '/');
			if (isMatch && (!best || item.href.length > best.item.href.length)) best = { group, item };
		}
	}
	return best;
}
