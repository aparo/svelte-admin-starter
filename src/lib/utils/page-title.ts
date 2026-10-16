import { config } from '$lib/config';

/** Keep browser titles aligned with the configured app brand. */
export function pageTitle(title: string | number): string {
	return `${title} · ${config.app.name}`;
}
