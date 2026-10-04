import type { Component } from 'svelte';

type ModuleLoader = () => Promise<unknown>;
type Loader = () => Promise<{ default: Component }>;
type Modules = Record<string, ModuleLoader>;

function pickAppGroup(modules: Modules): Record<string, Loader> {
	return Object.fromEntries(
		Object.entries(modules).filter(([file]) => file.includes('/(app)/'))
	) as Record<string, Loader>;
}

export function toRouteId(file: string, suffix: string): string {
	const id = file
		.slice('/src/routes'.length, -suffix.length)
		.replace(/\/\([^/]+\)/g, '')
		.replace(/\/$/, '');
	return id === '' ? '/' : id;
}

export function assertSupportedLayouts(files: string[]): void {
	const dynamic = files
		.map((file) => toRouteId(file, '/+layout.svelte'))
		.find((id) => id !== '/' && id.includes('['));
	if (dynamic)
		throw new Error(`Admin keep-alive does not support dynamic nested layout: ${dynamic}`);
}

/** Escape static segments before interpreting the supported SvelteKit parameters. */
function routePattern(id: string): RegExp {
	if (id === '/') return /^\/$/;
	const segments = id
		.split('/')
		.slice(1)
		.map((segment) => {
			if (/^\[\[\w+\]\]$/.test(segment)) return '(?:/([^/]+))?';
			if (/^\[\.\.\.\w+\]$/.test(segment)) return '(?:/(.*))?';
			let pattern = '';
			let offset = 0;
			for (const match of segment.matchAll(/\[(\w+)\]/g)) {
				pattern += escape(segment.slice(offset, match.index)) + '([^/]+?)';
				offset = match.index + match[0].length;
			}
			pattern += escape(segment.slice(offset));
			return '/' + pattern;
		});
	return new RegExp(`^${segments.join('')}/?$`);
}

function escape(value: string): string {
	if (/[[\]]/.test(value)) {
		throw new Error(`Admin keep-alive does not support this route syntax: ${value}`);
	}
	return value.replace(/[.*+?^${}()|\\]/g, '\\$&');
}

export function createRouteRegistry(pageModules: Modules, layoutModules: Modules) {
	const pages = pickAppGroup(pageModules);
	const layouts = pickAppGroup(layoutModules);
	assertSupportedLayouts(Object.keys(layouts));

	const pageRoutes = Object.entries(pages).map(([file, load]) => {
		const id = toRouteId(file, '/+page.svelte');
		return { file, id, load, matcher: routePattern(id) };
	});
	// Compare from the root: static > required parameter > optional > rest.
	// A deeper static suffix outranks a shorter optional/rest route.
	pageRoutes.sort((left, right) => {
		const a = left.id.split('/').slice(1);
		const b = right.id.split('/').slice(1);
		const rank = (segment = '') =>
			segment.includes('[...') ? 0 : segment.startsWith('[[') ? 1 : segment.includes('[') ? 2 : 3;
		for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
			const difference = rank(b[index]) - rank(a[index]);
			if (difference) return difference;
			const literalLength = (segment = '') => segment.replace(/\[[^\]]*\]/g, '').length;
			const literalDifference = literalLength(b[index]) - literalLength(a[index]);
			if (literalDifference) return literalDifference;
			if (a[index] !== b[index] && rank(a[index]) === 3 && rank(b[index]) === 3) {
				return (b[index]?.length ?? 0) - (a[index]?.length ?? 0);
			}
		}
		return left.id.localeCompare(right.id);
	});

	const layoutRoutes = Object.entries(layouts)
		.map(([file, load]) => ({ directory: file.slice(0, -'/+layout.svelte'.length), load }))
		.filter((layout) => layout.directory !== '/src/routes/(app)');

	function resolveChain(pathname: string): Loader[] | null {
		const page = pageRoutes.find((route) => route.matcher.test(pathname));
		if (!page) return null;
		// Filesystem ancestry preserves route groups; URL prefixes mix sibling groups.
		const matchingLayouts = layoutRoutes
			.filter((layout) => page.file.startsWith(`${layout.directory}/`))
			.sort((left, right) => left.directory.length - right.directory.length);
		return [...matchingLayouts.map((layout) => layout.load), page.load];
	}

	const cache = new Map<string, Promise<Component[]>>();
	function loadRoute(pathname: string, _revision = 0): Promise<Component[]> {
		let promise = cache.get(pathname);
		if (!promise) {
			const chain = resolveChain(pathname);
			const loading = chain
				? Promise.all(chain.map((load) => load().then((module) => module.default)))
				: Promise.reject(new Error(`Admin keep-alive found no page for: ${pathname}`));
			promise = loading.catch((error: unknown) => {
				if (cache.get(pathname) === promise) cache.delete(pathname);
				throw error;
			});
			cache.set(pathname, promise);
		}
		return promise;
	}

	return {
		resolveChain,
		loadRoute,
		invalidateRoute(pathname: string) {
			cache.delete(pathname);
		}
	};
}
