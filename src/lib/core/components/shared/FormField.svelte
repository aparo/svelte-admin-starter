<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '../ui/label';
	import { cn } from '../../utils.js';

	export interface FormFieldControlProps {
		id: string;
		'aria-invalid': true | undefined;
		'aria-describedby': string | undefined;
	}

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		label: string;
		error?: string;
		description?: string;
		labelAction?: Snippet;
		children: Snippet<[FormFieldControlProps]>;
	};

	let {
		id,
		label,
		error,
		description,
		labelAction,
		children,
		class: className,
		...restProps
	}: Props = $props();
	const instanceId = $props.id();
	const controlId = $derived(id ?? `${instanceId}-control`);
	const descriptionId = $derived(`${controlId}-description`);
	const errorId = $derived(`${controlId}-error`);
	const controlProps: FormFieldControlProps = $derived({
		id: controlId,
		'aria-invalid': error ? true : undefined,
		'aria-describedby':
			[description ? descriptionId : undefined, error ? errorId : undefined]
				.filter(Boolean)
				.join(' ') || undefined
	});
</script>

<div data-slot="form-field" class={cn('space-y-2', className)} {...restProps}>
	<div class="flex items-center justify-between gap-2">
		<Label for={controlId}>{label}</Label>
		{@render labelAction?.()}
	</div>
	{@render children(controlProps)}
	{#if description}
		<p id={descriptionId} class="text-xs text-muted-foreground">{description}</p>
	{/if}
	{#if error}
		<p id={errorId} role="alert" class="text-xs text-destructive">{error}</p>
	{/if}
</div>
