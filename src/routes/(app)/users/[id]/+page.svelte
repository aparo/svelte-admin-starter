<!--
  User detail — a tabbed entity-detail template for a single team member.

  Resolves the user from the route param against the mock directory; renders a
  centered EmptyState when no match is found. A profile header (avatar, name,
  role + status badges, actions) sits above three tabs: Overview (KPIs + a
  detail definition list), Activity (a vertical timeline), and Security (mock
  2FA toggle, password info, and active sessions). All data is mock.
-->
<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Pencil from '@lucide/svelte/icons/pencil';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import UserX from '@lucide/svelte/icons/user-x';
	import Folder from '@lucide/svelte/icons/folder';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import MessageCircle from '@lucide/svelte/icons/message-square';
	import LogIn from '@lucide/svelte/icons/log-in';
	import Upload from '@lucide/svelte/icons/upload';
	import Settings from '@lucide/svelte/icons/settings';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import type { Component } from 'svelte';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import { PageContainer, StatCard, StatusBadge, EmptyState } from '$lib/components/shared';
	import type { BadgeTone } from '$lib/components/shared';
	import * as Card from '$lib/core/components/ui/card';
	import * as Avatar from '$lib/core/components/ui/avatar';
	import * as Tabs from '$lib/core/components/ui/tabs';
	import { Button } from '$lib/core/components/ui/button';
	import { Switch } from '$lib/core/components/ui/switch';
	import { Separator } from '$lib/core/components/ui/separator';

	import { demoUsers, type DemoUser } from '$lib/data/users';
	import { formatDate, initials } from '$lib/core/utils/formatters';
	import { t } from '$lib/i18n';
	import { cn } from '$lib/core/utils';
	import { toast } from 'svelte-sonner';

	type Role = DemoUser['role'];
	type Status = DemoUser['status'];

	// Resolve the user from the route param. `page.params.id` is a string.
	const user = $derived<DemoUser | undefined>(demoUsers.find((u) => u.id === page.params.id));

	const ROLE_LABELS: Record<Role, string> = {
		admin: t('userDetail.roleAdmin'),
		editor: t('userDetail.roleEditor'),
		viewer: t('userDetail.roleViewer')
	};
	const STATUS_LABELS: Record<Status, string> = {
		active: t('userDetail.statusActive'),
		invited: t('userDetail.statusInvited'),
		suspended: t('userDetail.statusSuspended')
	};

	// Map roles/statuses to the shared StatusBadge tones, matching the Users table.
	function roleTone(role: Role): BadgeTone {
		return role === 'admin' ? 'brand' : role === 'editor' ? 'neutral' : 'outline';
	}
	function statusTone(status: Status): BadgeTone {
		return status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'danger';
	}

	const pageTitle = $derived(
		user ? `${user.name} · Admin Starter` : 'User not found · Admin Starter'
	);

	// --- Invented (mock) profile metadata, derived from the user record ------
	// Stable, deterministic picks so each profile renders consistently.
	const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Operations', 'Support'];
	const LOCATIONS = [
		{ city: 'San Francisco, US', tz: 'UTC−08:00 (PST)' },
		{ city: 'London, UK', tz: 'UTC+00:00 (GMT)' },
		{ city: 'Berlin, DE', tz: 'UTC+01:00 (CET)' },
		{ city: 'Singapore, SG', tz: 'UTC+08:00 (SGT)' },
		{ city: 'New York, US', tz: 'UTC−05:00 (EST)' }
	];

	function hashIndex(id: string, length: number): number {
		let h = 0;
		for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
		return h % length;
	}

	const profile = $derived.by(() => {
		const id = user?.id ?? '';
		const li = hashIndex(id, LOCATIONS.length);
		const seed = hashIndex(id, 997);
		return {
			department: DEPARTMENTS[hashIndex(id, DEPARTMENTS.length)],
			location: LOCATIONS[li].city,
			timezone: LOCATIONS[li].tz,
			projects: 4 + (seed % 18),
			tasksDone: 60 + (seed % 240),
			comments: 30 + ((seed * 7) % 410)
		};
	});

	// --- Mock activity timeline ---------------------------------------------
	interface ActivityEntry {
		icon: Component;
		text: string;
		time: string;
		tone: 'brand' | 'success' | 'muted';
	}

	const activity: ActivityEntry[] = [
		{ icon: LogIn, text: 'Signed in from a new device', time: '2 hours ago', tone: 'brand' },
		{
			icon: CircleCheck,
			text: 'Completed task “Refine onboarding flow”',
			time: '6 hours ago',
			tone: 'success'
		},
		{
			icon: MessageCircle,
			text: 'Commented on “Q3 roadmap review”',
			time: 'Yesterday',
			tone: 'muted'
		},
		{ icon: Upload, text: 'Uploaded 3 files to “Brand assets”', time: '2 days ago', tone: 'muted' },
		{ icon: Folder, text: 'Created project “Mobile redesign”', time: '5 days ago', tone: 'brand' },
		{ icon: Settings, text: 'Updated notification preferences', time: 'Last week', tone: 'muted' }
	];

	function dotClass(tone: ActivityEntry['tone']): string {
		return tone === 'brand'
			? 'bg-primary/10 text-primary'
			: tone === 'success'
				? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
				: 'bg-muted text-muted-foreground';
	}

	// --- Mock active sessions ------------------------------------------------
	interface Session {
		icon: Component;
		device: string;
		location: string;
		time: string;
		current: boolean;
	}

	let twoFactor = $state(true);

	const sessions = $state<Session[]>([
		{
			icon: Monitor,
			device: 'MacBook Pro · Chrome',
			location: 'San Francisco, US',
			time: 'Active now',
			current: true
		},
		{
			icon: Smartphone,
			device: 'iPhone 15 · Safari',
			location: 'San Francisco, US',
			time: '3 hours ago',
			current: false
		},
		{
			icon: Monitor,
			device: 'Windows · Edge',
			location: 'London, UK',
			time: '4 days ago',
			current: false
		}
	]);

	function notImplemented(label: string) {
		toast.info(`${label} is not available in this demo.`);
	}

	function revokeSession(index: number) {
		const s = sessions[index];
		sessions.splice(index, 1);
		toast.success('Session revoked', { description: `${s.device} was signed out.` });
	}

	function onTwoFactorChange(checked: boolean) {
		twoFactor = checked;
		toast.success(
			checked ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
		);
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<PageContainer>
	{#if !user}
		<div class="flex min-h-[60vh] items-center justify-center">
			<EmptyState
				icon={UserX}
				title={t('userDetail.notFoundTitle')}
				description={t('userDetail.notFoundDescription')}
				class="w-full max-w-md"
			>
				{#snippet action()}
					<Button href="/users" variant="outline">
						<ArrowLeft class="size-4" />
						{t('userDetail.backToUsers')}
					</Button>
				{/snippet}
			</EmptyState>
		</div>
	{:else}
		<!-- Breadcrumb / back link -->
		<a
			href={resolve('/users')}
			class="text-muted-foreground hover:text-foreground -mb-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors"
		>
			<ArrowLeft class="size-4" aria-hidden="true" />
			{t('userDetail.backToUsers')}
		</a>

		<!-- Profile header -->
		<div
			class="from-primary/10 via-primary/5 to-card relative overflow-hidden rounded-xl border bg-gradient-to-br p-6"
		>
			<div
				class="bg-primary/10 pointer-events-none absolute -top-16 -right-12 size-56 rounded-full blur-3xl"
				aria-hidden="true"
			></div>
			<div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<Avatar.Root class="border-background size-16 border-2 shadow-sm">
						{#if user.avatarUrl}
							<Avatar.Image src={user.avatarUrl} alt={user.name} />
						{/if}
						<Avatar.Fallback class="bg-primary/10 text-primary text-lg font-semibold">
							{initials(user.name)}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="min-w-0 space-y-2">
						<h1 class="truncate text-2xl font-semibold tracking-tight">{user.name}</h1>
						<div class="flex flex-wrap items-center gap-2">
							<StatusBadge tone={roleTone(user.role)}>{ROLE_LABELS[user.role]}</StatusBadge>
							<StatusBadge tone={statusTone(user.status)}>{STATUS_LABELS[user.status]}</StatusBadge>
							<span class="text-muted-foreground truncate text-sm">{user.email}</span>
						</div>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<Button variant="outline" onclick={() => notImplemented('Editing')}>
						<Pencil class="size-4" />
						{t('userDetail.edit')}
					</Button>
					<Button variant="ghost" onclick={() => notImplemented('Messaging')}>
						<MessageSquare class="size-4" />
						{t('userDetail.sendMessage')}
					</Button>
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<Tabs.Root value="overview" class="gap-6">
			<Tabs.List>
				<Tabs.Trigger value="overview">{t('userDetail.tabOverview')}</Tabs.Trigger>
				<Tabs.Trigger value="activity">{t('userDetail.tabActivity')}</Tabs.Trigger>
				<Tabs.Trigger value="security">{t('userDetail.tabSecurity')}</Tabs.Trigger>
			</Tabs.List>

			<!-- Overview -->
			<Tabs.Content value="overview" class="space-y-6">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatCard
						title={t('userDetail.statProjects')}
						value={profile.projects}
						icon={Folder}
						hint={t('userDetail.statProjectsHint')}
					/>
					<StatCard
						title={t('userDetail.statTasks')}
						value={profile.tasksDone}
						icon={CircleCheck}
						change={12}
						trend="up"
						hint={t('userDetail.statTasksHint')}
					/>
					<StatCard
						title={t('userDetail.statComments')}
						value={profile.comments}
						icon={MessageCircle}
						hint={t('userDetail.statCommentsHint')}
					/>
				</div>

				<Card.Root>
					<Card.Header>
						<Card.Title>{t('userDetail.detailsTitle')}</Card.Title>
						<Card.Description>{t('userDetail.detailsDescription')}</Card.Description>
					</Card.Header>
					<Card.Content>
						<dl class="divide-border divide-y">
							<div class="flex items-center justify-between gap-4 py-3 first:pt-0">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelEmail')}</dt>
								<dd class="truncate text-sm font-medium">{user.email}</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelRole')}</dt>
								<dd>
									<StatusBadge tone={roleTone(user.role)}>{ROLE_LABELS[user.role]}</StatusBadge>
								</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelStatus')}</dt>
								<dd>
									<StatusBadge tone={statusTone(user.status)}
										>{STATUS_LABELS[user.status]}</StatusBadge
									>
								</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelDepartment')}</dt>
								<dd class="text-sm font-medium">{profile.department}</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelLocation')}</dt>
								<dd class="text-sm font-medium">{profile.location}</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelTimezone')}</dt>
								<dd class="text-sm font-medium tabular-nums">{profile.timezone}</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelJoined')}</dt>
								<dd class="text-sm font-medium tabular-nums">{formatDate(user.createdAt)}</dd>
							</div>
							<div class="flex items-center justify-between gap-4 py-3 last:pb-0">
								<dt class="text-muted-foreground text-sm">{t('userDetail.labelUserId')}</dt>
								<dd class="text-muted-foreground font-mono text-xs">{user.id}</dd>
							</div>
						</dl>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Activity -->
			<Tabs.Content value="activity" class="space-y-6">
				<Card.Root>
					<Card.Header>
						<Card.Title>{t('userDetail.activityTitle')}</Card.Title>
						<Card.Description>{t('userDetail.activityDescription')}</Card.Description>
					</Card.Header>
					<Card.Content>
						<ol class="relative space-y-6">
							<!-- connecting rail -->
							<span class="bg-border absolute top-2 bottom-2 left-[15px] w-px" aria-hidden="true"
							></span>
							{#each activity as item, i (i)}
								<li class="relative flex gap-4">
									<span
										class={cn(
											'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full',
											dotClass(item.tone)
										)}
									>
										<item.icon class="size-4" aria-hidden="true" />
									</span>
									<div class="flex min-w-0 flex-1 items-start justify-between gap-4 pt-1">
										<p class="text-foreground text-sm">{item.text}</p>
										<span class="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
											{item.time}
										</span>
									</div>
								</li>
							{/each}
						</ol>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Security -->
			<Tabs.Content value="security" class="space-y-6">
				<Card.Root>
					<Card.Header>
						<Card.Title>{t('userDetail.securityTitle')}</Card.Title>
						<Card.Description>{t('userDetail.securityDescription')}</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-1">
						<!-- Two-factor -->
						<div class="flex items-center justify-between gap-4 py-2">
							<div class="space-y-0.5">
								<div class="flex items-center gap-2">
									<ShieldCheck class="text-muted-foreground size-4" aria-hidden="true" />
									<p class="text-sm font-medium">{t('userDetail.twoFaLabel')}</p>
								</div>
								<p class="text-muted-foreground text-sm">{t('userDetail.twoFaHint')}</p>
							</div>
							<Switch checked={twoFactor} onCheckedChange={onTwoFactorChange} />
						</div>

						<Separator />

						<!-- Last password change -->
						<div class="flex items-center justify-between gap-4 py-2">
							<div class="space-y-0.5">
								<p class="text-sm font-medium">{t('userDetail.passwordLabel')}</p>
								<p class="text-muted-foreground text-sm">
									{t('userDetail.passwordHint', { date: formatDate('2024-09-14') })}
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onclick={() => notImplemented('Resetting passwords')}
							>
								{t('userDetail.resetPassword')}
							</Button>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>{t('userDetail.sessionsTitle')}</Card.Title>
						<Card.Description>{t('userDetail.sessionsDescription')}</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if sessions.length === 0}
							<p class="text-muted-foreground py-4 text-center text-sm">
								{t('userDetail.noSessions')}
							</p>
						{:else}
							<ul class="divide-border divide-y">
								{#each sessions as session, i (session.device)}
									<li class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
										<span
											class="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg"
											aria-hidden="true"
										>
											<session.icon class="size-4" />
										</span>
										<div class="min-w-0 flex-1">
											<div class="flex items-center gap-2">
												<p class="truncate text-sm font-medium">{session.device}</p>
												{#if session.current}
													<StatusBadge tone="success">{t('userDetail.thisDevice')}</StatusBadge>
												{/if}
											</div>
											<p class="text-muted-foreground truncate text-xs">
												{session.location} · {session.time}
											</p>
										</div>
										<Button
											variant="ghost"
											size="sm"
											class="text-muted-foreground hover:text-destructive shrink-0"
											disabled={session.current}
											onclick={() => revokeSession(i)}
										>
											{t('userDetail.revoke')}
										</Button>
									</li>
								{/each}
							</ul>
						{/if}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</PageContainer>
