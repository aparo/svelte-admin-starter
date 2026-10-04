<script lang="ts">
	import { DataTable, PageContainer, PageHeader, type Column } from '$lib/components/shared';

	type Item = { id: number; name: string };

	const items: Item[] = [];
	const columns: Column<Item>[] = [{ key: 'name', header: 'Name', searchable: true }];
</script>

<svelte:head><title>Items · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader title="Items" description="Manage your items." />
	<DataTable data={items} {columns} searchable />
</PageContainer>
