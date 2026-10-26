export type Category = 'meeting' | 'review' | 'deadline' | 'personal';

export interface CalendarEvent {
	id: string;
	title: string;
	date: Date;
	dateKey: string;
	category: Category;
	time?: string;
}

export interface EventSeed {
	day: number;
	title: string;
	category: Category;
	time?: string;
}
