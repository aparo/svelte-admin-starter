<script lang="ts">
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';

	let selected = $state<(string | number)[]>([]);
</script>

<svelte:head><title>Selectable Data Table · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Selection"
		description="Checkbox selection with application-owned bulk actions."
	/>
	<DataTable data={demoProducts} {columns} selectable bind:selected pageSize={8}>
		{#snippet toolbar()}<Button
				variant="destructive"
				size="sm"
				disabled={!selected.length}
				onclick={() => toast.info(`${selected.length} selected`)}><Trash2 />Delete selected</Button
			>{/snippet}
		{#snippet cell(row, column)}<ProductCell {row} {column} />{/snippet}
	</DataTable>
</PageContainer>
