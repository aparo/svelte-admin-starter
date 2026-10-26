<!--
  Keep-alive content outlet. Renders every open tab's page at once, showing only
  the active one (others are `hidden`, which preserves their DOM, component state
  AND scroll position). A keyed {#each} over tabs never remounts an existing
  entry, so switching tabs is pure show/hide — nothing is destroyed until a tab
  is closed. Each tab is its own scroll container, so scroll position is per-tab.

	Data selection is keyed off `page.url.pathname`, NOT `tabs.active`: SvelteKit
  commits page.url + page.data together, but `tabs.active` is set later (in
  afterNavigate). Keying off the lagging active state would briefly feed the
  still-active tab the *next* route's data and crash pages that read a
  route-specific shape.

  On a load error, page.error is set and SvelteKit makes `children` the error
	subtree; we render that instead so +error.svelte still works.

	The scroll containers reserve their vertical scrollbar gutter. Scrolling and
	short pages therefore have the same content width and do not shift on switch.
-->
<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { cn } from '../utils';
	import { Button } from '../components/ui/button';
	import Spinner from '../components/shared/Spinner.svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import type { TabsState } from './tabs.svelte';
	import LayoutChain from './LayoutChain.svelte';
	import { TabRouteCache, type TabRoute } from './tab-route';

	interface Props {
		children: Snippet;
		tabs: TabsState;
		currentUrl: string;
		currentData: unknown;
		currentPathname?: string;
		currentLocation?: URL;
		currentParams?: Record<string, string>;
		currentForm?: unknown;
		routeError: unknown;
		translate: (key: string) => string;
		loadRoute: (pathname: string, revision?: number) => Promise<import('svelte').Component[]>;
		invalidateRoute: (pathname: string) => void;
	}

	let {
		children,
		tabs,
		currentUrl,
		currentData,
		currentPathname,
		currentLocation,
		currentParams,
		currentForm,
		routeError,
		translate,
		loadRoute,
		invalidateRoute
	}: Props = $props();
	let routeLoadRevision = $state(0);

	function retryRoute(pathname: string) {
		invalidateRoute(pathname);
		routeLoadRevision += 1;
	}

	const routes = new TabRouteCache();
	const currentRoute = $derived.by((): TabRoute | undefined => {
		if (routeError || currentData === undefined) return undefined;
		return {
			pathname: currentPathname ?? currentUrl.split('?')[0],
			url: new URL(
				currentLocation ?? currentUrl,
				typeof location === 'undefined' ? 'http://localhost/' : location.href
			),
			params: { ...currentParams },
			data: currentData,
			form: currentForm
		};
	});
	// Route data can land before afterNavigate selects its tab. Cache the landed
	// snapshot first, then attach it only to the matching active tab.
	$effect(() => {
		const items = tabs.items.map(({ id, url, route }) => ({ id, url, route }));
		const active = tabs.active;
		const url = currentUrl;
		const route = currentRoute;
		untrack(() => routes.sync(items, active, url, route));
	});
</script>

<div class="relative min-h-0 flex-1">
	{#each tabs.items as tab (tab.id)}
		{@const active = !routeError && tab.id === tabs.active}
		{@const route = routes.get(tab.id)}
		<div
			class={cn('absolute inset-0 [scrollbar-gutter:stable] overflow-auto', !active && 'hidden')}
		>
			{#key tab.revision}
				{#if route === undefined}
					<div class="flex h-full items-center justify-center">
						<Spinner class="text-primary size-6" />
					</div>
				{:else}
					{#await loadRoute(tab.href, routeLoadRevision)}
						<div class="flex h-full items-center justify-center">
							<Spinner class="text-primary size-6" />
						</div>
					{:then components}
						<LayoutChain {components} {active} {route} data={route.data} />
					{:catch}
						<div class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
							<p class="text-muted-foreground text-sm">
								{translate('error.unexpectedDescriptionApp')}
							</p>
							<Button variant="outline" onclick={() => retryRoute(tab.href)}>
								<RotateCcw class="size-4" aria-hidden="true" />
								{translate('common.retry')}
							</Button>
						</div>
					{/await}
				{/if}
			{/key}
		</div>
	{/each}
	{#if routeError}
		<div class="absolute inset-0 [scrollbar-gutter:stable] overflow-auto">
			{@render children()}
		</div>
	{/if}
</div>
