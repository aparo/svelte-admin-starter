import { describe, expect, it } from 'vitest';
import { tabTitleFor } from './tabs.svelte';

describe('tabTitleFor', () => {
	it('prefixes table, page-template, and setting tabs', () => {
		expect(tabTitleFor('/tables/basic')).toBe('Table: Basic');
		expect(tabTitleFor('/templates/list')).toBe('Page: List');
		expect(tabTitleFor('/settings')).toBe('Setting: Settings');
		expect(tabTitleFor('/templates/settings')).toBe('Page: Settings');
		expect(tabTitleFor('/dashboard')).toBe('Dashboard');
	});
});
