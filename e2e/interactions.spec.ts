import { test, expect } from './fixtures';

test('form date selection commits immediately and restores trigger focus', async ({ page }) => {
	await page.goto('/forms');
	const trigger = page.getByRole('button', { name: 'Due date', exact: true });
	await trigger.click();
	const dialog = page.locator('[data-slot="popover-content"]');
	await expect(dialog).toBeVisible();
	await dialog.locator('[data-bits-day][data-value="2026-10-15"]').click();
	await expect(dialog).toBeHidden();
	await expect(page.locator('input[name="dueDate"]')).toHaveValue('2026-10-15');
	await expect(trigger).toBeFocused();
});

test('default date picker keeps drafts until Apply and discards Cancel', async ({ page }) => {
	await page.goto('/components');
	const trigger = page.getByRole('button', { name: 'Date', exact: true });
	await trigger.click();
	const dialog = page.locator('[data-slot="popover-content"]');
	await dialog.locator('[data-bits-day][data-value="2026-07-16"]').click();
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(trigger).toContainText('Jul 15, 2026');
	await expect(trigger).toBeFocused();
	await trigger.click();
	await dialog.locator('[data-bits-day][data-value="2026-07-17"]').click();
	await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
	await expect(dialog).toBeHidden();
	await expect(trigger).toContainText('Jul 17, 2026');
	await expect(trigger).toBeFocused();
});

test('keyboard task movement restores focus after reordering and changing columns', async ({
	page
}) => {
	await page.goto('/kanban');
	const taskName = 'Research competitor onboarding flows';
	const trigger = page.getByRole('button', { name: `Move ${taskName} to column`, exact: true });
	await trigger.focus();
	await page.keyboard.press('Enter');
	const down = page.getByRole('menuitem', { name: 'Move down in column', exact: true });
	await expect(page.getByRole('menuitem', { name: 'Move to To do', exact: true })).toBeFocused();
	await page.keyboard.press('ArrowUp');
	await expect(down).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('menu')).toBeHidden();
	await expect(trigger).toBeFocused();
	const backlog = page.getByRole('region', { name: 'Backlog', exact: true });
	await expect(backlog.locator('[data-task-card]').nth(1)).toContainText(taskName);
	await page.keyboard.press('Enter');
	const move = page.getByRole('menuitem', { name: 'Move to In progress', exact: true });
	await expect(page.getByRole('menuitem', { name: 'Move to To do', exact: true })).toBeFocused();
	await page.keyboard.press('ArrowDown');
	await expect(move).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(
		page
			.getByRole('region', { name: 'In progress', exact: true })
			.getByRole('listitem')
			.filter({ hasText: taskName })
	).toHaveCount(1);
	await expect(trigger).toBeFocused();
	await expect(page.getByRole('status').filter({ hasText: taskName })).toContainText('In progress');
});
