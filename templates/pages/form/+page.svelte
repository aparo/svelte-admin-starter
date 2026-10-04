<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import * as Card from '$lib/core/components/ui/card';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';

	let name = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<svelte:head><title>Create item · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Create item" description="Add a new item." />
	<form onsubmit={submit} class="max-w-2xl">
		<Card.Root>
			<Card.Content class="space-y-4 pt-6">
				<div class="grid gap-2">
					<Label for="name">Name</Label>
					<Input id="name" bind:value={name} required />
				</div>
				<Button type="submit">Save</Button>
			</Card.Content>
		</Card.Root>
	</form>
</PageContainer>
