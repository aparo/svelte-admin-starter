import { describe, expect, it } from 'vitest';
import { openLandedRoute, Tabs } from './tabs.svelte';

function createTabs(confirmOverflow: () => Promise<boolean>, softLimit = 1) {
	return new Tabs({
		homePathname: '/home',
		softLimit,
		confirmOverflow,
		describe(pathname, _data, baseTitle) {
			const title = baseTitle ?? pathname;
			return { title, baseTitle: title };
		}
	});
}

function deferred<T>() {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>((done) => {
		resolve = done;
	});
	return { promise, resolve };
}

describe('portable tabs', () => {
	it('owns overflow confirmation and restores the previous URL when cancelled', async () => {
		let allow = false;
		let confirmations = 0;
		const tabs = createTabs(async () => {
			confirmations += 1;
			return allow;
		});
		await tabs.open('/home', undefined, '/home?view=active');

		let restored = '';
		expect(
			await openLandedRoute(tabs, '/reports', {}, '/reports?month=1', (url) => {
				restored = url;
			})
		).toBe(false);
		expect(restored).toBe('/home?view=active');
		expect(tabs.items).toHaveLength(1);

		allow = true;
		expect(await tabs.open('/reports', {}, '/reports?month=1')).toBe(true);
		expect(tabs.items.at(-1)?.url).toBe('/reports?month=1');
		expect(confirmations).toBe(2);
	});

	it('applies the same guard to independent and cloned tabs', async () => {
		let confirmations = 0;
		const tabs = createTabs(async () => {
			confirmations += 1;
			return false;
		});
		await tabs.open('/home');
		expect(await tabs.openNew('/reports')).toBeNull();
		expect(await tabs.clone(tabs.active)).toBeNull();
		expect(confirmations).toBe(2);
		expect(tabs.items).toHaveLength(1);
	});

	it('focuses one tab for concurrent opens of the same URL', async () => {
		const tabs = createTabs(async () => false);
		expect(
			await Promise.all([tabs.open('/users', { version: 1 }), tabs.open('/users', { version: 2 })])
		).toEqual([true, true]);
		expect(tabs.items).toHaveLength(1);
		expect(tabs.activeTab?.data).toEqual({ version: 2 });
	});

	it('checks the committed count for simultaneous distinct opens', async () => {
		let confirmations = 0;
		const tabs = createTabs(async () => {
			confirmations += 1;
			return false;
		});
		expect(await Promise.all([tabs.open('/users'), tabs.open('/reports')])).toEqual([true, false]);
		expect(tabs.items.map((tab) => tab.href)).toEqual(['/users']);
		expect(confirmations).toBe(1);
	});

	it('preserves explicit duplicate semantics while serializing every creation guard', async () => {
		let confirmations = 0;
		const tabs = createTabs(async () => {
			confirmations += 1;
			return true;
		});
		await tabs.open('/users');
		const source = tabs.active;
		const [second, third, cloned] = await Promise.all([
			tabs.openNew('/users'),
			tabs.openNew('/users'),
			tabs.clone(source)
		]);
		expect(new Set([source, second, third, cloned?.id]).size).toBe(4);
		expect(tabs.items).toHaveLength(4);
		expect(confirmations).toBe(3);
	});

	it('rechecks an existing URL after confirmation', async () => {
		const decision = deferred<boolean>();
		const prompted = deferred<void>();
		const tabs = createTabs(() => {
			prompted.resolve();
			return decision.promise;
		});
		await tabs.open('/other');
		const opening = tabs.open('/home');
		await prompted.promise;
		tabs.closeAll();
		decision.resolve(true);
		expect(await opening).toBe(true);
		expect(tabs.items.map((tab) => tab.href)).toEqual(['/home']);
	});

	it('does not clone a source closed during confirmation', async () => {
		const decision = deferred<boolean>();
		const prompted = deferred<void>();
		const tabs = createTabs(() => {
			prompted.resolve();
			return decision.promise;
		});
		await tabs.open('/users');
		const source = tabs.active;
		const cloning = tabs.clone(source);
		await prompted.promise;
		tabs.close(source);
		decision.resolve(true);
		expect(await cloning).toBeNull();
		expect(tabs.items).toHaveLength(0);
	});

	it('cancels pending and queued creations on reset without blocking the next session', async () => {
		const decision = deferred<boolean>();
		const prompted = deferred<void>();
		const tabs = createTabs(() => {
			prompted.resolve();
			return decision.promise;
		});
		await tabs.open('/users');
		let restored = '';
		const opening = openLandedRoute(tabs, '/reports', {}, '/reports', (url) => {
			restored = url;
		});
		const queued = tabs.openNew('/reports');
		await prompted.promise;
		tabs.reset();
		expect(await tabs.open('/home')).toBe(true);
		expect(await opening).toBe(false);
		expect(await queued).toBeNull();
		decision.resolve(true);
		expect(restored).toBe('');
		expect(tabs.items.map((tab) => tab.href)).toEqual(['/home']);
	});
});
