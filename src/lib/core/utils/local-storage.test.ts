import { afterEach, describe, expect, it, vi } from 'vitest';
import { readStoredValue, writeStoredValue } from './local-storage';
import { useLocalStorage } from '../hooks/use-local-storage.svelte';
import { persisted } from '../stores/persisted.svelte';

afterEach(() => vi.unstubAllGlobals());

describe('shared local storage', () => {
	it('reads stored JSON and falls back for missing, malformed or inaccessible entries', () => {
		const initial = { enabled: true };
		const getItem = vi.fn().mockReturnValue('{"enabled":false}');
		vi.stubGlobal('localStorage', { getItem });
		expect(readStoredValue('settings', initial)).toEqual({ enabled: false });
		for (const raw of [null, '{invalid']) {
			getItem.mockReturnValue(raw);
			expect(readStoredValue('settings', initial)).toBe(initial);
		}
		getItem.mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(readStoredValue('settings', initial)).toBe(initial);
	});

	it('serializes values while tolerating write and serialization failures', () => {
		const setItem = vi.fn();
		vi.stubGlobal('localStorage', { setItem });
		writeStoredValue('settings', { nested: { name: '雪' } });
		expect(setItem).toHaveBeenCalledWith('settings', '{"nested":{"name":"雪"}}');
		setItem.mockImplementation(() => {
			throw new Error('quota');
		});
		expect(() => writeStoredValue('settings', { enabled: false })).not.toThrow();
		expect(() => writeStoredValue('settings', 1n)).not.toThrow();
	});

	it('allows both public containers to be used safely during SSR', () => {
		vi.stubGlobal('localStorage', undefined);
		const hook = useLocalStorage('hook', 'initial');
		const store = persisted('store', 'initial');
		expect(hook.current).toBe('initial');
		expect(store.current).toBe('initial');
		hook.current = 'updated';
		store.current = 'updated';
		expect(hook.current).toBe('updated');
		expect(store.current).toBe('updated');
	});

	it('keeps persisted assignment-driven without an initial or nested-mutation write', () => {
		const setItem = vi.fn();
		vi.stubGlobal('localStorage', {
			getItem: () => '{"nested":{"count":2}}',
			setItem
		});
		const store = persisted('settings', { nested: { count: 0 } });
		expect(store.current.nested.count).toBe(2);
		expect(setItem).not.toHaveBeenCalled();
		store.current.nested.count = 3;
		expect(setItem).not.toHaveBeenCalled();
		store.current = { nested: { count: 4 } };
		expect(setItem).toHaveBeenCalledExactlyOnceWith('settings', '{"nested":{"count":4}}');
	});
});
