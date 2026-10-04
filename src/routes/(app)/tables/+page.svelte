<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- table sub-routes are typed Pathname values validated by SvelteKit. */
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';
	import { t } from '$lib/i18n';
	import List from '@lucide/svelte/icons/list';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import Search from '@lucide/svelte/icons/search';
	import ListFilter from '@lucide/svelte/icons/list-filter';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import Database from '@lucide/svelte/icons/database';
	import Loader from '@lucide/svelte/icons/loader';
	import type { Component } from 'svelte';
	import type { Pathname } from '$app/types';

	interface TableExample {
		href: Pathname;
		title: string;
		icon: Component;
	}

	const examples: TableExample[] = [
		{ href: '/tables/basic', title: 'Basic', icon: List },
		{ href: '/tables/pagination', title: 'Pagination', icon: ListTodo },
		{ href: '/tables/search', title: 'Search & Sort', icon: Search },
		{ href: '/tables/filters', title: 'Filters', icon: ListFilter },
		{ href: '/tables/selection', title: 'Selection', icon: ListChecks },
		{ href: '/tables/actions', title: 'Row Actions', icon: Settings2 },
		{ href: '/tables/server', title: 'Server-side', icon: Database },
		{ href: '/tables/states', title: 'States', icon: Loader }
	];
</script>

<svelte:head><title>Data Tables · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title={t('tables.pageTitle')} description={t('tables.pageDescription')} />
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each examples as example (example.href)}
			<a
				href={example.href}
				class="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<Card.Root
					class="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/30"
				>
					<Card.Header>
						<example.icon class="size-5 text-primary" />
						<Card.Title>{example.title}</Card.Title>
						<Card.Description
							>View the {example.title.toLowerCase()} DataTable pattern.</Card.Description
						>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
	</div>
</PageContainer>
