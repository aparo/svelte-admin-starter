<!--
  Register page. Collects name/email/password/confirm with light client-side
  validation, then calls the mock `auth.register` and routes to the dashboard.
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/core/components/ui/card';
	import { Button } from '$lib/core/components/ui/button';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';
	import { PasswordInput, Spinner } from '$lib/components/shared';
	import { auth } from '$lib/auth';
	import { emailSchema, fieldError } from '$lib/core/utils/validators';
	import { t } from '$lib/i18n';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let submitting = $state(false);

	let errors = $state<{ name?: string; email?: string; password?: string; confirm?: string }>({});
	let formError = $state('');

	function validate(): boolean {
		const next: typeof errors = {};
		if (!name.trim()) next.name = t('register.nameRequired');

		const emailResult = emailSchema.safeParse(email);
		if (!emailResult.success) next.email = fieldError(emailResult.error, '');

		if (password.length < 8) next.password = t('register.passwordTooShort');
		if (confirm !== password) next.confirm = t('register.passwordMismatch');

		errors = next;
		return Object.keys(next).length === 0;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		if (!validate()) return;

		submitting = true;
		const result = await auth.register(name, email, password);
		submitting = false;

		if (result.ok) {
			toast.success(t('register.successToast'));
			goto(resolve('/dashboard'));
		} else {
			formError = result.error ?? t('register.errorFallback');
			toast.error(formError);
		}
	}
</script>

<svelte:head>
	<title>Create account · Admin Starter</title>
</svelte:head>

<Card.Root class="shadow-sm">
	<Card.Header class="space-y-1 text-center">
		<Card.Title class="text-xl">{t('register.cardTitle')}</Card.Title>
		<Card.Description>{t('register.cardDescription')}</Card.Description>
	</Card.Header>

	<Card.Content>
		<form class="space-y-4" onsubmit={handleSubmit} novalidate>
			<div class="space-y-2">
				<Label for="name">{t('register.fullName')}</Label>
				<Input
					id="name"
					type="text"
					autocomplete="name"
					placeholder={t('register.namePlaceholder')}
					bind:value={name}
					aria-invalid={errors.name ? 'true' : undefined}
				/>
				{#if errors.name}
					<p class="text-xs text-red-500">{errors.name}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="email">{t('auth.email')}</Label>
				<Input
					id="email"
					type="email"
					autocomplete="email"
					placeholder="you@example.com"
					bind:value={email}
					aria-invalid={errors.email ? 'true' : undefined}
				/>
				{#if errors.email}
					<p class="text-xs text-red-500">{errors.email}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="password">{t('auth.password')}</Label>
				<PasswordInput
					id="password"
					autocomplete="new-password"
					placeholder={t('register.passwordPlaceholder')}
					bind:value={password}
					aria-invalid={errors.password ? 'true' : undefined}
				/>
				{#if errors.password}
					<p class="text-xs text-red-500">{errors.password}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="confirm">{t('register.confirmPassword')}</Label>
				<PasswordInput
					id="confirm"
					autocomplete="new-password"
					placeholder={t('register.confirmPlaceholder')}
					bind:value={confirm}
					aria-invalid={errors.confirm ? 'true' : undefined}
				/>
				{#if errors.confirm}
					<p class="text-xs text-red-500">{errors.confirm}</p>
				{/if}
			</div>

			{#if formError}
				<p class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-red-500">{formError}</p>
			{/if}

			<Button type="submit" class="w-full" disabled={submitting}>
				{#if submitting}
					<Spinner class="size-4 text-primary-foreground" />
					{t('register.submitting')}
				{:else}
					{t('register.submit')}
				{/if}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center">
		<p class="text-sm text-muted-foreground">
			{t('register.hasAccount')}
			<a
				href={resolve('/login')}
				class="font-medium text-foreground underline-offset-4 hover:underline"
			>
				{t('auth.signIn')}
			</a>
		</p>
	</Card.Footer>
</Card.Root>
