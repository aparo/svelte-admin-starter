<script lang="ts">
	import type { Component } from 'svelte';
	import type { IconProps } from '@lucide/svelte';
	import * as Popover from '$lib/core/components/ui/popover';
	import { Button } from '$lib/core/components/ui/button';
	import { cn } from '$lib/core/utils';

	interface Props {
		id?: string;
		icon: Component<IconProps>;
		displayValue: string;
		placeholder: string;
		disabled?: boolean;
		required?: boolean;
		'aria-label'?: string;
		'aria-invalid'?: boolean | 'true' | 'false';
	}

	let {
		id,
		icon: Icon,
		displayValue,
		placeholder,
		disabled = false,
		required = false,
		'aria-label': ariaLabel,
		'aria-invalid': ariaInvalid
	}: Props = $props();
</script>

<Popover.Trigger {disabled}>
	{#snippet child({ props })}
		<Button
			{...props}
			{id}
			variant="outline"
			class={cn(
				'w-full justify-start text-left font-normal',
				!displayValue && 'text-muted-foreground'
			)}
			{disabled}
			aria-label={ariaLabel ?? placeholder}
			aria-required={required}
			aria-invalid={ariaInvalid}
		>
			<Icon class="size-4" aria-hidden="true" />
			<span class="min-w-0 flex-1 truncate">{displayValue || placeholder}</span>
		</Button>
	{/snippet}
</Popover.Trigger>
