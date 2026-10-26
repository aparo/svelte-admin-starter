import { parse } from 'svelte/compiler';
import { describe, expect, it } from 'vitest';

// ESLint's native-anchor rule does not cover href props on Button/Breadcrumb.Link.
const sources = import.meta.glob<string>(
	[
		'/src/routes/**/*.svelte',
		'/src/lib/features/**/*.svelte',
		'/src/lib/shell/**/*.svelte',
		'/src/lib/components/**/*.svelte'
	],
	{ query: '?raw', import: 'default', eager: true }
);

function unresolvedLinks(source: string): string[] {
	const links: string[] = [];
	function visit(value: unknown): void {
		if (!value || typeof value !== 'object') return;
		const node = value as Record<string, any>;
		if (node.type === 'Attribute' && node.name === 'href') {
			const parts = Array.isArray(node.value) ? node.value : [node.value];
			const first = parts[0];
			const path =
				first?.type === 'Text'
					? first.data
					: first?.expression?.type === 'Literal'
						? first.expression.value
						: undefined;
			if (typeof path === 'string' && /^\/(?!\/)/.test(path)) links.push(path);
		}
		for (const child of Object.values(node)) {
			if (Array.isArray(child)) child.forEach(visit);
			else visit(child);
		}
	}
	visit(parse(source, { modern: true }).fragment);
	return links;
}

describe('base-aware internal navigation', () => {
	it('detects raw paths in native links and component props while allowing resolved/external URLs', () => {
		expect(
			unresolvedLinks('<Button href="/tables"/><Breadcrumb.Link href={\'/components\'} />')
		).toEqual(['/tables', '/components']);
		expect(
			unresolvedLinks(
				'<Button href={resolve(\'/tables\')} /><a href="https://example.com">External</a><a href="//example.com">External</a>'
			)
		).toEqual([]);
	});

	it('uses path resolution for literal app destinations, including shared component href props', () => {
		const violations = Object.entries(sources).flatMap(([file, source]) =>
			unresolvedLinks(source).map((path) => `${file}: ${path}`)
		);
		expect(violations).toEqual([]);
	});
});
