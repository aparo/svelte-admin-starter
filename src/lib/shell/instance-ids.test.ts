import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import RepeatedPage from './__test__/RepeatedPage.svelte';
import Forms from '../../routes/(app)/forms/+page.svelte';
import Profile from '../../routes/(app)/profile/+page.svelte';
import Calendar from '../../routes/(app)/calendar/+page.svelte';
import Components from '../../routes/(app)/components/+page.svelte';
import Settings from '../../routes/(app)/settings/+page.svelte';
import TemplateForm from '../../routes/(app)/templates/form/+page.svelte';
import TemplateSettings from '../../routes/(app)/templates/settings/+page.svelte';
import Dashboard from '../../routes/(app)/dashboard/+page.svelte';
import Charts from '../../routes/(app)/charts/+page.svelte';
import Kanban from '../../routes/(app)/kanban/+page.svelte';

describe('repeated keep-alive pages', () => {
	it.each<[string, Component]>([
		['forms', Forms],
		['profile', Profile],
		['calendar', Calendar],
		['components', Components],
		['settings', Settings],
		['form template', TemplateForm],
		['settings template', TemplateSettings],
		['dashboard', Dashboard],
		['charts', Charts],
		['kanban', Kanban]
	])('renders distinct IDs and paired references for two %s instances', (_name, Page) => {
		const { body } = render(RepeatedPage, { props: { page: Page } });
		const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
		expect(ids.length).toBeGreaterThan(0);
		expect(new Set(ids).size).toBe(ids.length);
		for (const [, target] of body.matchAll(/\sfor="([^"]+)"/g)) {
			expect(
				ids.filter((id) => id === target),
				`label for ${target}`
			).toHaveLength(1);
		}
		for (const [, target] of body.matchAll(/fill="url\(#([^)]+)\)"/g)) {
			expect(
				ids.filter((id) => id === target),
				`SVG fill ${target}`
			).toHaveLength(1);
		}
	});
});
