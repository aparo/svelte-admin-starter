/** Read JSON state synchronously; missing, invalid or unavailable storage uses the fallback. */
export function readStoredValue<T>(key: string, initial: T): T {
	try {
		if (typeof localStorage === 'undefined') return initial;
		const raw = localStorage.getItem(key);
		return raw === null ? initial : (JSON.parse(raw) as T);
	} catch {
		return initial;
	}
}

/** Write JSON state on a best-effort basis, including serialization and quota errors. */
export function writeStoredValue<T>(key: string, value: T): void {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(key, JSON.stringify(value));
		}
	} catch {
		// State remains usable even when persistence is unavailable.
	}
}
