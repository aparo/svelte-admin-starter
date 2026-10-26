import { describe, expect, it } from 'vitest';
import { createEvents, groupEventsByDay, upcomingEvents, countEventsInMonth } from './events';
import type { EventSeed } from './types';

describe('calendar event dates', () => {
	it.each([
		[2026, 0, '2026-01-30'],
		[2026, 1, '2026-02-28'],
		[2024, 1, '2024-02-29'],
		[2026, 3, '2026-04-30'],
		[2026, 11, '2026-12-30']
	])('keeps a day-30 event within %i/%i', (year, month, expected) => {
		const seeds: EventSeed[] = [{ day: 30, title: 'Retro', category: 'meeting' }];
		const events = createEvents(year, month, seeds);
		expect(events[0]!.dateKey).toBe(expected);
		expect(countEventsInMonth(events, year, month)).toBe(1);
		expect(seeds[0]!.day).toBe(30);
	});

	it('groups and orders timed events before untimed events without mutating the source', () => {
		const events = createEvents(2026, 11, [
			{ day: 30, title: 'Untimed', category: 'meeting' },
			{ day: 30, title: 'Afternoon', category: 'meeting', time: '14:00' },
			{ day: 30, title: 'Morning', category: 'meeting', time: '09:00' },
			{ day: 1, title: 'Past', category: 'meeting' },
			{ day: 31, title: 'Tomorrow', category: 'meeting' }
		]);
		const originalIds = events.map((event) => event.id);
		expect(
			groupEventsByDay(events)
				.get('2026-12-30')
				?.map((event) => event.title)
		).toEqual(['Morning', 'Afternoon', 'Untimed']);
		expect(upcomingEvents(events, '2026-12-30', 2).map((event) => event.title)).toEqual([
			'Morning',
			'Afternoon'
		]);
		expect(upcomingEvents(events, '2027-01-01')).toEqual([]);
		expect(events.map((event) => event.id)).toEqual(originalIds);
	});
});
