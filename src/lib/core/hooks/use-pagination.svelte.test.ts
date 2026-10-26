import { describe, expect, it } from 'vitest';
import { getPaginationState, usePagination } from './use-pagination.svelte';

describe('pagination state', () => {
	it('derives bounded indexes and page numbers from one state', () => {
		expect(getPaginationState(4, 10, 31)).toEqual({
			page: 4,
			pageSize: 10,
			total: 31,
			totalPages: 4,
			offset: 30,
			start: 31,
			end: 31,
			hasPrev: true,
			hasNext: false,
			pages: [1, 2, 3, 4]
		});
	});

	it('normalizes empty, fractional and non-finite input', () => {
		expect(getPaginationState(99, 10, 0)).toMatchObject({ page: 1, start: 0, end: 0, pages: [1] });
		expect(getPaginationState(3.8, 10.9, 25.9)).toMatchObject({
			page: 3,
			pageSize: 10,
			total: 25,
			start: 21,
			end: 25
		});
		expect(getPaginationState(-2, 0, -5)).toMatchObject({ page: 1, pageSize: 1, total: 0 });
		for (const invalid of [NaN, Infinity, -Infinity]) {
			expect(getPaginationState(invalid, invalid, invalid)).toMatchObject({
				page: 1,
				pageSize: 10,
				total: 0,
				start: 0,
				end: 0
			});
		}
	});

	it('collapses long page ranges around the active page', () => {
		expect(getPaginationState(1, 10, 100).pages).toEqual([1, 2, 3, 4, 5, -1, 10]);
		expect(getPaginationState(5, 10, 100).pages).toEqual([1, -1, 4, 5, 6, -1, 10]);
		expect(getPaginationState(10, 10, 100).pages).toEqual([1, -1, 6, 7, 8, 9, 10]);
	});
});

describe('usePagination public controller', () => {
	it('honors the initial page and keeps setters and navigation within bounds', () => {
		const pagination = usePagination({ initialPage: 3, pageSize: 10, total: 31 });
		expect(pagination.page).toBe(3);
		expect(pagination.start).toBe(21);
		pagination.next();
		pagination.next();
		expect(pagination.page).toBe(4);
		expect(pagination.end).toBe(31);
		pagination.prev();
		expect(pagination.page).toBe(3);
		pagination.page = -4;
		pagination.prev();
		expect(pagination.page).toBe(1);
		pagination.setPage(99);
		expect(pagination.page).toBe(4);
	});

	it('persists total clamps and resets the page after a page-size change', () => {
		const pagination = usePagination({ initialPage: 4, pageSize: 10, total: 31 });
		pagination.total = 11;
		expect(pagination.page).toBe(2);
		pagination.setTotal(100);
		expect(pagination.page).toBe(2);
		pagination.pageSize = 20;
		expect(pagination.page).toBe(1);
		expect(pagination.totalPages).toBe(5);
		pagination.setPageSize(NaN);
		expect(pagination.pageSize).toBe(10);
	});
});
