import { test, expect } from './fixtures';

test('notification popover supports Tab, Shift+Tab, read actions and Escape focus restoration', async ({
	page
}, testInfo) => {
	await page.goto('/users');
	const bell = page.getByRole('button', { name: 'Notifications', exact: true });
	await expect(bell).toHaveAccessibleDescription('3 unread notifications');
	await bell.focus();
	await page.keyboard.press('Enter');
	const panel = page.getByRole('dialog', { name: 'Notifications', exact: true });
	const all = panel.getByRole('button', { name: 'Mark all read', exact: true });
	await expect(all).toBeFocused();
	await page.screenshot({
		path: testInfo.outputPath('notifications-desktop.png'),
		animations: 'disabled'
	});
	await page.keyboard.press('Tab');
	const first = panel.getByRole('button', { name: /New user registered/ });
	await expect(first).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(first).toBeFocused();
	await expect(bell).toHaveAccessibleDescription('2 unread notifications');
	await page.keyboard.press('Tab');
	await expect(panel.getByRole('button', { name: /Payment received/ })).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await page.keyboard.press('Shift+Tab');
	await expect(all).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(all).toHaveAttribute('aria-disabled', 'true');
	await expect(all).toBeFocused();
	await expect(bell).toHaveAccessibleDescription('0 unread notifications');
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
	await expect(bell).toBeFocused();
});

test('notification state is reset after logout and a different login', async ({ page }) => {
	await page.goto('/users');
	const bell = page.getByRole('button', { name: 'Notifications', exact: true });
	await bell.click();
	await page.getByRole('button', { name: 'Mark all read', exact: true }).click();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Account', exact: true }).click();
	await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
	await page.getByRole('alertdialog').getByRole('button', { name: 'Log out', exact: true }).click();
	await page.waitForURL('**/login');
	await page.getByRole('textbox', { name: 'Email', exact: true }).fill('second@example.com');
	await page.getByLabel('Password', { exact: true }).fill('password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await page.waitForURL('**/dashboard');
	await expect(bell).toHaveAccessibleDescription('3 unread notifications');
	await bell.click();
	await expect(
		page.getByRole('dialog').getByRole('button', { name: /New user registered.*Unread/ })
	).toBeVisible();
});

test('notification controls follow locale changes without resetting read state', async ({
	page
}, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/users');
	await page.getByRole('button', { name: 'Notifications', exact: true }).click();
	await page.getByRole('button', { name: /New user registered/ }).click();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Change language', exact: true }).click();
	await page.getByRole('menuitem', { name: '简体中文', exact: true }).click();
	const bell = page.getByRole('button', { name: '通知', exact: true });
	await expect(bell).toHaveAccessibleDescription('2 条未读通知');
	await bell.click();
	const panel = page.getByRole('dialog', { name: '通知', exact: true });
	await expect(panel.getByRole('button', { name: '全部标为已读', exact: true })).toBeVisible();
	await expect(panel.getByRole('button', { name: /New user registered.*已读/ })).toBeVisible();
	await page.screenshot({
		path: testInfo.outputPath('notifications-mobile-zh-dark.png'),
		animations: 'disabled'
	});
});

for (const method of ['keyboard', 'pointer'] as const) {
	test(`clearing search with ${method} returns focus to the input`, async ({ page }) => {
		await page.goto('/users');
		const input = page.getByRole('textbox', { name: 'Search...', exact: true });
		await input.fill('Mia');
		const clear = page.getByRole('button', { name: 'Clear search', exact: true });
		if (method === 'keyboard') {
			await clear.focus();
			await page.keyboard.press('Enter');
		} else await clear.click();
		await expect(input).toHaveValue('');
		await expect(input).toBeFocused();
		await page.keyboard.type('Alex');
		await expect(input).toHaveValue('Alex');
	});
}

test('server table displays initial sorting and reverses that sort on the first click', async ({
	page
}) => {
	await page.goto('/tables/server');
	const product = page.getByRole('columnheader', { name: /Product/ });
	const category = page.getByRole('columnheader', { name: /Category/ });
	await expect(product).toHaveAttribute('aria-sort', 'ascending');
	const first = await page.locator('tbody tr').first().textContent();
	await product.getByRole('button').click();
	await expect(product).toHaveAttribute('aria-sort', 'descending');
	await expect(page.locator('tbody tr').first()).not.toHaveText(first!);
	await category.getByRole('button').click();
	await expect(category).toHaveAttribute('aria-sort', 'ascending');
	await expect(product).toHaveAttribute('aria-sort', 'none');
	await category.getByRole('button').click();
	await expect(category).toHaveAttribute('aria-sort', 'descending');
});
