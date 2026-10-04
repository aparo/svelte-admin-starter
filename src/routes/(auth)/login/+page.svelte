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
	import { PasswordInput, Spinner } from '$lib/components/shared';
	import { auth } from '$lib/auth';
	import { loginSchema, fieldError } from '$lib/core/utils/validators';
	import { config } from '$lib/config';
	import { t } from '$lib/i18n';

	let email = $state(config.auth.demo.email);
	let password = $state(config.auth.demo.password);
	let submitting = $state(false);

	// Field errors are only shown after a submit attempt to avoid nagging.
	let errors = $state<{ email?: string; password?: string }>({});
	let formError = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formError = '';

		const parsed = loginSchema.safeParse({ email, password });
		if (!parsed.success) {
			errors = {
				email: fieldError(parsed.error, 'email'),
				password: fieldError(parsed.error, 'password')
			};
			return;
		}
		errors = {};

		submitting = true;
		const result = await auth.login(parsed.data.email, parsed.data.password);
		submitting = false;

		if (result.ok) {
			toast.success(t('login.welcomeToast'));
			goto(resolve(config.app.homePath));
		} else {
			formError = result.error ?? t('login.errorFallback');
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
	<title>Sign in · Admin Starter</title>
</svelte:head>

<Card.Root class="shadow-sm">
	<Card.Header class="space-y-1 text-center">
		<Card.Title class="text-xl">{t('login.cardTitle')}</Card.Title>
		<Card.Description>{t('login.cardDescription')}</Card.Description>
	</Card.Header>

	<Card.Content>
		<!-- Demo credentials hint -->
		<button
			type="button"
			onclick={fillDemo}
			class="mb-5 w-full rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted"
		>
			{t('login.demoHint')}
			<span class="font-mono">{config.auth.demo.email}</span> /
			<span class="font-mono">{config.auth.demo.password}</span>
		</button>

		<form class="space-y-4" onsubmit={handleSubmit} novalidate>
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
				<div class="flex items-center justify-between">
					<Label for="password">{t('auth.password')}</Label>
					<a
						href={resolve('/forgot-password')}
						class="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					>
						{t('login.forgotPassword')}
					</a>
				</div>
				<PasswordInput
					id="password"
					autocomplete="current-password"
					placeholder="••••••••"
					bind:value={password}
					aria-invalid={errors.password ? 'true' : undefined}
				/>
				{#if errors.password}
					<p class="text-xs text-red-500">{errors.password}</p>
				{/if}
			</div>

			{#if formError}
				<p class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-red-500">{formError}</p>
			{/if}

			<Button type="submit" class="w-full" disabled={submitting}>
				{#if submitting}
					<Spinner class="size-4 text-primary-foreground" />
					{t('login.submitting')}
				{:else}
					{t('login.submit')}
				{/if}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center">
		<p class="text-sm text-muted-foreground">
			{t('login.noAccount')}
			<a
				href={resolve('/register')}
				class="font-medium text-foreground underline-offset-4 hover:underline"
			>
				{t('login.signUp')}
			</a>
		</p>
	</Card.Footer>
</Card.Root>
