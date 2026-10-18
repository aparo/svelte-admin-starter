<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import FormField from './FormField.svelte';
	import { Input } from '../ui/input';

	let {
		fields
	}: {
		fields: Omit<ComponentProps<typeof FormField>, 'children' | 'labelAction'>[];
	} = $props();
</script>

{#each fields as field, index (index)}
	<FormField {...field}>
		{#snippet labelAction()}
			<button type="button">Field action</button>
		{/snippet}
		{#snippet children(control)}
			<Input {...control} />
		{/snippet}
	</FormField>
{/each}
