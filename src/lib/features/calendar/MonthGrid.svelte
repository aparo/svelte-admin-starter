<script lang="ts">
	import { cn } from '$lib/core/utils';
	import { t } from '$lib/i18n';
	import type { DayCell } from '$lib/calendar';
	import type { CalendarEvent } from './types';
	import { CATEGORIES, CATEGORY_ORDER } from './presentation';
	let {
		grid,
		weekdays,
		eventsByDay,
		selectedKey = $bindable(null)
	}: {
		grid: DayCell[];
		weekdays: string[];
		eventsByDay: ReadonlyMap<string, CalendarEvent[]>;
		selectedKey?: string | null;
	} = $props();
	const MAX_CHIPS = 3;
</script>

<!-- Weekday header row -->
<div class="text-muted-foreground mb-2 grid grid-cols-7 gap-px text-center text-xs font-medium">
	{#each weekdays as day (day)}
		<div class="py-1">{day}</div>
	{/each}
</div>

<!-- Month grid: 6 weeks × 7 days -->
<div class="border-border bg-border grid grid-cols-7 gap-px overflow-hidden rounded-lg border">
	{#each grid as cell (cell.key)}
		{@const dayEvents = eventsByDay.get(cell.key) ?? []}
		{@const overflow = dayEvents.length - MAX_CHIPS}
		<button
			type="button"
			onclick={() => (selectedKey = selectedKey === cell.key ? null : cell.key)}
			aria-label={cell.key}
			aria-pressed={selectedKey === cell.key}
			class={cn(
				'bg-card relative flex min-h-20 cursor-pointer flex-col gap-1 p-1.5 text-left transition-colors hover:bg-accent focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none sm:min-h-28 sm:p-2',
				!cell.inMonth && 'bg-muted/40 text-muted-foreground hover:bg-muted/60',
				cell.isToday && 'bg-primary/10 hover:bg-primary/15',
				selectedKey === cell.key && 'bg-primary/20 ring-2 ring-ring ring-inset hover:bg-primary/25'
			)}
		>
			<!-- Day number -->
			<div class="flex items-center justify-between">
				<span
					class={cn(
						'inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums',
						cell.isToday
							? 'bg-primary text-primary-foreground font-semibold'
							: cell.inMonth
								? 'text-foreground'
								: 'text-muted-foreground/60'
					)}
				>
					{cell.day}
				</span>
			</div>

			<!-- Event chips (up to MAX_CHIPS) + overflow indicator -->
			<div class="flex flex-col gap-1">
				{#each dayEvents.slice(0, MAX_CHIPS) as ev (ev.id)}
					<div
						class={cn(
							'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-left text-[11px] leading-tight font-medium',
							CATEGORIES[ev.category].chip,
							!cell.inMonth && 'opacity-60'
						)}
						title={ev.time ? `${ev.time} · ${ev.title}` : ev.title}
					>
						{#if ev.time}
							<span class="shrink-0 tabular-nums opacity-80">{ev.time}</span>
						{/if}
						<span class="truncate">{ev.title}</span>
					</div>
				{/each}
				{#if overflow > 0}
					<span class="text-muted-foreground px-1.5 text-[11px] font-medium">
						{t('calendar.more', { count: overflow })}
					</span>
				{/if}
			</div>
		</button>
	{/each}
</div>

<!-- Legend -->
<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
	{#each CATEGORY_ORDER as category (category)}
		<div class="flex items-center gap-1.5">
			<span class={cn('size-2.5 rounded-full', CATEGORIES[category].dot)} aria-hidden="true"></span>
			<span class="text-muted-foreground text-xs"
				>{CATEGORIES[category].labelKey ? t(CATEGORIES[category].labelKey) : category}</span
			>
		</div>
	{/each}
</div>
