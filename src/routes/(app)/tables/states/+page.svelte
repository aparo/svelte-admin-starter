<script lang="ts">
	import { DataTable, PageContainer, PageHeader } from '$lib/components/shared';
	import { demoProducts } from '$lib/data/products';
	import ProductCell from '../ProductCell.svelte';
	import { columns } from '../demo';
</script>

<svelte:head><title>Data Table States · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="Loading & Empty States"
		description="Common feedback states presented as separate table examples."
	/>
	<div class="grid gap-6 xl:grid-cols-2">
		<div class="space-y-3">
			<h2 class="font-semibold">Loading</h2>
			<DataTable data={[]} {columns} loading pageSize={5} />
		</div>
		<div class="space-y-3">
			<h2 class="font-semibold">Empty</h2>
			<DataTable
				data={[]}
				{columns}
				emptyTitle="No products yet"
				emptyDescription="Add a product to start building your catalog."
			/>
		</div>
	</div>
	<div class="space-y-3">
		<h2 class="font-semibold">No search results</h2>
		<DataTable data={demoProducts} {columns} searchable search="not-a-real-product"
			><!-- Custom cells demonstrate that empty search still owns the state. -->{#snippet cell(
				row,
				column
			)}<ProductCell {row} {column} />{/snippet}</DataTable
		>
	</div>
</PageContainer>
