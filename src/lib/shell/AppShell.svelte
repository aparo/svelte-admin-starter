<!-- Top-level admin layout: sidebar + inset (header, tab strip, keep-alive content outlet). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/core/components/ui/sidebar';
	import { pageTitle } from '$lib/utils/page-title';
	import AppSidebar from './AppSidebar.svelte';
	import AppHeader from './AppHeader.svelte';
	import TabBar from './TabBar.svelte';
	import KeepAliveOutlet from './KeepAliveOutlet.svelte';
	import { openLandedRoute } from '$lib/core/shell/tabs.svelte';
	import type { TabRoute } from '$lib/core/shell/tab-route';
	import { tabs } from './tabs.svelte';
	import { resolveAppUrl, toAppPathname, toAppUrl } from './paths';

	// `children` is only used to render +error.svelte on a load error; the outlet
	// handles the normal (keep-alive) rendering. See KeepAliveOutlet.
	let { children }: { children: Snippet } = $props();

	// Single wiring point: every navigation (sidebar, command menu, link, deep
	// link, initial load) opens or focuses a tab for the landed route.
	async function openCurrentRoute(): Promise<void> {
		const pathname = toAppPathname(page.url.pathname);
		const url = toAppUrl(page.url);
		const route: TabRoute | null = page.error
			? null
			: {
					pathname,
					url: new URL(page.url),
					params: { ...page.params },
					data: page.data,
					form: page.form
				};
		await openLandedRoute(
			tabs,
			pathname,
			page.data,
			url,
			async (fallback) => {
				// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolves stored path and query through $app/paths.
				await goto(resolveAppUrl(fallback), { replaceState: true });
			},
			route
		);
	}

	afterNavigate(() => {
		void openCurrentRoute();
	});
</script>

<svelte:head>
	{#if !page.error && tabs.activeTab}
		<title>{pageTitle(tabs.activeTab.title)}</title>
	{/if}
</svelte:head>

<!-- Fixed viewport height + internal scroll, so each tab keeps its own scroll position. -->
<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="h-svh overflow-hidden">
		<AppHeader />
		<TabBar />
		<KeepAliveOutlet {children} />
	</Sidebar.Inset>
</Sidebar.Provider>
