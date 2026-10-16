// The index route is just an entry point — send visitors to the configured home page.
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { config } from '$lib/config';

export function load(): never {
	throw redirect(307, resolve(config.app.homePath));
}
