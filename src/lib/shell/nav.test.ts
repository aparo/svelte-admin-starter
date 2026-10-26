import { describe, expect, it } from 'vitest';
import type { Component } from 'svelte';
import { appRoutePaths, filterNavGroups, findNavItem, type NavGroup } from './nav';

const Icon = (() => undefined) as unknown as Component;

describe('findNavItem', () => {
	it('finds a nav item by exact path', () => {
		expect(findNavItem('/dashboard')?.item.titleKey).toBe('nav.dashboard');
	});

	it('returns undefined for a path not in nav', () => {
		expect(findNavItem('/nonexistent')).toBeUndefined();
	});

	it('drops deleted routes and empty groups', () => {
		const groups: NavGroup[] = [
			{
				labelKey: 'nav.groupOverview',
				items: [
					{ titleKey: 'nav.dashboard', href: '/dashboard', icon: Icon },
					{ titleKey: 'nav.billing', href: '/billing', icon: Icon }
				]
			},
			{
				labelKey: 'nav.groupAccount',
				items: [{ titleKey: 'nav.profile', href: '/calendar', icon: Icon }]
			}
		];

		expect(filterNavGroups(groups, new Set(['/dashboard']))).toEqual([
			{
				labelKey: 'nav.groupOverview',
				items: [{ titleKey: 'nav.dashboard', href: '/dashboard', icon: Icon }]
			}
		]);
	});

	it('keeps navigation destinations nested inside route groups', () => {
		const paths = appRoutePaths([
			'/src/routes/(app)/(account)/settings/+page.svelte',
			'/src/routes/(app)/(work)/users/+page.svelte',
			'/src/routes/(auth)/login/+page.svelte'
		]);
		expect([...paths]).toEqual(['/settings', '/users']);
		expect(
			filterNavGroups(
				[{ label: 'Account', items: [{ title: 'Settings', href: '/settings', icon: Icon }] }],
				paths
			)
		).toHaveLength(1);
	});
});
