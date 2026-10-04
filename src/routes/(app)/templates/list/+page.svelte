<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import Download from '@lucide/svelte/icons/download';
	import {
		DataTable,
		PageContainer,
		PageHeader,
		StatusBadge,
		type Column
	} from '$lib/components/shared';
	import { Button } from '$lib/core/components/ui/button';

	type Project = { id: number; name: string; owner: string; status: 'Active' | 'Draft' };

	const projects: Project[] = [
		{ id: 1, name: 'Website refresh', owner: 'Olivia Martin', status: 'Active' },
		{ id: 2, name: 'Mobile onboarding', owner: 'Liam Johnson', status: 'Draft' },
		{ id: 3, name: 'Billing migration', owner: 'Emma Williams', status: 'Active' }
	];
	const columns: Column<Project>[] = [
		{ key: 'name', header: 'Project', searchable: true, sortable: true },
		{ key: 'owner', header: 'Owner', searchable: true },
		{ key: 'status', header: 'Status', sortable: true }
	];
</script>

<svelte:head><title>List Template · Admin Starter</title></svelte:head>

<PageContainer>
	<PageHeader
		title="List Template"
		description="A collection page with search, sorting and actions."
	>
		{#snippet actions()}
			<Button variant="outline"><Download class="size-4" />Export</Button>
			<Button><Plus class="size-4" />New project</Button>
		{/snippet}
	</PageHeader>
	<DataTable data={projects} {columns} searchable>
		{#snippet cell(row, column)}
			{#if column.key === 'name'}
				<span class="font-medium">{row.name}</span>
			{:else if column.key === 'owner'}
				<span class="text-muted-foreground">{row.owner}</span>
			{:else if column.key === 'status'}
				<StatusBadge tone={row.status === 'Active' ? 'success' : 'neutral'}
					>{row.status}</StatusBadge
				>
			{/if}
		{/snippet}
	</DataTable>
</PageContainer>
