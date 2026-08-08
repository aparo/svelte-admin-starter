<!--
  Tables — a clean reference example for the shared <DataTable>.

  Renders the mock product catalog with sortable columns, client-side search,
  pagination and custom cell rendering (currency, number, status badge). An
  intro card documents the props so this page doubles as living documentation.
-->
<script lang="ts">
	import Table from '@lucide/svelte/icons/table';
	import Info from '@lucide/svelte/icons/info';

	import {
		PageContainer,
		PageHeader,
		DataTable,
		StatusBadge,
		type Column,
		type BadgeTone
	} from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';

	import type { DemoProduct } from '$lib/data/products';
	import { formatCurrency, formatNumber } from '$lib/core/utils/formatters';
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';

	// Products are loaded on the server via `+page.server.ts` (the `db` data seam),
	// not imported directly — this is the pattern to follow for real data.
	let { data }: { data: PageData } = $props();

	type Status = DemoProduct['status'];

	// Map product stock status to a shared StatusBadge tone (see StatusBadge).
	function statusTone(status: Status): BadgeTone {
		return status === 'in_stock' ? 'success' : status === 'low' ? 'warning' : 'danger';
	}
	function statusLabel(status: Status): string {
		switch (status) {
			case 'in_stock':
				return t('tables.statusInStock');
			case 'low':
				return t('tables.statusLow');
			case 'out':
				return t('tables.statusOut');
		}
	}

	const columns: Column<DemoProduct>[] = [
		{ key: 'name', header: t('tables.colProduct'), sortable: true, searchable: true },
		{ key: 'category', header: t('tables.colCategory'), sortable: true, searchable: true },
		{ key: 'price', header: t('tables.colPrice'), sortable: true, align: 'right' },
		{ key: 'stock', header: t('tables.colStock'), sortable: true, align: 'right' },
		{ key: 'status', header: t('tables.colStatus') }
	];

	// Documented props for the intro card.
	const propDocs = [
		{ name: 'data / columns', desc: 'Rows and a typed Column<T>[] schema.' },
		{ name: 'searchable', desc: 'Client-side search across searchable columns.' },
		{ name: 'selectable', desc: 'Adds a checkbox column with bindable selection.' },
		{ name: 'pageSize', desc: 'Rows per page; pagination is automatic.' },
		{ name: 'cell', desc: 'Snippet for custom cell rendering per column.' },
		{ name: 'actions / toolbar', desc: 'Snippets for per-row actions and a header toolbar.' }
	];
</script>

<svelte:head>
	<title>Tables · Admin Starter</title>
</svelte:head>

<PageContainer>
	<PageHeader title={t('tables.pageTitle')} description={t('tables.pageDescription')} />

	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<Info class="size-4 text-muted-foreground" />
				{t('tables.aboutTitle')}
			</Card.Title>
			<Card.Description>
				<code class="rounded bg-muted px-1 py-0.5 text-xs">DataTable</code> is a generic,
				client-side table. Pass <code class="rounded bg-muted px-1 py-0.5 text-xs">data</code> and a
				<code class="rounded bg-muted px-1 py-0.5 text-xs">columns</code> schema; opt into search, sorting,
				selection and pagination with simple props.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<dl class="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
				{#each propDocs as prop (prop.name)}
					<div class="flex flex-col gap-0.5">
						<dt>
							<code class="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
								{prop.name}
							</code>
						</dt>
						<dd class="text-sm text-muted-foreground">{prop.desc}</dd>
					</div>
				{/each}
			</dl>
		</Card.Content>
	</Card.Root>

	<DataTable
		data={data.products}
		{columns}
		searchable
		pageSize={8}
		emptyTitle={t('tables.emptyTitle')}
		emptyDescription={t('tables.emptyDescription')}
	>
		{#snippet toolbar()}
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<Table class="size-4" />
				<span>{data.products.length} products · sort, search and paginate below</span>
			</div>
		{/snippet}

		{#snippet cell(row, column)}
			{#if column.key === 'name'}
				<span class="font-medium text-foreground">{row.name}</span>
			{:else if column.key === 'category'}
				<span class="text-muted-foreground">{row.category}</span>
			{:else if column.key === 'price'}
				<span class="tabular-nums">{formatCurrency(row.price)}</span>
			{:else if column.key === 'stock'}
				<span class="tabular-nums">{formatNumber(row.stock)}</span>
			{:else if column.key === 'status'}
				<StatusBadge tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusBadge>
			{/if}
		{/snippet}
	</DataTable>
</PageContainer>
