import { test, expect } from './fixtures';

test('calendar has one Tab stop, full event descriptions, and keyboard navigation', async ({
	page
}, testInfo) => {
	await page.goto('/calendar');
	let grid = page.getByRole('grid', { name: 'October 2026' });
	const day = grid.getByRole('button', { name: 'Friday, October 9, 2026', exact: true });
	await expect(day).toHaveAttribute('aria-current', 'date');
	await expect(day).toHaveAccessibleDescription(/4 events.*1:1 with Alex/);
	await expect(grid.locator('button[tabindex="0"]')).toHaveCount(1);
	await page.screenshot({ path: testInfo.outputPath('calendar-desktop.png') });
	await day.focus();
	await page.keyboard.press('ArrowRight');
	await expect(grid.locator('[data-date="2026-10-10"]')).toBeFocused();
	await page.keyboard.press('ArrowDown');
	await expect(grid.locator('[data-date="2026-10-17"]')).toBeFocused();
	await page.keyboard.press('Home');
	await expect(grid.locator('[data-date="2026-10-11"]')).toBeFocused();
	await page.keyboard.press('End');
	await page.keyboard.press('Enter');
	await expect(grid.locator('[data-date="2026-10-17"]')).toHaveAttribute('aria-pressed', 'true');
	await page.keyboard.press('PageDown');
	grid = page.getByRole('grid', { name: 'November 2026' });
	await expect(grid.locator('[data-date="2026-11-17"]')).toBeFocused();
	await expect(grid.locator('button[tabindex="0"]')).toHaveCount(1);
	await page.keyboard.press('Tab');
	await expect(grid.locator('button:focus')).toHaveCount(0);
});

test('kept-alive calendar refreshes today and upcoming events on reactivation', async ({
	page
}) => {
	await page.goto('/calendar');
	await expect(page.locator('[aria-current="date"]')).toHaveAttribute('data-date', '2026-10-09');
	await page.locator('a[href="/kanban"]').first().click();
	await expect(page.getByRole('heading', { name: 'Kanban', exact: true })).toBeVisible();
	await page.clock.setFixedTime(new Date('2026-10-10T12:00:00+08:00'));
	await page.locator('a[href="/calendar"]').first().click();
	await expect(page.locator('[aria-current="date"]')).toHaveAttribute('data-date', '2026-10-10');
	await expect(page.getByText('Your next 5 events')).toBeVisible();
	// Old October 9 events disappear from the upcoming list (grid chips remain).
	await expect(page.getByRole('list').filter({ hasText: 'Q3 roadmap sync' })).toHaveCount(0);
});

test('Today reads the current date even when the page has remained open across a month', async ({
	page
}) => {
	await page.goto('/calendar');
	await expect(page.getByRole('grid', { name: 'October 2026' })).toBeVisible();
	await page.clock.setFixedTime(new Date('2026-11-01T12:00:00+08:00'));
	await page.getByRole('button', { name: 'Today', exact: true }).click();
	await expect(page.getByRole('grid', { name: 'November 2026' })).toBeVisible();
	await expect(page.locator('[aria-current="date"]')).toHaveAttribute('data-date', '2026-11-01');
	await expect(page.getByText('No upcoming events.')).toBeVisible();
});

test('calendar updates at local midnight without navigating away', async ({ page }) => {
	await page.clock.install({ time: new Date('2026-10-09T23:59:50+08:00') });
	await page.goto('/calendar');
	await expect(page.locator('[aria-current="date"]')).toHaveAttribute('data-date', '2026-10-09');
	await page.clock.fastForward(15_000);
	await expect(page.locator('[aria-current="date"]')).toHaveAttribute('data-date', '2026-10-10');
});

test('calendar remains keyboard accessible on a narrow screen in dark mode', async ({
	page
}, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/calendar');
	const grid = page.getByRole('grid', { name: 'October 2026' });
	await expect(grid).toBeVisible();
	await expect(page.locator('html')).toHaveClass(/dark/);
	await page.screenshot({ path: testInfo.outputPath('calendar-mobile-dark.png') });
	const day = grid.locator('[data-date="2026-10-01"]');
	await day.focus();
	await page.keyboard.press('PageDown');
	const nextGrid = page.getByRole('grid', { name: 'November 2026' });
	await expect(nextGrid.locator('[data-date="2026-11-01"]')).toBeFocused();
	await page.keyboard.press('Space');
	await expect(nextGrid.locator('[data-date="2026-11-01"]')).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});
