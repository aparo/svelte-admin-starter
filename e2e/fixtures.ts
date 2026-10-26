import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ appSession: void }>({
	appSession: [
		async ({ page }, use) => {
			// Each test gets its own mock session, including across separate spec files.
			await page.addInitScript(() => {
				localStorage.setItem('admin-starter:locale', 'en');
				localStorage.setItem(
					'admin-starter:session',
					JSON.stringify({
						id: 'browser-test',
						name: 'Browser Test',
						email: 'admin@example.com',
						role: 'admin'
					})
				);
			});
			await page.clock.setFixedTime(new Date('2026-10-09T12:00:00+08:00'));
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await use();
			expect(errors, 'Uncaught browser errors').toEqual([]);
		},
		{ auto: true }
	]
});
export { expect };
