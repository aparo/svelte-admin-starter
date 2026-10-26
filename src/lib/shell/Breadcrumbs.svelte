<!-- Breadcrumb trail derived from the current path + nav model. -->
<script lang="ts">
	import * as Breadcrumb from '$lib/core/components/ui/breadcrumb';
	import { page } from '$app/state';
	import { findNavItem } from './nav';
	import { navGroupLabel, navTitle, routeLabelFor, titleCase, translatedLabel } from './labels';
	import { resolveAppUrl, toAppPathname } from './paths';
	import { cn } from '$lib/core/utils';
	import { t } from '$lib/i18n';
	import { config } from '$lib/config';

	interface Crumb {
		label: string;
		href?: string;
	}

	const crumbs = $derived.by((): Crumb[] => {
		const pathname = toAppPathname(page.url.pathname);
		const trail: Crumb[] = [
			{ label: translatedLabel('nav.home', 'Home'), href: config.app.homePath }
		];

		const match = findNavItem(pathname);
		if (match) {
			trail.push({ label: navGroupLabel(match.group) });
			trail.push({ label: navTitle(match.item), href: match.item.href });

			// Any path segments beyond the matched nav item become extra crumbs.
			const rest = pathname.slice(match.item.href.length).split('/').filter(Boolean);
			let acc = match.item.href;
			for (const seg of rest) {
				acc += '/' + seg;
				trail.push({ label: titleCase(seg), href: acc });
			}
		} else {
			// Fallback: build crumbs straight from path segments.
			let acc = '';
			for (const seg of pathname.split('/').filter(Boolean)) {
				acc += '/' + seg;
				trail.push({ label: titleCase(seg), href: acc });
			}
		}

		// A page can supply a friendly label for its leaf crumb via load data
		// (e.g. /users/[id] returns the user's name instead of the raw id).
		if (trail.length > 1) {
			trail[trail.length - 1] = {
				...trail[trail.length - 1],
				label: routeLabelFor(pathname, page.data)
			};
		}
		return trail;
	});
</script>

<Breadcrumb.Root class="min-w-0 overflow-hidden">
	<Breadcrumb.List>
		{#each crumbs as crumb, i (i)}
			<Breadcrumb.Item
				class={cn('min-w-0', i > 0 && i < crumbs.length - 1 ? 'hidden md:block' : '')}
			>
				{#if i === crumbs.length - 1 || !crumb.href}
					<Breadcrumb.Page class="truncate max-w-[150px] sm:max-w-[240px] inline-block align-bottom"
						>{crumb.label}</Breadcrumb.Page
					>
				{:else}
					<Breadcrumb.Link
						href={resolveAppUrl(crumb.href)}
						class="truncate max-w-[120px] sm:max-w-[200px] inline-block align-bottom"
						>{crumb.label}</Breadcrumb.Link
					>
				{/if}
			</Breadcrumb.Item>
			{#if i < crumbs.length - 1}
				<Breadcrumb.Separator class={i > 0 && i < crumbs.length - 1 ? 'hidden md:block' : ''} />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
