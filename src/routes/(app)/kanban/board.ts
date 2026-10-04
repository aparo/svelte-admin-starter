export type Priority = 'low' | 'medium' | 'high';

export interface Task {
	id: string;
	title: string;
	description?: string;
	priority: Priority;
	label: string;
	assignee: string;
	comments: number;
	attachments: number;
}

export interface Column {
	id: string;
	title: string;
	tasks: Task[];
}

export function moveTask(
	columns: Column[],
	taskId: string,
	fromColumnId: string,
	toColumnId: string,
	toIndex: number
): Column[] {
	const source = columns.find((column) => column.id === fromColumnId);
	const target = columns.find((column) => column.id === toColumnId);
	const moved = source?.tasks.find((task) => task.id === taskId);
	if (!moved || !target) return columns;

	return columns.map((column) => {
		const tasks =
			column.id === fromColumnId ? column.tasks.filter((task) => task.id !== taskId) : column.tasks;
		if (column.id !== toColumnId) return tasks === column.tasks ? column : { ...column, tasks };
		const next = [...tasks];
		next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, moved);
		return { ...column, tasks: next };
	});
}
