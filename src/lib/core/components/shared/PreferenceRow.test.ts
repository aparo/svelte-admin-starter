import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Rows from './PreferenceRow.test.svelte';

describe('preference row accessibility', () => {
	it('associates each independent switch with its label and optional description', () => {
		const html = render(Rows).body;
		const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
		expect(new Set(ids).size).toBe(ids.length);
		const switches = [...html.matchAll(/<button\b[^>]*role="switch"[^>]*>/g)].map(([tag]) => tag);
		expect(switches).toHaveLength(3);
		for (const tag of switches) {
			const id = /\sid="([^"]+)"/.exec(tag)![1];
			const label = /aria-labelledby="([^"]+)"/.exec(tag)![1];
			expect(html).toContain(`for="${id}"`);
			expect(ids).toContain(label);
			const description = /aria-describedby="([^"]+)"/.exec(tag)?.[1];
			if (description) expect(ids).toContain(description);
		}
		expect(switches[0]).toContain('aria-checked="true"');
		expect(switches[1]).toContain('disabled');
		expect(switches[2]).not.toContain('aria-describedby');
		expect(switches[2]).toContain('aria-label="Security alerts"');
	});
});
