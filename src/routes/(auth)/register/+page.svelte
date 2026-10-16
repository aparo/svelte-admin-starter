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
	import PasswordInput from '$lib/core/components/shared/PasswordInput.svelte';
	import Spinner from '$lib/core/components/shared/Spinner.svelte';
	import { auth } from '$lib/auth';
	import { emailSchema } from '$lib/core/utils/validators';
	import { config } from '$lib/config';
	import { t } from '$lib/i18n';
	import { pageTitle } from '$lib/utils/page-title';

	const formId = $props.id();
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');

	let errors = $state<{ name?: string; email?: string; password?: string; confirm?: string }>({});
	let formError = $state('');

	function validate(): { name: string; email: string; password: string } | undefined {
		const next: typeof errors = {};
		if (!name.trim()) next.name = t('auth.errors.nameRequired');

		const emailResult = emailSchema.safeParse(email);
		if (!emailResult.success) {
			next.email = t(email.trim() ? 'auth.errors.emailInvalid' : 'auth.errors.emailRequired');
		}

		if (password.length < config.auth.minPasswordLength) {
			next.password = t('auth.errors.passwordTooShort', { min: config.auth.minPasswordLength });
		}
		if (confirm !== password) next.confirm = t('auth.errors.passwordMismatch');

		errors = next;
		if (Object.keys(next).length > 0 || !emailResult.success) return;
		return { name: name.trim(), email: emailResult.data, password };
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (auth.loading) return;
		formError = '';
		const parsed = validate();
		if (!parsed) return;

		const result = await auth.register(parsed.name, parsed.email, parsed.password);

		if (result.ok) {
			toast.success(t('auth.registered'));
			void goto(resolve(config.app.homePath));
		} else {
			formError = result.error;
			toast.error(formError);
		}
	}
</script>

<svelte:head>
	<title>{pageTitle(t('auth.createAccount'))}</title>
</svelte:head>

<Card.Root class="shadow-sm">
	<Card.Header class="space-y-1 text-center">
		<Card.Title class="text-xl">{t('auth.createYourAccount')}</Card.Title>
		<Card.Description>{t('auth.getStarted')}</Card.Description>
	</Card.Header>

	<Card.Content>
		<form class="space-y-4" onsubmit={handleSubmit} aria-busy={auth.loading} novalidate>
			<div class="space-y-2">
				<Label for={`${formId}-name`}>{t('auth.fullName')}</Label>
				<Input
					id={`${formId}-name`}
					type="text"
					autocomplete="name"
					placeholder={t('auth.namePlaceholder')}
					bind:value={name}
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? `${formId}-name-error` : undefined}
				/>
				{#if errors.name}
					<p id={`${formId}-name-error`} class="text-xs text-destructive">{errors.name}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for={`${formId}-email`}>{t('auth.email')}</Label>
				<Input
					id={`${formId}-email`}
					type="email"
					autocomplete="email"
					placeholder="you@example.com"
					bind:value={email}
					aria-invalid={errors.email ? 'true' : undefined}
					aria-describedby={errors.email ? `${formId}-email-error` : undefined}
				/>
				{#if errors.email}
					<p id={`${formId}-email-error`} class="text-xs text-destructive">{errors.email}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for={`${formId}-password`}>{t('auth.password')}</Label>
				<PasswordInput
					id={`${formId}-password`}
					autocomplete="new-password"
					placeholder={t('auth.passwordPlaceholder', { min: config.auth.minPasswordLength })}
					bind:value={password}
					showLabel={t('auth.showPassword')}
					hideLabel={t('auth.hidePassword')}
					aria-invalid={errors.password ? 'true' : undefined}
					aria-describedby={errors.password ? `${formId}-password-error` : undefined}
				/>
				{#if errors.password}
					<p id={`${formId}-password-error`} class="text-xs text-destructive">{errors.password}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for={`${formId}-confirm`}>{t('auth.confirmPassword')}</Label>
				<PasswordInput
					id={`${formId}-confirm`}
					autocomplete="new-password"
					placeholder={t('auth.confirmPlaceholder')}
					bind:value={confirm}
					showLabel={t('auth.showPassword')}
					hideLabel={t('auth.hidePassword')}
					aria-invalid={errors.confirm ? 'true' : undefined}
					aria-describedby={errors.confirm ? `${formId}-confirm-error` : undefined}
				/>
				{#if errors.confirm}
					<p id={`${formId}-confirm-error`} class="text-xs text-destructive">{errors.confirm}</p>
				{/if}
			</div>

			{#if formError}
				<p role="alert" class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
					{formError}
				</p>
			{/if}

			<Button type="submit" class="w-full" disabled={auth.loading}>
				{#if auth.loading}
					<Spinner class="size-4 text-primary-foreground" />
					{t('auth.creatingAccount')}
				{:else}
					{t('auth.createAccount')}
				{/if}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center">
		<p class="text-sm text-muted-foreground">
			{t('auth.haveAccount')}
			<a
				href={resolve('/login')}
				class="font-medium text-foreground underline-offset-4 hover:underline"
			>
				{t('auth.signIn')}
			</a>
		</p>
	</Card.Footer>
</Card.Root>
