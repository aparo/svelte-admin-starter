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
import Search from '@lucide/svelte/icons/search';
import ListFilter from '@lucide/svelte/icons/list-filter';
import ListChecks from '@lucide/svelte/icons/list-checks';
import ListTodo from '@lucide/svelte/icons/list-todo';
import Database from '@lucide/svelte/icons/database';
import Loader from '@lucide/svelte/icons/loader';
import FormInput from '@lucide/svelte/icons/form-input';
import FileText from '@lucide/svelte/icons/file-text';
import Settings2 from '@lucide/svelte/icons/settings-2';
import User from '@lucide/svelte/icons/user';
import Settings from '@lucide/svelte/icons/settings';

export interface NavItem {
	title: string;
	href: Pathname;
	icon: Component;
	badge?: string | number;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

const configuredNavGroups: NavGroup[] = [
	{
		label: 'Overview',
		items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
	},
	{
		label: 'Applications',
		items: [
			{ title: 'Users', href: '/users', icon: Users },
			{ title: 'Calendar', href: '/calendar', icon: CalendarDays },
			{ title: 'Inbox', href: '/inbox', icon: Inbox },
			{ title: 'Kanban', href: '/kanban', icon: SquareKanban },
			{ title: 'Sales Orders', href: '/orders', icon: ShoppingBag },
			{ title: 'Cart', href: '/cart', icon: ShoppingCart },
			{ title: 'Pricing', href: '/pricing', icon: Tag },
			{ title: 'Billing', href: '/billing', icon: CreditCard }
		]
	},
	{
		label: 'Component Gallery',
		items: [
			{ title: 'Components', href: '/components', icon: ComponentIcon },
			{ title: 'Icons', href: '/icons', icon: Sparkles },
			{ title: 'Charts', href: '/charts', icon: ChartLine }
		]
	},
	{
		label: 'Data Tables',
		items: [
			{ title: 'Basic', href: '/tables/basic', icon: List },
			{ title: 'Pagination', href: '/tables/pagination', icon: ListTodo },
			{ title: 'Search & Sort', href: '/tables/search', icon: Search },
			{ title: 'Filters', href: '/tables/filters', icon: ListFilter },
			{ title: 'Selection', href: '/tables/selection', icon: ListChecks },
			{ title: 'Row Actions', href: '/tables/actions', icon: Settings2 },
			{ title: 'Server-side', href: '/tables/server', icon: Database },
			{ title: 'States', href: '/tables/states', icon: Loader }
		]
	},
	{
		label: 'Page Templates',
		items: [
			{ title: 'List', href: '/templates/list', icon: List },
			{ title: 'Form', href: '/templates/form', icon: FormInput },
			{ title: 'Detail', href: '/templates/detail', icon: FileText },
			{ title: 'Dashboard', href: '/templates/dashboard', icon: LayoutDashboard },
			{ title: 'Settings', href: '/templates/settings', icon: Settings2 }
		]
	},
	{
		label: 'Account',
		items: [
			{ title: 'Profile', href: '/profile', icon: User },
			{ title: 'Settings', href: '/settings', icon: Settings }
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
