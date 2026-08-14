<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import * as Card from '$lib/core/components/ui/card';
	import { Label } from '$lib/core/components/ui/label';
	import { Switch } from '$lib/core/components/ui/switch';

	let updates = $state(true);
	let security = $state(true);
	const sections = ['General', 'Notifications', 'Security', 'Integrations'];
</script>

<svelte:head><title>Settings Template · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Settings Template"
		description="Section navigation with grouped preferences."
	/>
	<div class="grid gap-6 lg:grid-cols-[14rem_1fr]">
		<nav aria-label="Settings sections" class="flex gap-2 overflow-x-auto lg:flex-col">
			{#each sections as section, index (section)}<Button
					variant={index === 0 ? 'secondary' : 'ghost'}
					class="justify-start">{section}</Button
				>{/each}
		</nav>
		<Card.Root class="max-w-3xl"
			><Card.Header
				><Card.Title>General preferences</Card.Title><Card.Description
					>Control workspace-wide defaults.</Card.Description
				></Card.Header
			><Card.Content class="divide-y"
				><div class="flex items-center justify-between gap-4 py-4">
					<div>
						<Label for="updates">Product updates</Label>
						<p class="text-sm text-muted-foreground">Receive important release announcements.</p>
					</div>
					<Switch
						id="updates"
						checked={updates}
						onCheckedChange={(checked) => (updates = checked)}
					/>
				</div>
				<div class="flex items-center justify-between gap-4 py-4">
					<div>
						<Label for="security">Security alerts</Label>
						<p class="text-sm text-muted-foreground">
							Get notified about unusual account activity.
						</p>
					</div>
					<Switch
						id="security"
						checked={security}
						onCheckedChange={(checked) => (security = checked)}
					/>
				</div></Card.Content
			><Card.Footer class="justify-end"><Button>Save changes</Button></Card.Footer></Card.Root
		>
	</div>
</PageContainer>
