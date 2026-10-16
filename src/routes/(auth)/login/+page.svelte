<!--
  Login page. Validates with `loginSchema`, surfaces per-field errors via
  `fieldError`, and calls the mock `auth.login`. Includes a show/hide password
  toggle and a demo-credentials hint.
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
	import { loginSchema, fieldError } from '$lib/core/utils/validators';
	import { config } from '$lib/config';
	import { t } from '$lib/i18n';
	import { pageTitle } from '$lib/utils/page-title';

	const formId = $props.id();
	let email = $state(config.auth.demo.email);
	let password = $state(config.auth.demo.password);

	// Field errors are only shown after a submit attempt to avoid nagging.
	let errors = $state<{ email?: string; password?: string }>({});
	let formError = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (auth.loading) return;
		formError = '';

		const parsed = loginSchema.safeParse({ email, password });
		if (!parsed.success) {
			errors = {
				email: fieldError(parsed.error, 'email')
					? t(email.trim() ? 'auth.errors.emailInvalid' : 'auth.errors.emailRequired')
					: undefined,
				password: fieldError(parsed.error, 'password')
					? t('auth.errors.passwordRequired')
					: undefined
			};
			return;
		}
		errors = {};

		const result = await auth.login(parsed.data.email, parsed.data.password);

		if (result.ok) {
			toast.success(t('auth.signedIn'));
			void goto(resolve(config.app.homePath));
		} else {
			formError = result.error;
			toast.error(formError);
		}
	}

	function fillDemo() {
		email = config.auth.demo.email;
		password = config.auth.demo.password;
		errors = {};
		formError = '';
	}
</script>

<svelte:head>
	<title>{pageTitle(t('auth.signIn'))}</title>
</svelte:head>

<Card.Root class="shadow-sm">
	<Card.Header class="space-y-1 text-center">
		<Card.Title class="text-xl">{t('auth.welcomeBack')}</Card.Title>
		<Card.Description>{t('auth.signInDescription')}</Card.Description>
	</Card.Header>

	<Card.Content>
		<!-- Demo credentials hint -->
		<button
			type="button"
			onclick={fillDemo}
			disabled={auth.loading}
			class="mb-5 w-full rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted"
		>
			<span class="font-medium text-foreground">{t('auth.demoCredentials')}</span> — {t(
				'auth.autofillHint'
			)}
			<span class="font-mono">{config.auth.demo.email}</span> /
			<span class="font-mono">{config.auth.demo.password}</span>
		</button>

		<form class="space-y-4" onsubmit={handleSubmit} aria-busy={auth.loading} novalidate>
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
				<div class="flex items-center justify-between">
					<Label for={`${formId}-password`}>{t('auth.password')}</Label>
					<a
						href={resolve('/forgot-password')}
						class="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					>
						{t('auth.forgotPassword')}
					</a>
				</div>
				<PasswordInput
					id={`${formId}-password`}
					autocomplete="current-password"
					placeholder="••••••••"
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

			{#if formError}
				<p role="alert" class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
					{formError}
				</p>
			{/if}

			<Button type="submit" class="w-full" disabled={auth.loading}>
				{#if auth.loading}
					<Spinner class="size-4 text-primary-foreground" />
					{t('auth.signingIn')}
				{:else}
					{t('auth.signIn')}
				{/if}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center">
		<p class="text-sm text-muted-foreground">
			{t('auth.noAccount')}
			<a
				href={resolve('/register')}
				class="font-medium text-foreground underline-offset-4 hover:underline"
			>
				{t('auth.signUp')}
			</a>
		</p>
	</Card.Footer>
</Card.Root>
