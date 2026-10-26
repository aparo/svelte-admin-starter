import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadBlob, exportToCsv } from './csv';

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('downloadBlob', () => {
	it('releases the object URL after the click has been dispatched', () => {
		vi.useFakeTimers();
		const anchor = { click: vi.fn(), download: '', href: '', style: { display: '' } };
		vi.stubGlobal('document', {
			createElement: () => anchor,
			body: { appendChild: vi.fn(), removeChild: vi.fn() }
		});
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

		downloadBlob('report', 'report.csv');

		expect(anchor.click).toHaveBeenCalledOnce();
		expect(revoke).not.toHaveBeenCalled();
		vi.runAllTimers();
		expect(revoke).toHaveBeenCalledWith('blob:test');
	});
});

function captureDownload() {
	vi.useFakeTimers();
	const anchor = { click: vi.fn(), download: '', href: '', style: { display: '' } };
	vi.stubGlobal('document', {
		createElement: () => anchor,
		body: { appendChild: vi.fn(), removeChild: vi.fn() }
	});
	const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
	vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
	return {
		anchor,
		async contents() {
			const blob = create.mock.calls[0]![0] as Blob;
			expect(blob.type).toBe('text/csv;charset=utf-8;');
			return new TextDecoder('utf-8', { ignoreBOM: true }).decode(await blob.arrayBuffer());
		}
	};
}

describe('exportToCsv', () => {
	it('exports exact UTF-8 cells with quotes, commas, line breaks and Unicode', async () => {
		const download = captureDownload();
		exportToCsv(
			[{ name: '雪, "quoted"\nnext\rline', amount: -12.5, empty: null, absent: undefined }],
			'report.csv',
			[
				{ key: 'name', header: 'Name, "alias"' },
				{ key: 'amount', header: 'Amount' },
				{ key: 'empty', header: 'Empty' },
				{ key: 'absent', header: 'Absent' }
			]
		);
		expect(await download.contents()).toBe(
			'\uFEFF"Name, ""alias""",Amount,Empty,Absent\r\n"雪, ""quoted""\nnext\rline",-12.5,,'
		);
		expect(download.anchor.download).toBe('report.csv');
		expect(download.anchor.click).toHaveBeenCalledOnce();
	});

	it.each([
		'=1+1',
		'+SUM(1,2)',
		'-2+3',
		'@SUM(A1:A2)',
		'\t=1+1',
		'\r=1+1',
		'\n=1+1',
		'  =1+1',
		'＝1+1',
		'＋1',
		'－1',
		'＠SUM(A1:A2)',
		'=1+2";=1+2'
	])('protects the spreadsheet text prefix in %j', async (name) => {
		const download = captureDownload();
		exportToCsv([{ name }], 'report.csv');
		expect(await download.contents()).toBe(`\uFEFFname\r\n"\t${name.replaceAll('"', '""')}"`);
	});

	it('keeps negative numbers numeric while protecting text and headers', async () => {
		const download = captureDownload();
		exportToCsv([{ amount: -42.5, text: '-42.5', enabled: true }], 'report.csv', [
			{ key: 'amount', header: 'Amount' },
			{ key: 'text', header: '=Header' },
			{ key: 'enabled', header: 'Enabled' }
		]);
		expect(await download.contents()).toBe(
			'\uFEFFAmount,"\t=Header",Enabled\r\n-42.5,"\t-42.5",true'
		);
	});

	it('allows lossless string values for general CSV consumers through an explicit opt-out', async () => {
		const download = captureDownload();
		exportToCsv([{ formula: '=1+1', text: '雪, "text"\nnext' }], 'raw.csv', undefined, {
			spreadsheetSafe: false
		});
		expect(await download.contents()).toBe('\uFEFFformula,text\r\n=1+1,"雪, ""text""\nnext"');
	});
});
