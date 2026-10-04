<script lang="ts">
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';
</script>

<svelte:head><title>Basic Data Table · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Basic Data Table"
		description="Typed columns and formatted cells without optional controls."
	/>
	<DataTable data={demoProducts.slice(0, 6)} columns={columns.slice(0, 4)} pageSize={6}>
		{#snippet cell(row, column)}<ProductCell {row} {column} />{/snippet}
	</DataTable>
</PageContainer>
