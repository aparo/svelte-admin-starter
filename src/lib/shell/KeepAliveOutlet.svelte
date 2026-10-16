<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import PortableKeepAliveOutlet from '$lib/core/shell/KeepAliveOutlet.svelte';
	import { translate } from '$lib/i18n';
	import { tabs } from './tabs.svelte';
	import { invalidateRoute, loadRoute } from './route-registry';
	import { toAppPathname, toAppUrl } from './paths';

	let { children }: { children: Snippet } = $props();
	const currentUrl = $derived(toAppUrl(page.url));
</script>

<PortableKeepAliveOutlet
	{children}
	{tabs}
	{currentUrl}
	currentData={page.data}
	currentPathname={toAppPathname(page.url.pathname)}
	currentLocation={page.url}
	currentParams={page.params}
	currentForm={page.form}
	routeError={page.error}
	{translate}
	{loadRoute}
	{invalidateRoute}
/>
