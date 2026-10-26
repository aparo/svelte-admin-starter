<!--
  Renders a resolved route as [outer layout, ...inner layouts, page], nesting
  each layout around the next via its `children` snippet — the same shape
  SvelteKit would build, but assembled by the keep-alive outlet so the page can
  stay mounted. `data` (SvelteKit's load result) is passed to every level;
  levels that don't declare it simply ignore it.
-->
<script lang="ts">
	import { setContext, untrack, type Component } from 'svelte';
	import { TAB_ACTIVITY, type TabActivity } from './tab-activity';
	import { TAB_ROUTE, type TabRoute } from './tab-route';

	interface Props {
		components: Component[];
		data: unknown;
		active: boolean;
		route?: TabRoute;
	}

	let { components, data, active, route }: Props = $props();

	setContext<TabActivity>(TAB_ACTIVITY, {
		get active() {
			return active;
		}
	});
	const initialRoute = untrack(() => route);
	if (initialRoute) {
		setContext<TabRoute>(TAB_ROUTE, {
			get pathname() {
				return (route ?? initialRoute).pathname;
			},
			get url() {
				return (route ?? initialRoute).url;
			},
			get params() {
				return (route ?? initialRoute).params;
			},
			get data() {
				return data;
			},
			get form() {
				return (route ?? initialRoute).form;
			}
		});
	}
</script>

{#snippet chain(comps: Component[])}
	{@const Head = comps[0] as Component<{
		data: unknown;
		params?: Record<string, string>;
		url?: URL;
		form?: unknown;
		children?: import('svelte').Snippet;
	}>}
	{#if Head}
		{#if comps.length > 1}
			<Head {data} params={route?.params} url={route?.url} form={route?.form}>
				{@render chain(comps.slice(1))}
			</Head>
		{:else}
			<Head {data} params={route?.params} url={route?.url} form={route?.form} />
		{/if}
	{/if}
{/snippet}

{@render chain(components)}
