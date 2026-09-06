import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, it } from 'vitest';
import type { Component } from 'svelte';
import { createRouteRegistry } from '../core/shell/route-registry';

const kitRoot = dirname(createRequire(import.meta.url).resolve('@sveltejs/kit/package.json'));
// Native internals are a test oracle outside the portable export boundary.
const { parse_route_id } = await import(pathToFileURL(join(kitRoot, 'src/utils/routing.js')).href);
it.each([
	['/[[lang]]/help', ['/help', '/en/help', '/en/help/', '/en/extra/help']],
	['/files/[...path]', ['/files', '/files/', '/files/a/b', '/file']],
	['/v1.0/a+b', ['/v1.0/a+b', '/v1x0/ab', '/v1.0/a+b/']],
	['/records/[id]', ['/records/1', '/records/1/2', '/records']],
	['/part-[id].json', ['/part-1.json', '/part-1xjson', '/part-.json']]
])('matches SvelteKit for %s', (route, paths) => {
	const registry = createRouteRegistry(
		{
			[`/src/routes/(app)${route}/+page.svelte`]: async () => ({ default: {} as Component })
		},
		{}
	);
	for (const path of paths) {
		expect(Boolean(registry.resolveChain(path)), path).toBe(
			parse_route_id(route).pattern.test(path)
		);
	}
});
