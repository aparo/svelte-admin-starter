import { render } from 'svelte/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ThemeToggle from './ThemeToggle.svelte';

const mode = vi.hoisted(() => ({ current: 'light' }));
vi.mock('mode-watcher', () => ({ mode, toggleMode: vi.fn() }));

afterEach(() => {
	mode.current = 'light';
});

describe('ThemeToggle labels', () => {
	it('retains an English label by default', () => {
		expect(render(ThemeToggle).body).toContain('aria-label="Switch to dark theme"');
	});

	it('uses the localized label for the target theme', () => {
		const props = { lightLabel: '切换至浅色主题', darkLabel: '切换至深色主题' };
		expect(render(ThemeToggle, { props }).body).toContain('aria-label="切换至深色主题"');
		mode.current = 'dark';
		expect(render(ThemeToggle, { props }).body).toContain('aria-label="切换至浅色主题"');
	});
});
