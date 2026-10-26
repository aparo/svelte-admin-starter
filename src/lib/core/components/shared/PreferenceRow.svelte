<script lang="ts">
	import { Switch } from '../ui/switch';
	import { Label } from '../ui/label';
	import { cn } from '../../utils';

	interface Props {
		label: string;
		description?: string;
		checked?: boolean;
		disabled?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		class?: string;
	}
	let {
		label,
		description,
		checked = $bindable(false),
		disabled = false,
		onCheckedChange,
		class: className
	}: Props = $props();
	const id = $props.id();
</script>

<div class={cn('flex items-center justify-between gap-4 py-2', className)}>
	<div class="min-w-0 space-y-0.5">
		<Label id={`${id}-label`} for={`${id}-switch`} class="text-sm font-medium">{label}</Label>
		{#if description}
			<p id={`${id}-description`} class="text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>
	<Switch
		id={`${id}-switch`}
		{checked}
		{disabled}
		aria-label={label}
		aria-labelledby={`${id}-label`}
		aria-describedby={description ? `${id}-description` : undefined}
		onCheckedChange={(value) => {
			checked = value;
			onCheckedChange?.(value);
		}}
	/>
</div>
