// Auth domain types for the mock authentication layer.

export interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'editor' | 'viewer';
	avatarUrl?: string;
}

/** Validate untrusted API responses and cached sessions before using them. */
export function isUser(value: unknown): value is User {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const user = value as Record<string, unknown>;
	return (
		typeof user.id === 'string' &&
		user.id.trim().length > 0 &&
		typeof user.name === 'string' &&
		user.name.trim().length > 0 &&
		typeof user.email === 'string' &&
		user.email.trim().length > 0 &&
		(user.role === 'admin' || user.role === 'editor' || user.role === 'viewer') &&
		(user.avatarUrl === undefined || typeof user.avatarUrl === 'string')
	);
}
