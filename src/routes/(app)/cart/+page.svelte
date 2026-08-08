<!--
  Shopping cart — a two-column checkout view. The left column lists editable
  line items (quantity steppers, remove) seeded from the mock product catalog;
  the right column holds a sticky order summary with a promo-code field.

  All state is local ($state) and every total is derived ($derived) so editing
  quantities, removing rows or applying a promo recomputes instantly. No backend.
-->
<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Package from '@lucide/svelte/icons/package';
	import Tag from '@lucide/svelte/icons/tag';

	import { PageContainer, PageHeader, EmptyState } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';
	import { Button } from '$lib/core/components/ui/button';
	import { Input } from '$lib/core/components/ui/input';
	import { Separator } from '$lib/core/components/ui/separator';
	import { cn } from '$lib/core/utils';
	import { toast } from 'svelte-sonner';

	import { demoProducts, type DemoProduct } from '$lib/data/products';
	import { formatCurrency } from '$lib/core/utils/formatters';
	import { t } from '$lib/i18n';

	// A cart line item is a product plus a quantity.
	interface CartItem extends DemoProduct {
		quantity: number;
	}

	// --- Cart configuration ---
	const PROMO_CODE = 'SAVE10';
	const PROMO_RATE = 0.1; // 10% off
	const FREE_SHIPPING_THRESHOLD = 200;
	const SHIPPING_FLAT = 9.99;
	const TAX_RATE = 0.08; // 8%

	// Seed the cart with four products from the mock catalog.
	let items = $state<CartItem[]>([
		{ ...demoProducts[1]!, quantity: 1 }, // Nimbus Wireless Keyboard
		{ ...demoProducts[4]!, quantity: 1 }, // Lumen 27" 4K Monitor
		{ ...demoProducts[3]!, quantity: 2 }, // Drift Ergonomic Mouse
		{ ...demoProducts[8]!, quantity: 1 } // Atlas Laptop Stand
	]);

	// Promo state — the discount only applies once a valid code is accepted.
	let promoInput = $state('');
	let appliedPromo = $state<string | null>(null);

	// --- Derived totals ---
	const subtotal = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
	const discount = $derived(appliedPromo ? subtotal * PROMO_RATE : 0);
	const discountedSubtotal = $derived(subtotal - discount);
	const shipping = $derived(
		items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
	);
	const tax = $derived(discountedSubtotal * TAX_RATE);
	const total = $derived(discountedSubtotal + shipping + tax);
	const itemCount = $derived(items.reduce((sum, item) => sum + item.quantity, 0));

	// --- Actions ---
	function increment(id: string): void {
		const item = items.find((i) => i.id === id);
		if (item) item.quantity += 1;
	}

	function decrement(id: string): void {
		const item = items.find((i) => i.id === id);
		if (item && item.quantity > 1) item.quantity -= 1;
	}

	function removeItem(id: string): void {
		const removed = items.find((i) => i.id === id);
		items = items.filter((i) => i.id !== id);
		if (removed) {
			toast.success(t('cart.removedToast'), { description: removed.name });
		}
	}

	function applyPromo(): void {
		const code = promoInput.trim().toUpperCase();
		if (code === PROMO_CODE) {
			appliedPromo = PROMO_CODE;
			toast.success(t('cart.promoAppliedToast'), { description: t('cart.promoAppliedDesc') });
		} else {
			appliedPromo = null;
			toast.error(t('cart.invalidPromoToast'), { description: t('cart.invalidPromoDesc') });
		}
	}

	function checkout(): void {
		toast.success(t('cart.orderPlaced'), {
			description: `${itemCount} ${itemCount === 1 ? 'item' : 'items'} · ${formatCurrency(total)}`
		});
	}
</script>

<svelte:head>
	<title>Cart · Admin Starter</title>
</svelte:head>

<PageContainer>
	<PageHeader title={t('cart.pageTitle')} description={t('cart.pageDescription')} />

	{#if items.length === 0}
		<EmptyState
			icon={ShoppingCart}
			title={t('cart.emptyTitle')}
			description={t('cart.emptyDescription')}
		>
			{#snippet action()}
				<Button href="/tables">
					<Package class="size-4" aria-hidden="true" />
					{t('cart.browseProducts')}
				</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
			<!-- Line items (spans two columns) -->
			<div class="space-y-4 lg:col-span-2">
				<Card.Root>
					<Card.Header class="flex-row items-center justify-between">
						<div class="space-y-1">
							<Card.Title>{t('cart.itemsTitle')}</Card.Title>
							<Card.Description>
								{itemCount === 1
									? t('cart.itemsDescription', { count: itemCount })
									: t('cart.itemsDescriptionPlural', { count: itemCount })}
							</Card.Description>
						</div>
						<span
							class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg"
							aria-hidden="true"
						>
							<ShoppingCart class="size-4.5" />
						</span>
					</Card.Header>
					<Card.Content class="p-0">
						<ul class="divide-border divide-y">
							{#each items as item (item.id)}
								<li class="flex items-center gap-4 px-6 py-4">
									<!-- Product image placeholder -->
									<div
										class="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-lg border border-border"
										aria-hidden="true"
									>
										<Package class="size-6" />
									</div>

									<!-- Name + category + unit price -->
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium text-foreground">{item.name}</p>
										<p class="text-muted-foreground truncate text-xs">{item.category}</p>
										<p class="text-muted-foreground mt-1 text-xs tabular-nums">
											{t('cart.priceEach', { price: formatCurrency(item.price) })}
										</p>
									</div>

									<!-- Quantity stepper -->
									<div class="flex items-center rounded-lg border border-border">
										<Button
											variant="ghost"
											size="icon"
											class="text-muted-foreground hover:text-foreground size-8 rounded-r-none"
											title={t('cart.decreaseQty')}
											aria-label={`Decrease quantity of ${item.name}`}
											disabled={item.quantity <= 1}
											onclick={() => decrement(item.id)}
										>
											<Minus class="size-3.5" />
										</Button>
										<span
											class="w-9 text-center text-sm font-medium tabular-nums text-foreground"
											aria-label={t('cart.qtyLabel')}
										>
											{item.quantity}
										</span>
										<Button
											variant="ghost"
											size="icon"
											class="text-muted-foreground hover:text-foreground size-8 rounded-l-none"
											title={t('cart.increaseQty')}
											aria-label={`Increase quantity of ${item.name}`}
											onclick={() => increment(item.id)}
										>
											<Plus class="size-3.5" />
										</Button>
									</div>

									<!-- Line subtotal -->
									<div class="w-24 shrink-0 text-right">
										<p class="text-sm font-semibold tabular-nums text-foreground">
											{formatCurrency(item.price * item.quantity)}
										</p>
									</div>

									<!-- Remove -->
									<Button
										variant="ghost"
										size="icon"
										class="text-muted-foreground hover:text-destructive size-8 shrink-0"
										title={t('cart.removeItem')}
										aria-label={`Remove ${item.name} from cart`}
										onclick={() => removeItem(item.id)}
									>
										<Trash2 class="size-4" />
									</Button>
								</li>
							{/each}
						</ul>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Order summary (sticky on lg) -->
			<div class="lg:sticky lg:top-6">
				<Card.Root>
					<Card.Header>
						<Card.Title>{t('cart.summaryTitle')}</Card.Title>
						<Card.Description>{t('cart.summaryDescription')}</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-5">
						<!-- Promo code -->
						<div class="space-y-2">
							<div class="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
								<Tag class="size-3.5" aria-hidden="true" />
								<span>{t('cart.promoLabel')}</span>
							</div>
							<div class="flex items-center gap-2">
								<Input
									bind:value={promoInput}
									placeholder={t('cart.promoPlaceholder')}
									aria-label={t('cart.promoLabel')}
									class="h-9"
									onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && applyPromo()}
								/>
								<Button variant="outline" class="h-9 shrink-0" onclick={applyPromo}
									>{t('cart.promoApply')}</Button
								>
							</div>
							{#if appliedPromo}
								<p class="text-primary flex items-center gap-1 text-xs font-medium">
									<Tag class="size-3" aria-hidden="true" />
									{t('cart.promoApplied', { code: appliedPromo })}
								</p>
							{/if}
						</div>

						<Separator />

						<!-- Totals breakdown -->
						<dl class="space-y-3 text-sm">
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">{t('cart.subtotal')}</dt>
								<dd class="tabular-nums text-foreground">{formatCurrency(subtotal)}</dd>
							</div>
							{#if discount > 0}
								<div class="flex items-center justify-between">
									<dt class="text-muted-foreground">{t('cart.discount')}</dt>
									<dd class="text-primary tabular-nums">−{formatCurrency(discount)}</dd>
								</div>
							{/if}
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">{t('cart.shipping')}</dt>
								<dd class={cn('tabular-nums', shipping === 0 ? 'text-primary' : 'text-foreground')}>
									{shipping === 0 ? t('cart.shippingFree') : formatCurrency(shipping)}
								</dd>
							</div>
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">{t('cart.tax')}</dt>
								<dd class="tabular-nums text-foreground">{formatCurrency(tax)}</dd>
							</div>
						</dl>

						<Separator />

						<div class="flex items-center justify-between">
							<span class="text-base font-semibold text-foreground">{t('cart.total')}</span>
							<span class="text-base font-semibold tabular-nums text-foreground">
								{formatCurrency(total)}
							</span>
						</div>

						{#if shipping > 0}
							<p class="text-muted-foreground text-xs">
								{t('cart.freeShippingHint', {
									amount: formatCurrency(FREE_SHIPPING_THRESHOLD - discountedSubtotal)
								})}
							</p>
						{/if}
					</Card.Content>
					<Card.Footer class="flex-col gap-3">
						<Button class="w-full" onclick={checkout}>
							<ShoppingCart class="size-4" aria-hidden="true" />
							{t('cart.checkout')}
						</Button>
						<Button
							href="/tables"
							variant="link"
							class="text-muted-foreground hover:text-foreground"
						>
							{t('cart.continueShopping')}
						</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	{/if}
</PageContainer>
