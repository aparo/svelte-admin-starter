<script lang="ts">
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';
</script>

<svelte:head><title>Searchable Data Table · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Search & Sort"
		description="Search marked columns and sort from the table headers."
	/>
	<DataTable data={demoProducts} {columns} searchable pageSize={8}>
		{#snippet cell(row, column)}<ProductCell {row} {column} />{/snippet}
	</DataTable>
</PageContainer>
