<!--
  Forms reference — a realistic "Create project" form demonstrating the common
  field patterns (text, textarea, select, checkbox group, radio group, switch,
  date picker, slider) with inline zod validation. A second card shows the input
  states (default / disabled / error / with-icon). No backend — submit just
  shows a toast and resets the local $state.
-->
<script lang="ts">
	import * as Card from '$lib/core/components/ui/card';
	import * as Select from '$lib/core/components/ui/select';
	import * as Popover from '$lib/core/components/ui/popover';
	import * as RadioGroup from '$lib/core/components/ui/radio-group';
	import { Calendar } from '$lib/core/components/ui/calendar';
	import { Button } from '$lib/core/components/ui/button';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';
	import { Textarea } from '$lib/core/components/ui/textarea';
	import { Checkbox } from '$lib/core/components/ui/checkbox';
	import { Switch } from '$lib/core/components/ui/switch';
	import { Slider } from '$lib/core/components/ui/slider';
	import { PageContainer, PageHeader, PasswordInput } from '$lib/components/shared';
	import { fieldError } from '$lib/core/utils/validators';
	import { cn } from '$lib/core/utils';
	import { toast } from 'svelte-sonner';
	import { t } from '$lib/i18n';
	import { z } from 'zod';
	import { DateFormatter, getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import MailIcon from '@lucide/svelte/icons/mail';
	import RocketIcon from '@lucide/svelte/icons/rocket';

	// --- Static option lists for the demo selects/groups ---
	const categories = [
		{ value: 'web', label: t('forms.catWebApp') },
		{ value: 'mobile', label: t('forms.catMobileApp') },
		{ value: 'api', label: t('forms.catApiService') },
		{ value: 'data', label: t('forms.catDataPipeline') }
	];

	const stackOptions = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'node', label: 'Node.js' },
		{ value: 'python', label: 'Python' }
	];

	const visibilityOptions = [
		{ value: 'private', label: t('forms.visPrivate'), hint: t('forms.visPrivateHint') },
		{ value: 'team', label: t('forms.visTeam'), hint: t('forms.visTeamHint') },
		{ value: 'public', label: t('forms.visPublic'), hint: t('forms.visPublicHint') }
	];

	// --- Validation schema (inline — specific to this demo form) ---
	const schema = z.object({
		name: z.string().trim().min(3, t('forms.nameMinLength')),
		description: z.string().trim().max(280, t('forms.descMaxLength')),
		category: z.string().min(1, t('forms.categoryRequired')),
		stack: z.array(z.string()).min(1, t('forms.stackRequired')),
		visibility: z.enum(['private', 'team', 'public']),
		dueDate: z.string().min(1, t('forms.dueDateRequired')),
		priority: z.number().min(0).max(100)
	});

	// --- Local form state ---
	let name = $state('');
	let description = $state('');
	let category = $state('');
	let stack = $state<string[]>([]);
	let visibility = $state('team');
	let dueValue = $state<DateValue | undefined>(undefined);
	let priority = $state(50);
	let notifyOnComplete = $state(true);
	let demoPassword = $state('Secret123!');

	let errors = $state<z.ZodError | null>(null);
	let datePopoverOpen = $state(false);

	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	const minDate = today(getLocalTimeZone());

	const categoryLabel = $derived(
		categories.find((c) => c.value === category)?.label ?? t('forms.categoryRequired')
	);

	function toggleStack(value: string, checked: boolean): void {
		stack = checked ? [...stack, value] : stack.filter((v) => v !== value);
	}

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		const result = schema.safeParse({
			name,
			description,
			category,
			stack,
			visibility,
			dueDate: dueValue ? dueValue.toString() : '',
			priority
		});

		if (!result.success) {
			errors = result.error;
			toast.error(t('forms.fixFields'));
			return;
		}

		errors = null;
		toast.success(t('forms.projectCreated'), { description: `"${name}" is ready to go.` });
		reset();
	}

	function reset(): void {
		name = '';
		description = '';
		category = '';
		stack = [];
		visibility = 'team';
		dueValue = undefined;
		priority = 50;
		notifyOnComplete = true;
		errors = null;
	}
</script>

<svelte:head>
	<title>Forms · Admin Starter</title>
</svelte:head>

<PageContainer>
	<PageHeader title={t('forms.pageTitle')} description={t('forms.pageDescription')} />

	<form onsubmit={handleSubmit} class="grid gap-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>{t('forms.createProjectTitle')}</Card.Title>
				<Card.Description>
					{t('forms.createProjectDescription')}
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<!-- Name -->
				<div class="grid gap-2">
					<Label for="name">{t('forms.projectName')}</Label>
					<Input
						id="name"
						bind:value={name}
						placeholder={t('forms.projectNamePlaceholder')}
						aria-invalid={fieldError(errors, 'name') ? 'true' : undefined}
					/>
					{#if fieldError(errors, 'name')}
						<p class="text-destructive text-xs">{fieldError(errors, 'name')}</p>
					{/if}
				</div>

				<!-- Description -->
				<div class="grid gap-2">
					<Label for="description">{t('forms.projectDescription')}</Label>
					<Textarea
						id="description"
						bind:value={description}
						rows={3}
						placeholder={t('forms.projectDescPlaceholder')}
						aria-invalid={fieldError(errors, 'description') ? 'true' : undefined}
					/>
					<div class="flex items-center justify-between">
						{#if fieldError(errors, 'description')}
							<p class="text-destructive text-xs">{fieldError(errors, 'description')}</p>
						{:else}
							<span></span>
						{/if}
						<span class="text-muted-foreground text-xs">{description.length}/280</span>
					</div>
				</div>

				<div class="grid gap-6 sm:grid-cols-2">
					<!-- Category -->
					<div class="grid gap-2">
						<Label for="category">{t('forms.category')}</Label>
						<Select.Root type="single" bind:value={category}>
							<Select.Trigger
								id="category"
								class="w-full"
								aria-invalid={fieldError(errors, 'category') ? 'true' : undefined}
							>
								{categoryLabel}
							</Select.Trigger>
							<Select.Content>
								{#each categories as c (c.value)}
									<Select.Item value={c.value} label={c.label}>{c.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if fieldError(errors, 'category')}
							<p class="text-destructive text-xs">{fieldError(errors, 'category')}</p>
						{/if}
					</div>

					<!-- Due date -->
					<div class="grid gap-2">
						<Label for="due-date">{t('forms.dueDate')}</Label>
						<Popover.Root bind:open={datePopoverOpen}>
							<Popover.Trigger id="due-date">
								{#snippet child({ props })}
									<Button
										{...props}
										variant="outline"
										class={cn(
											'w-full justify-start text-left font-normal',
											!dueValue && 'text-muted-foreground'
										)}
										aria-invalid={fieldError(errors, 'dueDate') ? 'true' : undefined}
									>
										<CalendarIcon class="size-4" />
										{dueValue
											? df.format(dueValue.toDate(getLocalTimeZone()))
											: t('forms.pickDate')}
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" align="start">
								<Calendar
									type="single"
									bind:value={dueValue}
									minValue={minDate}
									captionLayout="dropdown"
									onValueChange={() => (datePopoverOpen = false)}
								/>
							</Popover.Content>
						</Popover.Root>
						{#if fieldError(errors, 'dueDate')}
							<p class="text-destructive text-xs">{fieldError(errors, 'dueDate')}</p>
						{/if}
					</div>
				</div>

				<!-- Tech stack (multi-checkbox) -->
				<div class="grid gap-3">
					<Label>{t('forms.techStack')}</Label>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each stackOptions as option (option.value)}
							<Label
								class="flex items-center gap-3 rounded-md border border-border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
							>
								<Checkbox
									checked={stack.includes(option.value)}
									onCheckedChange={(v) => toggleStack(option.value, v === true)}
								/>
								{option.label}
							</Label>
						{/each}
					</div>
					{#if fieldError(errors, 'stack')}
						<p class="text-destructive text-xs">{fieldError(errors, 'stack')}</p>
					{/if}
				</div>

				<!-- Visibility (radio group) -->
				<div class="grid gap-3">
					<Label>{t('forms.visibility')}</Label>
					<RadioGroup.Root bind:value={visibility} class="gap-3">
						{#each visibilityOptions as option (option.value)}
							<Label
								class="flex items-start gap-3 rounded-md border border-border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
							>
								<RadioGroup.Item value={option.value} class="mt-0.5" />
								<span class="grid gap-1">
									<span class="text-sm font-medium">{option.label}</span>
									<span class="text-muted-foreground text-xs">{option.hint}</span>
								</span>
							</Label>
						{/each}
					</RadioGroup.Root>
				</div>

				<!-- Priority (slider) -->
				<div class="grid gap-3">
					<div class="flex items-center justify-between">
						<Label for="priority">{t('forms.priority')}</Label>
						<span class="text-muted-foreground text-sm tabular-nums">{priority}%</span>
					</div>
					<Slider id="priority" type="single" bind:value={priority} min={0} max={100} step={5} />
				</div>

				<!-- Notifications (switch) -->
				<div class="flex items-center justify-between rounded-md border border-border p-4">
					<div class="space-y-0.5">
						<Label>{t('forms.notifyOnCompletion')}</Label>
						<p class="text-muted-foreground text-xs">
							{t('forms.notifyHint')}
						</p>
					</div>
					<Switch checked={notifyOnComplete} onCheckedChange={(v) => (notifyOnComplete = v)} />
				</div>
			</Card.Content>
			<Card.Footer class="justify-end gap-2 border-t">
				<Button type="button" variant="outline" onclick={reset}>{t('forms.reset')}</Button>
				<Button type="submit">
					<RocketIcon class="size-4" />
					{t('forms.submit')}
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Input states reference -->
		<Card.Root>
			<Card.Header>
				<Card.Title>{t('forms.statesTitle')}</Card.Title>
				<Card.Description>{t('forms.statesDescription')}</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				<div class="grid gap-2">
					<Label for="state-default">{t('forms.stateDefault')}</Label>
					<Input id="state-default" placeholder="Type something…" />
				</div>

				<div class="grid gap-2">
					<Label for="state-disabled">{t('forms.stateDisabled')}</Label>
					<Input id="state-disabled" value="Read only" disabled />
				</div>

				<div class="grid gap-2">
					<Label for="state-error">{t('forms.stateError')}</Label>
					<Input id="state-error" value="invalid-email" aria-invalid="true" />
					<p class="text-destructive text-xs">{t('forms.emailError')}</p>
				</div>

				<div class="grid gap-2">
					<Label for="state-icon">{t('forms.stateWithIcon')}</Label>
					<div class="relative">
						<MailIcon
							class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
						/>
						<Input id="state-icon" type="email" placeholder="you@example.com" class="pl-8" />
					</div>
				</div>

				<div class="grid gap-2">
					<Label for="state-password">{t('forms.statePassword')}</Label>
					<PasswordInput
						id="state-password"
						bind:value={demoPassword}
						placeholder="Enter password…"
					/>
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</PageContainer>
