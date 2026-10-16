import { describe, expect, it, vi } from 'vitest';
import { render } from 'svelte/server';
import DataTable from './DataTable.svelte';
import SearchInput from './SearchInput.svelte';

const columns = [{ key: 'name', header: 'Name', searchable: true, sortable: true }];
const NameTable = DataTable<{ id: number; name: string }>;

describe('DataTable', () => {
	it('filters and paginates local rows', () => {
		const searched = render(NameTable, {
			props: {
				data: [
					{ id: 1, name: 'Alpha' },
					{ id: 2, name: 'Omega' }
				] as Array<{ id: number; name: string }>,
				columns,
				search: 'omega'
			}
		}).body;
		expect(searched).toContain('Omega');
		expect(searched).not.toContain('Alpha');

		const paged = render(NameTable, {
			props: {
				data: Array.from({ length: 11 }, (_, index) => ({
					id: index + 1,
					name: `Row ${index + 1}`
				})),
				columns
			}
		}).body;
		expect(paged).toContain('Row 10');
		expect(paged).not.toContain('Row 11');
	});

	it('renders all four page controls on the server before effects run', () => {
		const body = render(NameTable, {
			props: {
				data: Array.from({ length: 31 }, (_, index) => ({ id: index, name: `Row ${index}` })),
				columns,
				pageSize: 10
			}
		}).body;
		expect(body.match(/aria-label="Go to page \d+"/g)).toEqual([
			'aria-label="Go to page 1"',
			'aria-label="Go to page 2"',
			'aria-label="Go to page 3"',
			'aria-label="Go to page 4"'
		]);
		expect(body).toContain('aria-current="page"');
	});

	it('does not filter or slice rows supplied by a server', () => {
		const onPageChange = vi.fn();
		const body = render(NameTable, {
			props: {
				data: [{ id: 2, name: 'Server row' }] as Array<{ id: number; name: string }>,
				columns,
				search: 'no local match',
				server: {
					page: 2,
					pageSize: 1,
					total: 3,
					onPageChange
				}
			}
		}).body;
		expect(body).toContain('Server row');
		expect(body).toContain('Showing');
		expect(body).toContain('of');
		expect(body).toContain('3');
		expect(body).toMatch(/aria-label="Go to page 2"[^>]*aria-current="page"/);
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('normalizes invalid server page bounds without issuing a request during render', () => {
		const onPageChange = vi.fn();
		const body = render(NameTable, {
			props: {
				data: [{ id: 31, name: 'Last row' }],
				columns,
				server: { page: 99, pageSize: 10, total: 31, onPageChange }
			}
		}).body;
		expect(body).toContain('Last row');
		expect(body).toMatch(/aria-label="Go to page 4"[^>]*aria-current="page"/);
		expect(onPageChange).not.toHaveBeenCalled();
	});

	it('uses column render values for local search and display', () => {
		const body = render(NameTable, {
			props: {
				data: [
					{ id: 1, name: 'Alpha' },
					{ id: 2, name: 'Beta' }
				],
				columns: [{ ...columns[0]!, render: (row) => `Display ${row.name}` }],
				search: 'display beta'
			}
		}).body;
		expect(body).toContain('Display Beta');
		expect(body).not.toContain('Display Alpha');
	});

	it('keeps loaded rows visible and exposes localization and busy state', () => {
		const body = render(NameTable, {
			props: {
				data: Array.from({ length: 11 }, (_, id) => ({ id, name: 'Existing row' })),
				columns,
				searchable: true,
				search: 'Existing',
				loading: true,
				text: (key) => `translated:${key}`
			}
		}).body;
		expect(body).toContain('Existing row');
		expect(body).toContain('translated:common.searchPlaceholder');
		expect(body).toContain('aria-label="translated:common.clearSearch"');
		expect(body).toContain('aria-busy="true"');
		const pageButtons = body.match(
			/<button[^>]*aria-label="translated:table\.(?:prevPage|nextPage|goToPage)"[^>]*>/g
		);
		expect(pageButtons).toHaveLength(4);
		expect(pageButtons?.every((button) => button.includes('disabled'))).toBe(true);
	});

	it('exposes sortable headers and selected rows to assistive technology', () => {
		const body = render(NameTable, {
			props: {
				data: [
					{ id: 1, name: 'Alpha' },
					{ id: 2, name: 'Beta' }
				],
				columns,
				selectable: true,
				selected: [2]
			}
		}).body;
		expect(body).toContain('aria-sort="none"');
		expect(body.match(/data-state="selected"/g)).toHaveLength(1);
	});

	it('supports portable and customized search clear labels', () => {
		expect(render(SearchInput, { props: { value: 'query' } }).body).toContain(
			'aria-label="Clear search"'
		);
		expect(
			render(SearchInput, { props: { value: 'query', clearLabel: 'Remove query' } }).body
		).toContain('aria-label="Remove query"');
	});
});
