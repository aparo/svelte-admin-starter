import { describe, expect, it } from 'vitest';
import { assertSupportedLayouts, toRouteId } from './route-registry';

describe('portable keep-alive route registry', () => {
	it('normalizes route groups and rejects dynamic nested layouts', () => {
		expect(toRouteId('/src/routes/(app)/settings/+layout.svelte', '/+layout.svelte')).toBe(
			'/settings'
		);
		expect(() => assertSupportedLayouts(['/src/routes/(app)/clients/[id]/+layout.svelte'])).toThrow(
			'dynamic nested layout: /clients/[id]'
		);
	});
});

import type { Component } from 'svelte';
import { createRouteRegistry } from './route-registry';

const loader = async () => ({ default: {} as Component });
const file = (id: string) => `/src/routes/(app)${id}/+page.svelte`;

describe('route resolution', () => {
	it.each([
		['/records/[id]', '/records/1', true],
		['/records/[id]', '/records/1/2', false],
		['/[[lang]]/help', '/help', true],
		['/[[lang]]/help', '/en/help', true],
		['/files/[...path]', '/files', true],
		['/files/[...path]', '/files/a/b', true],
		['/files/[...path]', '/files/a/b/', true],
		['/v1.0/a+b', '/v1.0/a+b', true],
		['/v1.0/a+b', '/v1x0/ab', false],
		['/part-[id].json', '/part-1.json', true]
	])('matches %s against %s', (route, path, expected) => {
		const registry = createRouteRegistry({ [file(route)]: loader }, {});
		expect(Boolean(registry.resolveChain(path))).toBe(expected);
	});

	it('prioritizes static routes and required parameters over optional/rest routes', () => {
		const rest = async () => ({ default: {} as Component });
		const optional = async () => ({ default: {} as Component });
		const dynamic = async () => ({ default: {} as Component });
		const registry = createRouteRegistry(
			{
				[file('/docs/[...path]')]: rest,
				[file('/docs/[[id]]')]: optional,
				[file('/docs/[id]')]: dynamic,
				[file('/docs/new')]: loader
			},
			{}
		);
		expect(registry.resolveChain('/docs/new')).toEqual([loader]);
		expect(registry.resolveChain('/docs/1')).toEqual([dynamic]);
	});

	it('collects only the selected page ancestry, including root route groups', () => {
		const group = async () => ({ default: {} as Component });
		const inner = async () => ({ default: {} as Component });
		const registry = createRouteRegistry(
			{ [file('/(product)/records/[id]')]: loader },
			{
				'/src/routes/(app)/(product)/+layout.svelte': group,
				'/src/routes/(app)/(product)/records/+layout.svelte': inner,
				'/src/routes/(app)/(other)/records/+layout.svelte': loader
			}
		);
		expect(registry.resolveChain('/records/1')).toEqual([group, inner, loader]);
	});

	it('diagnoses unsupported matchers and missing pages instead of rendering nothing', async () => {
		expect(() => createRouteRegistry({ [file('/[id=integer]')]: loader }, {})).toThrow(
			'route syntax'
		);
		await expect(createRouteRegistry({}, {}).loadRoute('/missing')).rejects.toThrow('no page');
	});
});
