import { base, resolve } from '$app/paths';
import type { Pathname } from '$app/types';

/** Keep portable tab and navigation paths relative to the application's base. */
export function toAppPathname(pathname: string, basePath = base): string {
	if (basePath && pathname === basePath) return '/';
	return basePath && pathname.startsWith(`${basePath}/`)
		? pathname.slice(basePath.length)
		: pathname;
}

export function toAppUrl(url: Pick<URL, 'pathname' | 'search'>, basePath = base): string {
	return `${toAppPathname(url.pathname, basePath)}${url.search}`;
}

/** Resolve a stored app-relative tab URL, preserving its query and fragment. */
export function resolveAppUrl(url: string): string {
	const suffixAt = url.search(/[?#]/);
	const pathname = (suffixAt === -1 ? url : url.slice(0, suffixAt)) as Pathname;
	// Kit's argument tuples distribute across route unions; this is a concrete
	// pathname, so it needs the single-argument branch rather than route params.
	return `${resolve(...([pathname] as Parameters<typeof resolve>))}${suffixAt === -1 ? '' : url.slice(suffixAt)}`;
}
