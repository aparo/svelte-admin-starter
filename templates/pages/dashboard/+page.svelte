<script lang="ts">
	import { PageContainer, PageHeader, StatCard } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';

	const stats = [
		{ title: 'Total', value: 0 },
		{ title: 'Active', value: 0 }
	];
</script>

<svelte:head><title>Overview · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Overview" description="A summary of your data." />
	<div class="grid gap-4 sm:grid-cols-2">
		{#each stats as stat (stat.title)}
			<StatCard title={stat.title} value={stat.value} />
		{/each}
	</div>
	<Card.Root>
		<Card.Header><Card.Title>Recent activity</Card.Title></Card.Header>
		<Card.Content><p class="text-sm text-muted-foreground">Add an overview here.</p></Card.Content>
	</Card.Root>
</PageContainer>
