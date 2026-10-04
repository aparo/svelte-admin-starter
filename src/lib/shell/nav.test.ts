import { describe, expect, it } from 'vitest';
import type { Component } from 'svelte';
import { filterNavGroups, findNavItem, type NavGroup } from './nav';

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
});
