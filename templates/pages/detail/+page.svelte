<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';

	const item = { name: 'Item name', description: 'Item description' };
</script>

<svelte:head><title>{item.name} · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title={item.name} description={item.description} />
	<Card.Root>
		<Card.Header><Card.Title>Details</Card.Title></Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">Replace with record fields.</p>
		</Card.Content>
	</Card.Root>
</PageContainer>
