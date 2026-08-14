<script lang="ts">
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';
</script>

<svelte:head><title>Paginated Data Table · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Pagination" description="Client-side pagination with five rows per page." />
	<DataTable data={demoProducts} {columns} pageSize={5}>
		{#snippet cell(row, column)}<ProductCell {row} {column} />{/snippet}
	</DataTable>
</PageContainer>
