<!--
  Billing / Subscription — current plan, metered usage, payment method, and an
  invoice history table. All data is MOCK and lives in local state; the action
  buttons (change plan, cancel, update card, download invoice) surface a toast.
-->
<script lang="ts">
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Download from '@lucide/svelte/icons/download';
	import Check from '@lucide/svelte/icons/check';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	import {
		PageContainer,
		PageHeader,
		DataTable,
		StatusBadge,
		type Column,
		type BadgeTone
	} from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';
	import { Button } from '$lib/core/components/ui/button';
	import { Progress } from '$lib/core/components/ui/progress';

	import { formatCurrency, formatDate } from '$lib/core/utils/formatters';
	import { cn } from '$lib/core/utils';
	import { toast } from 'svelte-sonner';
	import { t } from '$lib/i18n';

	// --- Current plan (mock) ----------------------------------------------
	const plan = {
		name: 'Pro',
		price: 29,
		interval: 'mo',
		renewsAt: '2026-07-09',
		blurb: 'Everything your team needs to ship, with priority support and advanced analytics.'
	};

	const planHighlights = [
		t('billing.planUnlimitedProjects'),
		t('billing.planAdvancedAnalytics'),
		t('billing.planPrioritySupport'),
		t('billing.planCustomRoles')
	];

	// --- Metered usage (mock) ---------------------------------------------
	interface UsageMetric {
		id: string;
		label: string;
		used: number;
		limit: number;
		/** Optional unit suffix, e.g. "GB". */
		unit?: string;
		/** Format large counts compactly (e.g. API calls). */
		compact?: boolean;
	}

	const usage: UsageMetric[] = [
		{ id: 'seats', label: t('billing.usageSeats'), used: 7, limit: 10 },
		{ id: 'api', label: t('billing.usageApiCalls'), used: 82_000, limit: 100_000, compact: true },
		{ id: 'storage', label: t('billing.usageStorage'), used: 14, limit: 20, unit: 'GB' }
	];

	function usagePercent(metric: UsageMetric): number {
		return Math.min(100, Math.round((metric.used / metric.limit) * 100));
	}

	function formatUsage(value: number, metric: UsageMetric): string {
		const formatted = metric.compact
			? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
					value
				)
			: new Intl.NumberFormat('en-US').format(value);
		return metric.unit ? `${formatted} ${metric.unit}` : formatted;
	}

	// --- Payment method (mock) --------------------------------------------
	const paymentMethod = {
		brand: 'Visa',
		last4: '4242',
		expiry: '08/27',
		holder: 'Alex Morgan'
	};

	// --- Invoices (mock) --------------------------------------------------
	interface DemoInvoice {
		id: string;
		number: string;
		date: string;
		amount: number;
		status: 'paid' | 'pending' | 'failed';
	}

	const invoices: DemoInvoice[] = [
		{ id: 'inv_01', number: 'INV-2043', date: '2026-06-01', amount: 29.0, status: 'paid' },
		{ id: 'inv_02', number: 'INV-2042', date: '2026-05-01', amount: 29.0, status: 'paid' },
		{ id: 'inv_03', number: 'INV-2041', date: '2026-04-01', amount: 29.0, status: 'paid' },
		{ id: 'inv_04', number: 'INV-2040', date: '2026-03-01', amount: 49.0, status: 'pending' },
		{ id: 'inv_05', number: 'INV-2039', date: '2026-02-01', amount: 29.0, status: 'paid' },
		{ id: 'inv_06', number: 'INV-2038', date: '2026-01-01', amount: 29.0, status: 'failed' },
		{ id: 'inv_07', number: 'INV-2037', date: '2025-12-01', amount: 29.0, status: 'paid' },
		{ id: 'inv_08', number: 'INV-2036', date: '2025-11-01', amount: 29.0, status: 'paid' }
	];

	type InvoiceStatus = DemoInvoice['status'];

	function statusTone(status: InvoiceStatus): BadgeTone {
		return status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'danger';
	}
	function statusLabel(status: InvoiceStatus): string {
		switch (status) {
			case 'paid':
				return t('billing.statusPaid');
			case 'pending':
				return t('billing.statusPending');
			case 'failed':
				return t('billing.statusFailed');
		}
	}

	const columns: Column<DemoInvoice>[] = [
		{ key: 'number', header: t('billing.colNumber'), sortable: true, searchable: true },
		{ key: 'date', header: t('billing.colDate'), sortable: true },
		{ key: 'amount', header: t('billing.colAmount'), sortable: true, align: 'right' },
		{ key: 'status', header: t('billing.colStatus'), sortable: true }
	];

	// --- Mock actions ------------------------------------------------------
	function changePlan(): void {
		toast.info(t('billing.toastChangePlan'), {
			description: t('billing.toastChangePlanDesc')
		});
	}
	function cancelSubscription(): void {
		toast.warning(t('billing.toastCancelSub'));
	}
	function updatePaymentMethod(): void {
		toast.info(t('billing.toastUpdatePayment'));
	}
	function downloadInvoice(invoice: DemoInvoice): void {
		toast.success(t('billing.toastDownloading'), {
			description: invoice.number
		});
	}
</script>

<svelte:head>
	<title>Billing · Admin Starter</title>
</svelte:head>

<PageContainer>
	<PageHeader title={t('billing.pageTitle')} description={t('billing.pageDescription')} />

	<!-- Plan + payment method row -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Current plan -->
		<Card.Root class="lg:col-span-2">
			<Card.Header>
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div class="space-y-1">
						<Card.Title class="flex items-center gap-2">
							{plan.name} plan
							<StatusBadge tone="brand">{t('billing.currentBadge')}</StatusBadge>
						</Card.Title>
						<Card.Description>{plan.blurb}</Card.Description>
					</div>
					<div class="shrink-0 text-right">
						<p class="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
							{formatCurrency(plan.price)}<span class="text-base font-normal text-muted-foreground"
								>/{plan.interval}</span
							>
						</p>
						<p class="text-xs text-muted-foreground">
							{t('billing.planRenews', { date: formatDate(plan.renewsAt) })}
						</p>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="rounded-lg border border-border bg-muted/40 p-4">
					<p class="flex items-center gap-1.5 text-sm font-medium text-foreground">
						<Sparkles class="size-4 text-primary" aria-hidden="true" />
						{t('billing.planFeatures')}
					</p>
					<ul class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
						{#each planHighlights as feature (feature)}
							<li class="flex items-center gap-2 text-sm text-muted-foreground">
								<span
									class="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
								>
									<Check class="size-3" aria-hidden="true" />
								</span>
								{feature}
							</li>
						{/each}
					</ul>
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-col gap-2 border-t sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					class="text-destructive hover:text-destructive"
					onclick={cancelSubscription}
				>
					{t('billing.cancelSubscription')}
				</Button>
				<Button type="button" onclick={changePlan}>{t('billing.changePlan')}</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Payment method -->
		<Card.Root>
			<Card.Header>
				<Card.Title>{t('billing.paymentTitle')}</Card.Title>
				<Card.Description>{t('billing.paymentDescription')}</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<!-- Faux card -->
				<div
					class="relative aspect-[16/10] overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-card p-4 text-foreground"
				>
					<div
						class="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-primary/10 blur-2xl"
						aria-hidden="true"
					></div>
					<div class="relative flex h-full flex-col justify-between">
						<div class="flex items-center justify-between">
							<CreditCard class="size-6 text-primary" aria-hidden="true" />
							<span class="text-sm font-semibold tracking-wide text-foreground"
								>{paymentMethod.brand}</span
							>
						</div>
						<div>
							<p class="font-medium tracking-[0.2em] tabular-nums text-foreground">
								•••• •••• •••• {paymentMethod.last4}
							</p>
							<div class="mt-2 flex items-center justify-between text-xs text-muted-foreground">
								<span class="truncate">{paymentMethod.holder}</span>
								<span class="tabular-nums"
									>{t('billing.cardExpiry', { expiry: paymentMethod.expiry })}</span
								>
							</div>
						</div>
					</div>
				</div>
				<Button type="button" variant="outline" class="w-full" onclick={updatePaymentMethod}>
					<CreditCard class="size-4" aria-hidden="true" />
					{t('billing.update')}
				</Button>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Usage -->
	<Card.Root>
		<Card.Header>
			<Card.Title>{t('billing.usageTitle')}</Card.Title>
			<Card.Description>{t('billing.usageDescription')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
				{#each usage as metric (metric.id)}
					{@const percent = usagePercent(metric)}
					<div class="space-y-2">
						<div class="flex items-baseline justify-between gap-2">
							<span class="text-sm font-medium text-foreground">{metric.label}</span>
							<span class="text-xs tabular-nums text-muted-foreground">{percent}%</span>
						</div>
						<Progress
							value={percent}
							class={cn(percent >= 90 && '[&_[data-slot=progress-indicator]]:bg-amber-500')}
						/>
						<p class="text-sm tabular-nums text-muted-foreground">
							{formatUsage(metric.used, metric)}
							{t('billing.usageOf')}
							{formatUsage(metric.limit, metric)}
						</p>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Invoices -->
	<Card.Root>
		<Card.Header>
			<Card.Title>{t('billing.invoicesTitle')}</Card.Title>
			<Card.Description>{t('billing.invoicesDescription')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<DataTable
				data={invoices}
				{columns}
				searchable
				pageSize={8}
				emptyTitle={t('billing.invoicesEmptyTitle')}
				emptyDescription={t('billing.invoicesEmptyDescription')}
			>
				{#snippet cell(row, column)}
					{#if column.key === 'number'}
						<span class="font-medium tabular-nums text-foreground">{row.number}</span>
					{:else if column.key === 'date'}
						<span class="text-muted-foreground">{formatDate(row.date)}</span>
					{:else if column.key === 'amount'}
						<span class="tabular-nums">{formatCurrency(row.amount)}</span>
					{:else if column.key === 'status'}
						<StatusBadge tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusBadge>
					{/if}
				{/snippet}

				{#snippet actions(row)}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="text-muted-foreground hover:text-foreground"
						aria-label={`Download ${row.number}`}
						onclick={() => downloadInvoice(row)}
					>
						<Download class="size-4" aria-hidden="true" />
					</Button>
				{/snippet}
			</DataTable>
		</Card.Content>
	</Card.Root>
</PageContainer>
