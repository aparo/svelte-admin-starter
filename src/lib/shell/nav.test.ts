import { describe, expect, it } from 'vitest';
import type { Component } from 'svelte';
import { filterNavGroups, findNavItem, type NavGroup } from './nav';

const Icon = (() => undefined) as unknown as Component;

describe('findNavItem', () => {
	it('finds a template route', () => {
		expect(findNavItem('/templates/list')?.item.title).toBe('List');
	});

	it('does not register the template index as a sidebar item', () => {
		expect(findNavItem('/templates')).toBeUndefined();
	});

	it('drops deleted routes and empty groups', () => {
		const groups: NavGroup[] = [
			{
				label: 'Examples',
				items: [
					{ title: 'Keep', href: '/dashboard', icon: Icon },
					{ title: 'Delete', href: '/billing', icon: Icon }
				]
			},
			{ label: 'Empty', items: [{ title: 'Missing', href: '/calendar', icon: Icon }] }
		];

		expect(filterNavGroups(groups, new Set(['/dashboard']))).toEqual([
			{ label: 'Examples', items: [{ title: 'Keep', href: '/dashboard', icon: Icon }] }
		]);
	});
});
