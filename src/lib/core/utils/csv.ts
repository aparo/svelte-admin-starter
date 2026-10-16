// Browser-side helpers for triggering file downloads and exporting tabular
// data as CSV. Guarded for SSR — calls are no-ops without a `document`.

/**
 * Trigger a browser download of `content` as `filename`.
 * No-op during SSR (no `document`).
 */
export function downloadBlob(content: BlobPart, filename: string, mime = 'text/plain'): void {
	if (typeof document === 'undefined') return;
	const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = 'none';
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	// Let the browser consume the object URL after click dispatch before releasing it.
	setTimeout(() => URL.revokeObjectURL(url), 0);
}

export interface CsvOptions {
	/**
	 * Prefix formula-like string cells with a tab inside quotes (default: true).
	 * Set false for general CSV consumers that require the original text.
	 */
	spreadsheetSafe?: boolean;
}

/** Escape CSV syntax and optionally protect spreadsheet-oriented string cells. */
function escapeCell(value: unknown, spreadsheetSafe: boolean): string {
	if (value === null || value === undefined) return '';
	let str = String(value);
	// Include leading whitespace, control characters and full-width formula prefixes.
	// Only text is modified: numeric values such as negative amounts stay numeric.
	const protect =
		spreadsheetSafe && typeof value === 'string' && /^\s*[=+\-@＝＋－＠\t\r\n]/u.test(str);
	if (protect) str = `\t${str}`;
	if (protect || /[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Export an array of objects to a downloadable CSV file.
 *
 * - When `columns` is provided, only those keys are exported, in order, using
 *   the supplied headers.
 * - Otherwise every key found in the first row is used, with the key as header.
 * - Formula-like strings (including headers) receive a tab prefix inside quotes
 *   by default, following OWASP's Excel-oriented mitigation. This changes text;
 *   pass `{ spreadsheetSafe: false }` as the fourth argument for raw CSV data.
 *   Spreadsheet import/save behavior varies: no CSV sanitization is universally
 *   safe across applications and later re-imports. Quoting alone is not protection.
 *
 * @see https://community.owasp.org/attacks/CSV_Injection
 */
export function exportToCsv<T extends object>(
	rows: T[],
	filename: string,
	columns?: { key: keyof T; header: string }[],
	{ spreadsheetSafe = true }: CsvOptions = {}
): void {
	const cols: { key: keyof T; header: string }[] =
		columns ??
		(rows.length > 0
			? (Object.keys(rows[0]!) as (keyof T)[]).map((key) => ({ key, header: String(key) }))
			: []);

	const headerLine = cols.map((c) => escapeCell(c.header, spreadsheetSafe)).join(',');
	const bodyLines = rows.map((row) =>
		cols.map((c) => escapeCell(row[c.key], spreadsheetSafe)).join(',')
	);
	// Prepend a BOM so Excel detects UTF-8 correctly.
	const csv = '﻿' + [headerLine, ...bodyLines].join('\r\n');

	downloadBlob(csv, filename, 'text/csv;charset=utf-8;');
}
