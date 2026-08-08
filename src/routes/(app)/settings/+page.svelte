<!--
  General settings. An organization form (name, support email, timezone, UI
  language) plus a read-only account section sourced from the mock auth user.
  All mutations operate on local $state — there is no backend.
-->
<script lang="ts">
	import * as Card from '$lib/core/components/ui/card';
	import * as Select from '$lib/core/components/ui/select';
	import * as Avatar from '$lib/core/components/ui/avatar';
	import { Button } from '$lib/core/components/ui/button';
	import { Input } from '$lib/core/components/ui/input';
	import { Label } from '$lib/core/components/ui/label';
	import { Badge } from '$lib/core/components/ui/badge';
	import { Separator } from '$lib/core/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import { auth } from '$lib/auth';
	import { logoutDialog } from '$lib/shell';
	import { setLocale, LOCALES, i18n, t, type Locale } from '$lib/i18n';
	import { initials } from '$lib/core/utils/formatters';
	import Save from '@lucide/svelte/icons/save';

	// A small, static list of common timezones for the mock Select.
	const timezones = [
		{ value: 'UTC', label: 'UTC' },
		{ value: 'America/New_York', label: 'New York (UTC-05:00)' },
		{ value: 'America/Los_Angeles', label: 'Los Angeles (UTC-08:00)' },
		{ value: 'Europe/London', label: 'London (UTC+00:00)' },
		{ value: 'Europe/Berlin', label: 'Berlin (UTC+01:00)' },
		{ value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)' },
		{ value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' }
	];

	// Local form state — seeded with sensible mock defaults.
	let orgName = $state('Acme Inc.');
	let supportEmail = $state('support@acme.example');
	let timezone = $state('UTC');

	// Language is bound to the live i18n locale and applied immediately on change.
	let language = $state<Locale>(i18n.locale);

	const timezoneLabel = $derived(
		timezones.find((tz) => tz.value === timezone)?.label ?? 'Select timezone'
	);
	const languageLabel = $derived(
		LOCALES.find((l) => l.value === language)?.label ?? 'Select language'
	);

	const user = $derived(auth.user);

	function onLanguageChange(value: string): void {
		language = value as Locale;
		setLocale(language);
	}

	function saveGeneral(event: SubmitEvent): void {
		event.preventDefault();
		// No backend — just confirm the (local) change.
		toast.success(t('settings.savedToast'), {
			description: t('settings.savedDescription')
		});
	}
</script>

<svelte:head>
	<title>General Settings · Admin Starter</title>
</svelte:head>

<form onsubmit={saveGeneral} class="space-y-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>{t('settings.orgTitle')}</Card.Title>
			<Card.Description>
				{t('settings.orgDescription')}
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-5">
			<div class="grid gap-2">
				<Label for="org-name">{t('settings.orgName')}</Label>
				<Input id="org-name" bind:value={orgName} placeholder="Acme Inc." />
			</div>

			<div class="grid gap-2">
				<Label for="support-email">{t('settings.supportEmail')}</Label>
				<Input
					id="support-email"
					type="email"
					bind:value={supportEmail}
					placeholder="support@example.com"
				/>
				<p class="text-muted-foreground text-xs">
					{t('settings.emailNote')}
				</p>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<div class="grid gap-2">
					<Label for="timezone">{t('settings.timezone')}</Label>
					<Select.Root type="single" bind:value={timezone}>
						<Select.Trigger id="timezone" class="w-full">
							{timezoneLabel}
						</Select.Trigger>
						<Select.Content>
							{#each timezones as tz (tz.value)}
								<Select.Item value={tz.value} label={tz.label}>
									{tz.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid gap-2">
					<Label for="language">{t('settings.language')}</Label>
					<Select.Root type="single" value={language} onValueChange={onLanguageChange}>
						<Select.Trigger id="language" class="w-full">
							{languageLabel}
						</Select.Trigger>
						<Select.Content>
							{#each LOCALES as locale (locale.value)}
								<Select.Item value={locale.value} label={locale.label}>
									{locale.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<p class="text-muted-foreground text-xs">
						{t('settings.timezoneNote')}
					</p>
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="justify-end border-t">
			<Button type="submit">
				<Save class="size-4" />
				{t('settings.saveChanges')}
			</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>{t('settings.accountTitle')}</Card.Title>
			<Card.Description>{t('settings.accountDescription')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<Avatar.Root class="size-12">
						{#if user?.avatarUrl}
							<Avatar.Image src={user.avatarUrl} alt={user.name} />
						{/if}
						<Avatar.Fallback>
							{user ? initials(user.name) : '?'}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<p class="truncate font-medium">{user?.name ?? t('settings.guest')}</p>
							{#if user}
								<Badge variant="secondary" class="capitalize">{user.role}</Badge>
							{/if}
						</div>
						<p class="text-muted-foreground truncate text-sm">
							{user?.email ?? t('settings.notSignedIn')}
						</p>
					</div>
				</div>
				<Button
					type="button"
					variant="outline"
					class="text-destructive hover:text-destructive"
					onclick={() => (logoutDialog.open = true)}
				>
					{t('settings.signOut')}
				</Button>
			</div>
			<Separator class="my-4" />
			<p class="text-muted-foreground text-xs">
				{t('settings.demoNote')}
			</p>
		</Card.Content>
	</Card.Root>
</form>
