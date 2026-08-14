<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import * as Card from '$lib/core/components/ui/card';
	import { Label } from '$lib/core/components/ui/label';
	import { Switch } from '$lib/core/components/ui/switch';

	let enabled = $state(true);
	const sections = ['General', 'Notifications', 'Security'];
</script>

<svelte:head><title>Settings · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Settings" description="Manage application preferences." />
	<div class="grid gap-6 lg:grid-cols-[14rem_1fr]">
		<nav aria-label="Settings sections" class="flex gap-2 overflow-x-auto lg:flex-col">
			{#each sections as section, index (section)}
				<Button variant={index === 0 ? 'secondary' : 'ghost'} class="justify-start"
					>{section}</Button
				>
			{/each}
		</nav>
		<Card.Root>
			<Card.Header><Card.Title>General</Card.Title></Card.Header>
			<Card.Content class="flex items-center justify-between gap-4">
				<div>
					<Label for="enabled">Preference</Label>
					<p class="text-sm text-muted-foreground">Describe what this setting controls.</p>
				</div>
				<Switch id="enabled" checked={enabled} onCheckedChange={(checked) => (enabled = checked)} />
			</Card.Content>
		</Card.Root>
	</div>
</PageContainer>
