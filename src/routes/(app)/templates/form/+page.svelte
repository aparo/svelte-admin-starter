<script lang="ts">
	import { PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import * as Card from '$lib/core/components/ui/card';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';
	import { Textarea } from '$lib/core/components/ui/textarea';

	let name = $state('');
	let description = $state('');
</script>

<svelte:head><title>Form Template · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Form Template" description="A focused create or edit page." />
	<form class="grid max-w-3xl gap-6" onsubmit={(event) => event.preventDefault()}>
		<Card.Root>
			<Card.Header
				><Card.Title>Basic information</Card.Title><Card.Description
					>Describe the record being created.</Card.Description
				></Card.Header
			>
			<Card.Content class="grid gap-5">
				<div class="grid gap-2">
					<Label for="template-name">Name</Label><Input
						id="template-name"
						bind:value={name}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="template-description">Description</Label><Textarea
						id="template-description"
						bind:value={description}
						rows={4}
					/>
				</div>
			</Card.Content>
			<Card.Footer class="justify-end gap-2"
				><Button variant="outline">Cancel</Button><Button type="submit">Save</Button></Card.Footer
			>
		</Card.Root>
	</form>
</PageContainer>
