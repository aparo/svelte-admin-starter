import { describe, expect, it } from 'vitest';
import { findNavItem } from './nav';

describe('findNavItem', () => {
	it('finds a template route', () => {
		expect(findNavItem('/templates/list')?.item.title).toBe('List');
	});

	it('does not register the template index as a sidebar item', () => {
		expect(findNavItem('/templates')).toBeUndefined();
	});
});
