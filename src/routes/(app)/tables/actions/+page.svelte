<script lang="ts">
	import Eye from '@lucide/svelte/icons/eye';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';
</script>

<svelte:head><title>Data Table Actions · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Row Actions"
		description="A sticky trailing column for common record operations."
	/>
	<DataTable data={demoProducts.slice(0, 8)} {columns} pageSize={8}>
		{#snippet cell(row, column)}<ProductCell {row} {column} />{/snippet}
		{#snippet actions(row)}<div class="flex justify-end gap-1">
				<Button
					variant="ghost"
					size="icon"
					aria-label={`View ${row.name}`}
					onclick={() => toast.info(`View: ${row.name}`)}><Eye /></Button
				><Button
					variant="ghost"
					size="icon"
					aria-label={`Edit ${row.name}`}
					onclick={() => toast.info(`Edit: ${row.name}`)}><Pencil /></Button
				><Button
					variant="ghost"
					size="icon"
					aria-label={`Delete ${row.name}`}
					onclick={() => toast.info(`Delete: ${row.name}`)}><Trash2 /></Button
				>
			</div>{/snippet}
	</DataTable>
</PageContainer>
