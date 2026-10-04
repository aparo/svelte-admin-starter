import { describe, expect, it } from 'vitest';
import { moveTask, type Column, type Task } from './board';

const task = (id: string): Task => ({
	id,
	title: id,
	priority: 'low',
	label: '',
	assignee: '',
	comments: 0,
	attachments: 0
});

describe('moveTask', () => {
	it('inserts tasks between cards and reorders within a column', () => {
		const columns: Column[] = [
			{ id: 'a', title: 'A', tasks: [task('1'), task('2')] },
			{ id: 'b', title: 'B', tasks: [task('3'), task('4')] }
		];

		const moved = moveTask(columns, '2', 'a', 'b', 1);
		expect(moved.map((column) => column.tasks.map(({ id }) => id))).toEqual([
			['1'],
			['3', '2', '4']
		]);
		expect(moveTask(moved, '4', 'b', 'b', 0)[1]?.tasks.map(({ id }) => id)).toEqual([
			'4',
			'3',
			'2'
		]);
	});
});
