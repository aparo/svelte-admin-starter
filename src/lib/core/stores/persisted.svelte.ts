// Reusable runes-based persisted state. Reads from localStorage on init and
// writes only when `current` is assigned. Nested mutations do not write.
// Requires no lifecycle context; unavailable storage falls back to `initial`.
//
// Usage:
//   const theme = persisted('admin-starter:theme', 'system');
//   theme.current = 'dark';   // automatically persisted

import { readStoredValue, writeStoredValue } from '../utils/local-storage';

export function persisted<T>(key: string, initial: T): { current: T } {
	let value = $state<T>(readStoredValue(key, initial));

	return {
		get current(): T {
			return value;
		},
		set current(next: T) {
			value = next;
			writeStoredValue(key, next);
		}
	};
}
