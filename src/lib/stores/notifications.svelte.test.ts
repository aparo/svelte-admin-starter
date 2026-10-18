import { describe, expect, it } from 'vitest';
import { createNotificationsState, type AppNotification } from './notifications.svelte';

describe('session notification feed', () => {
	it('shares read changes within one session but never across sessions', () => {
		const first = createNotificationsState();
		const second = createNotificationsState();
		const consumer = first;
		first.markRead('n1');
		expect(consumer.unread).toBe(2);
		first.markAllRead();
		expect(consumer.unread).toBe(0);
		expect(second.unread).toBe(3);
		expect(createNotificationsState().unread).toBe(3);
	});
	it('clones incoming records and keeps removal and unknown IDs isolated', () => {
		const initial: AppNotification[] = [
			{ id: 'one', title: 'Example', body: 'Body', time: 'Now', read: false, type: 'info' }
		];
		const state = createNotificationsState(initial);
		state.items[0].read = true;
		expect(initial[0].read).toBe(false);
		state.markRead('missing');
		expect(state.items).toHaveLength(1);
		state.remove('one');
		expect(state.items).toEqual([]);
		expect(state.unread).toBe(0);
		expect(initial).toHaveLength(1);
	});
});
