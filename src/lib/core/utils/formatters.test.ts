import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	formatCurrency,
	formatDate,
	formatDateTime,
	formatNumber,
	formatRelativeTime
} from './formatters';

afterEach(() => vi.useRealTimers());

describe('portable locale-aware formatters', () => {
	it('preserves defaults and accepts explicit number and currency locales', () => {
		expect(formatNumber(1234.5)).toBe('1,234.5');
		expect(formatNumber(1234.5, { minimumFractionDigits: 2 })).toBe('1,234.50');
		expect(formatNumber(1234.5, { minimumFractionDigits: 2 }, 'de-DE')).toBe('1.234,50');
		expect(formatNumber(1234.5, undefined, 'de-DE')).toBe('1.234,5');
		expect(formatCurrency(-1234.5)).toBe('-$1,234.50');
		expect(formatCurrency(1234.5, 'EUR', 'de-DE')).toBe('1.234,50\u00a0€');
	});

	it('uses the requested date locale and preserves custom native options', () => {
		const date = new Date(2026, 0, 2, 13, 5);
		expect(formatDate(date)).toBe('Jan 2, 2026');
		expect(formatDate(date, undefined, 'de-DE')).toBe('2. Jan. 2026');
		expect(formatDate(date, { weekday: 'long' }, 'de-DE')).toBe('Freitag');
		expect(formatDateTime(date)).toBe('Jan 2, 2026, 1:05 PM');
		expect(formatDateTime(date, 'de-DE')).toBe('2. Jan. 2026, 13:05');
	});

	it('keeps malformed and missing dates empty', () => {
		for (const date of [null, undefined, 'not a date', new Date(NaN)]) {
			expect(formatDate(date, undefined, 'de-DE')).toBe('');
			expect(formatDateTime(date, 'de-DE')).toBe('');
		}
		expect(formatRelativeTime('not a date', 'de-DE')).toBe('');
	});

	it('formats relative time with the supplied locale', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-02T12:00:00Z'));
		expect(formatRelativeTime('2026-01-01T12:00:00Z')).toBe('yesterday');
		expect(formatRelativeTime('2026-01-01T12:00:00Z', 'fr-FR')).toBe('hier');
		expect(formatRelativeTime('2026-01-02T14:00:00Z', 'fr-FR')).toBe('dans 2 heures');
	});
});
