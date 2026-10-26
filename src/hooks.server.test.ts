import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { describe, expect, it, vi } from 'vitest';
import { handle } from './hooks.server';

vi.mock('$lib/config', () => ({ config: { i18n: { defaultLocale: 'zh-CN' } } }));

describe('server locale', () => {
	it('renders the configured default before a client preference is available', async () => {
		const event = {} as RequestEvent;
		const resolve = vi.fn(async (_event: RequestEvent, options?: ResolveOptions) => {
			const html = await options?.transformPageChunk?.({
				html: '<html lang="%app.locale%"><body>Page</body></html>',
				done: true
			});
			return new Response(html);
		});
		const response = await handle({ event, resolve });
		expect(await response.text()).toBe('<html lang="zh-CN"><body>Page</body></html>');
	});
});
