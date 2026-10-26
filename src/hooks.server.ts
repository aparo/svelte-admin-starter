import type { Handle } from '@sveltejs/kit';
import { config } from '$lib/config';

/** Render the configured language before the client restores a saved preference. */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%app.locale%', config.i18n.defaultLocale)
	});
