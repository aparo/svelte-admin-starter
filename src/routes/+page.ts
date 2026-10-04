// The index route is just an entry point — send visitors to the configured home page.
import { redirect } from '@sveltejs/kit';
import { config } from '$lib/config';

export function load(): never {
	throw redirect(307, config.app.homePath);
}
