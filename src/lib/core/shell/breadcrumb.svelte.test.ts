import { expect, it } from 'vitest';
import { leafCrumb } from './breadcrumb.svelte';
import { Tabs } from './tabs.svelte';

it('refreshes retained titles after client labels are cleared for a new app session', async () => {
	const tabs = new Tabs({
		homePathname: '/home',
		confirmOverflow: async () => true,
		describe: (pathname) => ({ title: leafCrumb.get(pathname) ?? pathname })
	});
	leafCrumb.set('/users/1', 'Previous session name');
	await tabs.open('/users/1');
	await tabs.clone(tabs.active);
	leafCrumb.clear();
	tabs.refreshTitles();
	expect(leafCrumb.get('/users/1')).toBeNull();
	expect(tabs.items.map((tab) => tab.title)).toEqual(['/users/1', '/users/1']);
});
