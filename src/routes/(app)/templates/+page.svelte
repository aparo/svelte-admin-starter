<script lang="ts">
	import { resolve } from '$app/paths';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import List from '@lucide/svelte/icons/list';
	import FormInput from '@lucide/svelte/icons/form-input';
	import FileText from '@lucide/svelte/icons/file-text';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';

	const templates = [
		{
			href: '/templates/list',
			title: 'List',
			description: 'Search, filters and tabular data.',
			icon: List
		},
		{
			href: '/templates/form',
			title: 'Form',
			description: 'Grouped fields and actions.',
			icon: FormInput
		},
		{
			href: '/templates/detail',
			title: 'Detail',
			description: 'Record summary and metadata.',
			icon: FileText
		},
		{
			href: '/templates/dashboard',
			title: 'Dashboard',
			description: 'Metrics and overview panels.',
			icon: LayoutDashboard
		},
		{
			href: '/templates/settings',
			title: 'Settings',
			description: 'Section navigation and preferences.',
			icon: Settings2
		}
	] as const;
</script>

<svelte:head><title>Page Templates · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Page Templates"
		description="Reusable layout starting points for application pages."
	/>
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each templates as template (template.href)}
			<a
				href={resolve(template.href)}
				class="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<Card.Root
					class="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/30"
				>
					<Card.Header>
						<div
							class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
						>
							<template.icon class="size-5" aria-hidden="true" />
						</div>
						<Card.Title>{template.title}</Card.Title>
						<Card.Description>{template.description}</Card.Description>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
	</div>
</PageContainer>
