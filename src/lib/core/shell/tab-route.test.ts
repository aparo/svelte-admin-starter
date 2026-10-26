import { describe, expect, it } from 'vitest';
import { TabRouteCache, type TabRoute } from './tab-route';
import { openLandedRoute, Tabs } from './tabs.svelte';

const route = (id: string, data: unknown = { id }): TabRoute => ({
	pathname: `/users/${id}`,
	url: new URL(`https://example.com/admin/users/${id}?view=detail`),
	params: { id },
	data,
	form: { id }
});
const tab = (id: string, url: string) => ({ id, url });

describe('keep-alive route snapshots', () => {
	it('keeps params, URL, data and form local to each cached tab', () => {
		const cache = new TabRouteCache();
		const tabs = [tab('first', '/users/1'), tab('second', '/users/2')];
		const first = route('1');
		cache.sync(tabs, 'first', '/users/1', first);
		cache.sync(tabs, 'second', '/users/2', route('2'));
		expect(cache.get('first')).toEqual(first);
		expect(cache.get('second')?.params.id).toBe('2');
		first.params.id = 'changed';
		first.url.searchParams.set('view', 'changed');
		expect(cache.get('first')?.params.id).toBe('1');
		expect(cache.get('first')?.url.searchParams.get('view')).toBe('detail');
	});

	it('assigns landed data after the active tab catches up to navigation', () => {
		const cache = new TabRouteCache();
		const tabs = [tab('first', '/users/1'), tab('second', '/users/2')];
		cache.sync(tabs, 'first', '/users/1', route('1'));
		const landed = route('2', { loaded: true });
		cache.sync(tabs, 'first', '/users/2', landed);
		expect(cache.get('first')?.params.id).toBe('1');
		cache.sync(tabs, 'second', '/users/2', landed);
		expect(cache.get('second')?.data).toEqual({ loaded: true });
	});

	it('retains successful snapshots while an error route has no load data', () => {
		const cache = new TabRouteCache();
		const tabs = [tab('first', '/users/1'), tab('failed', '/users/2')];
		cache.sync(tabs, 'first', '/users/1', route('1'));
		const before = cache.get('first');
		cache.sync(tabs, 'failed', '/users/2');
		expect(cache.get('first')).toBe(before);
		expect(cache.get('failed')).toBeUndefined();
	});

	it('does not replace an inactive duplicate snapshot on a same-URL tab switch', () => {
		const cache = new TabRouteCache();
		const tabs = [tab('first', '/users/1'), tab('clone', '/users/1')];
		const initial = route('1', { version: 1 });
		cache.sync(tabs, 'first', '/users/1', initial);
		const updated = route('1', { version: 2 });
		cache.sync(tabs, 'clone', '/users/1', updated);
		cache.sync(tabs, 'first', '/users/1', updated);
		expect(cache.get('first')?.data).toEqual({ version: 1 });
		expect(cache.get('clone')?.data).toEqual({ version: 2 });
		expect(cache.get('first')?.params).not.toBe(cache.get('clone')?.params);
	});

	it('releases snapshots when their tabs close', () => {
		const cache = new TabRouteCache();
		cache.sync([tab('first', '/users/1')], 'first', '/users/1', route('1'));
		cache.sync([], '', '/users/2');
		expect(cache.get('first')).toBeUndefined();
		cache.sync([tab('new', '/users/1')], 'new', '/users/2');
		expect(cache.get('new')).toBeUndefined();
	});

	it('uses a committed tab snapshot after a newer navigation supersedes the current URL', () => {
		const cache = new TabRouteCache();
		const first = route('1');
		cache.sync([], '', '/users/1', first);
		cache.sync([], '', '/users/2', route('2'));
		cache.sync([{ ...tab('delayed', '/users/1'), route: first }], 'delayed', '/users/2');
		expect(cache.get('delayed')?.params).toEqual({ id: '1' });
		expect(cache.get('delayed')?.data).toEqual({ id: '1' });
	});

	it('preserves an existing successful snapshot when the same URL lands with a load error', async () => {
		const tabs = new Tabs({
			homePathname: '/home',
			confirmOverflow: async () => true,
			describe: (pathname) => ({ title: pathname })
		});
		const cache = new TabRouteCache();
		const successful = route('1', { name: 'Original user' });
		await tabs.open('/users/1', successful.data, '/users/1', successful);
		cache.sync(tabs.items, tabs.active, '/users/1', successful);
		const before = cache.get(tabs.active);
		await openLandedRoute(tabs, '/users/1', { partial: 'failed data' }, '/users/1', () => {}, null);
		cache.sync(tabs.items, tabs.active, '/users/1');
		expect(tabs.activeTab?.data).toEqual({ name: 'Original user' });
		expect(cache.get(tabs.active)).toBe(before);
		expect(cache.get(tabs.active)?.form).toEqual({ id: '1' });
	});
});
