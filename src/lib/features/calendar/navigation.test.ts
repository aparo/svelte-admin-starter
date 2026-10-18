import { describe, expect, it } from 'vitest';
import { keyboardDay, millisecondsUntilTomorrow } from './navigation';

describe('calendar keyboard movement', () => {
	it('crosses month/year boundaries and stays within a week for Home/End', () => {
		expect(keyboardDay('2026-12-31', 'ArrowRight')).toBe('2027-01-01');
		expect(keyboardDay('2026-01-01', 'ArrowLeft')).toBe('2025-12-31');
		expect(keyboardDay('2026-10-09', 'ArrowUp')).toBe('2026-10-02');
		expect(keyboardDay('2026-10-09', 'ArrowDown')).toBe('2026-10-16');
		expect(keyboardDay('2026-10-09', 'Home')).toBe('2026-10-04');
		expect(keyboardDay('2026-10-09', 'End')).toBe('2026-10-10');
		expect(keyboardDay('2026-10-09', 'Tab')).toBeUndefined();
	});
	it('clamps Page Up/Down to the actual destination month end', () => {
		expect(keyboardDay('2026-01-31', 'PageDown')).toBe('2026-02-28');
		expect(keyboardDay('2024-03-31', 'PageUp')).toBe('2024-02-29');
		expect(keyboardDay('2026-12-31', 'PageDown')).toBe('2027-01-31');
	});
	it('schedules the next local midnight, including month/year rollover', () => {
		expect(millisecondsUntilTomorrow(new Date(2026, 11, 31, 23, 59, 59, 500))).toBe(500);
		expect(millisecondsUntilTomorrow(new Date(2026, 9, 9, 23, 59))).toBe(60_000);
	});
});
