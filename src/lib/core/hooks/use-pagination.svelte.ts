// Headless pagination hook. Owns page/pageSize/total state and derives all the
// values a paginated UI needs, including a windowed page list (with `-1` as the
// ellipsis marker) suitable for rendering numbered pagination controls.

/** Selectable page sizes for a "rows per page" control. */
export const PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];

export interface PaginationOptions {
	pageSize?: number;
	total?: number;
	initialPage?: number;
}

export interface Pagination {
	page: number;
	pageSize: number;
	total: number;
	readonly totalPages: number;
	readonly start: number;
	readonly end: number;
	readonly hasPrev: boolean;
	readonly hasNext: boolean;
	/** Windowed page numbers to render; `-1` marks an ellipsis gap. */
	readonly pages: number[];
	setPage(p: number): void;
	next(): void;
	prev(): void;
	setTotal(n: number): void;
	setPageSize(n: number): void;
}

/**
 * Build a compact, windowed list of page numbers around `current`.
 * Always shows the first and last page; uses `-1` to mark elided ranges.
 * e.g. for 10 pages on page 5 → [1, -1, 4, 5, 6, -1, 10].
 */
function buildPages(current: number, totalPages: number, siblings = 1): number[] {
	if (totalPages <= 1) return totalPages === 1 ? [1] : [];

	// How many page numbers we'd show if nothing were collapsed:
	// first + last + current + 2*siblings + 2 ellipsis slots.
	const totalSlots = siblings * 2 + 5;
	if (totalPages <= totalSlots) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const leftSibling = Math.max(current - siblings, 1);
	const rightSibling = Math.min(current + siblings, totalPages);
	const showLeftDots = leftSibling > 2;
	const showRightDots = rightSibling < totalPages - 1;

	const first = 1;
	const last = totalPages;

	if (!showLeftDots && showRightDots) {
		const leftCount = siblings * 2 + 3;
		const left = Array.from({ length: leftCount }, (_, i) => i + 1);
		return [...left, -1, last];
	}

	if (showLeftDots && !showRightDots) {
		const rightCount = siblings * 2 + 3;
		const right = Array.from({ length: rightCount }, (_, i) => totalPages - rightCount + 1 + i);
		return [first, -1, ...right];
	}

	const middle = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
	return [first, -1, ...middle, -1, last];
}

function integer(value: number, minimum: number, fallback: number): number {
	return Number.isFinite(value) ? Math.max(minimum, Math.trunc(value)) : fallback;
}

/** Derive consistent, finite bounds and controls without lifecycle effects. */
export function getPaginationState(page: number, pageSize: number, total: number) {
	pageSize = integer(pageSize, 1, PAGE_SIZE_OPTIONS[0]!);
	total = integer(total, 0, 0);
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	page = Math.min(integer(page, 1, 1), totalPages);
	const offset = (page - 1) * pageSize;

	return {
		page,
		pageSize,
		total,
		totalPages,
		offset,
		start: total === 0 ? 0 : offset + 1,
		end: Math.min(page * pageSize, total),
		hasPrev: page > 1,
		hasNext: page < totalPages,
		pages: buildPages(page, totalPages)
	};
}

/**
 * Create a pagination controller. All fields are reactive; `page`, `pageSize`
 * and `total` are assignable, while derived fields are read-only.
 */
export function usePagination(opts: PaginationOptions = {}): Pagination {
	let page = $state(integer(opts.initialPage ?? 1, 1, 1));
	let pageSize = $state(integer(opts.pageSize ?? PAGE_SIZE_OPTIONS[0]!, 1, PAGE_SIZE_OPTIONS[0]!));
	let total = $state(integer(opts.total ?? 0, 0, 0));
	const state = $derived(getPaginationState(page, pageSize, total));

	function setPage(p: number): void {
		page = getPaginationState(p, pageSize, total).page;
	}

	function next(): void {
		if (state.hasNext) page = state.page + 1;
	}

	function prev(): void {
		if (state.hasPrev) page = state.page - 1;
	}

	function setTotal(n: number): void {
		total = integer(n, 0, 0);
		// Re-clamp so we never sit past the new last page.
		setPage(page);
	}

	function setPageSize(n: number): void {
		pageSize = integer(n, 1, PAGE_SIZE_OPTIONS[0]!);
		// Reset to the first page on a page-size change for predictable UX.
		page = 1;
	}

	return {
		get page() {
			return state.page;
		},
		set page(p: number) {
			setPage(p);
		},
		get pageSize() {
			return pageSize;
		},
		set pageSize(n: number) {
			setPageSize(n);
		},
		get total() {
			return total;
		},
		set total(n: number) {
			setTotal(n);
		},
		get totalPages() {
			return state.totalPages;
		},
		get start() {
			return state.start;
		},
		get end() {
			return state.end;
		},
		get hasPrev() {
			return state.hasPrev;
		},
		get hasNext() {
			return state.hasNext;
		},
		get pages() {
			return state.pages;
		},
		setPage,
		next,
		prev,
		setTotal,
		setPageSize
	};
}
