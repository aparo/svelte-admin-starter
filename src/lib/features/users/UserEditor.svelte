<script lang="ts">
	import { untrack } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import { z } from 'zod';
	import * as Sheet from '$lib/core/components/ui/sheet';
	import * as Select from '$lib/core/components/ui/select';
	import { Button } from '$lib/core/components/ui/button';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';
	import { fieldError } from '$lib/core/utils/validators';
	import type { DemoUser } from '$lib/data/users';
	import { t } from '$lib/i18n';
	import { USER_ROLES, USER_STATUSES, roleLabel, statusLabel } from './presentation';
	import type { UserDraft } from './state.svelte';

	interface Props {
		open?: boolean;
		user?: DemoUser;
		editing?: boolean;
		onSave: (draft: UserDraft) => void;
	}

	let { open = $bindable(true), user, editing = false, onSave }: Props = $props();
	const fieldId = $props.id();
	const initial = untrack(() => user);
	let form = $state<{ name: string; email: string; role: string; status: string }>({
		name: initial?.name ?? '',
		email: initial?.email ?? '',
		role: initial?.role ?? 'viewer',
		status: initial?.status ?? 'active'
	});
	let errors = $state<z.ZodError | null>(null);
	const missing = $derived(editing && !user);

	function save() {
		if (missing) return;
		const schema = z.object({
			name: z.string().trim().min(1, t('validation.nameRequired')),
			email: z
				.string()
				.trim()
				.min(1, t('validation.emailRequired'))
				.email(t('validation.emailInvalid')),
			role: z.enum(['admin', 'editor', 'viewer'], { error: t('validation.roleInvalid') }),
			status: z.enum(['active', 'invited', 'suspended'], { error: t('validation.statusInvalid') })
		});
		const result = schema.safeParse(form);
		if (!result.success) {
			errors = result.error;
			return;
		}
		errors = null;
		onSave(result.data);
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" showCloseButton={false} class="gap-0 sm:max-w-lg!">
		<Sheet.Header class="border-b">
			<Sheet.Title>{t(editing ? 'users.editUser' : 'users.addUser')}</Sheet.Title>
			<Sheet.Description>
				{t(editing ? 'users.editDescription' : 'users.createDescription')}
			</Sheet.Description>
		</Sheet.Header>
		<Sheet.Close
			class="absolute end-3 top-3 rounded-sm p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			aria-label={t('users.close')}
		>
			<X class="size-4" aria-hidden="true" />
		</Sheet.Close>

		<form
			class="flex min-h-0 flex-1 flex-col"
			novalidate
			onsubmit={(event) => {
				event.preventDefault();
				save();
			}}
		>
			<div class="flex-1 space-y-4 overflow-y-auto p-4">
				{#if missing}<p role="status" class="text-sm text-destructive">
						{t('users.removedWhileEditing')}
					</p>{/if}
				<div class="space-y-2">
					<Label for={`${fieldId}-name`}>{t('common.name')}</Label>
					<Input
						id={`${fieldId}-name`}
						bind:value={form.name}
						placeholder={t('users.namePlaceholder')}
						autocomplete="off"
						aria-invalid={Boolean(fieldError(errors, 'name'))}
						aria-describedby={fieldError(errors, 'name') ? `${fieldId}-name-error` : undefined}
					/>
					{#if fieldError(errors, 'name')}<p
							id={`${fieldId}-name-error`}
							class="text-xs text-destructive"
						>
							{fieldError(errors, 'name')}
						</p>{/if}
				</div>
				<div class="space-y-2">
					<Label for={`${fieldId}-email`}>{t('auth.email')}</Label>
					<Input
						id={`${fieldId}-email`}
						type="email"
						bind:value={form.email}
						placeholder={t('users.emailPlaceholder')}
						autocomplete="off"
						aria-invalid={Boolean(fieldError(errors, 'email'))}
						aria-describedby={fieldError(errors, 'email') ? `${fieldId}-email-error` : undefined}
					/>
					{#if fieldError(errors, 'email')}<p
							id={`${fieldId}-email-error`}
							class="text-xs text-destructive"
						>
							{fieldError(errors, 'email')}
						</p>{/if}
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for={`${fieldId}-role`}>{t('users.role')}</Label>
						<Select.Root type="single" bind:value={form.role}>
							<Select.Trigger
								id={`${fieldId}-role`}
								class="w-full"
								aria-invalid={Boolean(fieldError(errors, 'role'))}
								aria-describedby={fieldError(errors, 'role') ? `${fieldId}-role-error` : undefined}
								>{roleLabel(form.role as DemoUser['role'])}</Select.Trigger
							>
							<Select.Content>
								{#each Object.entries(USER_ROLES) as [value, presentation] (value)}
									<Select.Item {value} label={t(presentation.label)}
										>{t(presentation.label)}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if fieldError(errors, 'role')}<p
								id={`${fieldId}-role-error`}
								class="text-xs text-destructive"
							>
								{fieldError(errors, 'role')}
							</p>{/if}
					</div>
					<div class="space-y-2">
						<Label for={`${fieldId}-status`}>{t('users.status')}</Label>
						<Select.Root type="single" bind:value={form.status}>
							<Select.Trigger
								id={`${fieldId}-status`}
								class="w-full"
								aria-invalid={Boolean(fieldError(errors, 'status'))}
								aria-describedby={fieldError(errors, 'status')
									? `${fieldId}-status-error`
									: undefined}>{statusLabel(form.status as DemoUser['status'])}</Select.Trigger
							>
							<Select.Content>
								{#each Object.entries(USER_STATUSES) as [value, presentation] (value)}
									<Select.Item {value} label={t(presentation.label)}
										>{t(presentation.label)}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if fieldError(errors, 'status')}<p
								id={`${fieldId}-status-error`}
								class="text-xs text-destructive"
							>
								{fieldError(errors, 'status')}
							</p>{/if}
					</div>
				</div>
			</div>
			<Sheet.Footer class="flex-row justify-end border-t">
				<Button type="button" variant="outline" onclick={() => (open = false)}
					>{t('common.cancel')}</Button
				>
				<Button type="submit" disabled={missing}
					>{t(editing ? 'users.saveChanges' : 'users.addUser')}</Button
				>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
