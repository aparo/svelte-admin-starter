// Reactive localStorage helper. Returns a runes-backed `{ current }` container
// that reads the persisted value on the client and writes back on every change.
// SSR-safe: on the server it falls back to `initial` and never touches storage.

import { readStoredValue, writeStoredValue } from '../utils/local-storage';

/**
 * Persist a reactive value in `localStorage` under `key`.
 * Requires a reactive context, such as component initialization or `$effect.root`.
 * Its effect writes initially and tracks assignments and nested reactive changes.
 *
 * @example
 * const theme = useLocalStorage('admin-starter:theme', 'system');
 * theme.current = 'dark';
 */
export function useLocalStorage<T>(key: string, initial: T): { current: T } {
	// Read any existing value synchronously so the first render is correct.
	let value = $state<T>(readStoredValue(key, initial));

	$effect(() => {
		// JSON serialization also tracks reads of nested reactive properties.
		writeStoredValue(key, value);
	});

	return {
		get current() {
			return value;
		},
		set current(next: T) {
			value = next;
		}
	};
}
