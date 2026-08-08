<!--
  CommandMenu — a ⌘K / Ctrl+K command palette. Lists every navigation route
  (grouped, from `$lib/shell/nav`) and navigates on select. Registers a global
  keydown handler so the palette can be summoned from anywhere; `open` is
  bindable so a parent (e.g. the header search button) can also toggle it.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as Command from '$lib/core/components/ui/command';
	import { navGroups } from '$lib/shell/nav';
	import { t } from '$lib/i18n';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	function runCommand(href: Pathname) {
		open = false;
		goto(resolve(href));
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			open = !open;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
</script>

<Command.Dialog bind:open title={t('commandMenu.title')} description={t('commandMenu.description')}>
	<Command.Input placeholder={t('commandMenu.placeholder')} />
	<Command.List>
		<Command.Empty>{t('commandMenu.noResults')}</Command.Empty>
		{#each navGroups as group (group.labelKey)}
			<Command.Group heading={t(group.labelKey)}>
				{#each group.items as item (item.href)}
					{@const Icon = item.icon}
					<Command.Item
						value={`${t(group.labelKey)} ${t(item.titleKey)} ${item.href}`}
						onSelect={() => runCommand(item.href)}
					>
						<Icon class="size-4" aria-hidden="true" />
						<span>{t(item.titleKey)}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
