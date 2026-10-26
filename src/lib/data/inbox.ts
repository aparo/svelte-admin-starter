export type MailLabel = 'work' | 'personal' | 'updates';

export interface Email {
	id: string;
	from: { name: string; email: string };
	subject: string;
	preview: string;
	body: string[];
	time: string;
	read: boolean;
	starred: boolean;
	label?: MailLabel;
}

/** Demo message fixtures; each inbox clones these into its own state. */
export const demoEmails: Email[] = [
	{
		id: 'm1',
		from: { name: 'Priya Nair', email: 'priya.nair@acme.example' },
		subject: 'Q3 roadmap review — your input needed',
		preview:
			'I pulled together the draft roadmap for next quarter and would love your take before Friday.',
		body: [
			'Hi there,',
			'I pulled together the draft roadmap for next quarter and would love your take before we share it with the wider team on Friday. The biggest open question is whether we ship the billing revamp before or after the mobile work.',
			'Could you add comments directly in the doc? I have flagged the three items where I think we need a decision this week.'
		],
		time: '10:24 AM',
		read: false,
		starred: true,
		label: 'work'
	},
	{
		id: 'm2',
		from: { name: 'GitHub', email: 'noreply@github.example' },
		subject: '[acme/dashboard] 3 new pull requests need review',
		preview: 'You have been requested as a reviewer on three open pull requests in acme/dashboard.',
		body: [
			'Hello,',
			'You have been requested as a reviewer on three open pull requests in acme/dashboard. Two are ready to merge and one is still marked as a draft.',
			'Reviewing promptly helps keep the release train on schedule.'
		],
		time: '9:48 AM',
		read: false,
		starred: false,
		label: 'updates'
	},
	{
		id: 'm3',
		from: { name: 'Marcus Bell', email: 'marcus@northwind.example' },
		subject: 'Re: Contract renewal terms',
		preview: 'Thanks for the quick turnaround. Legal signed off on the revised terms this morning.',
		body: [
			'Hi,',
			'Thanks for the quick turnaround on the redline. Legal signed off on the revised terms this morning, so we are good to proceed with the two-year option.',
			'I will get the countersigned copy back to you by end of day. Appreciate the partnership.'
		],
		time: '8:15 AM',
		read: false,
		starred: false,
		label: 'work'
	},
	{
		id: 'm4',
		from: { name: 'Dana Whitfield', email: 'dana.w@acme.example' },
		subject: 'Lunch next week?',
		preview: 'It has been ages! Are you free for lunch on Tuesday or Wednesday near the office?',
		body: [
			'Hey!',
			'It has been ages since we caught up properly. Are you free for lunch on Tuesday or Wednesday next week? There is a new place near the office that does great ramen.',
			'Let me know what works and I will book a table.'
		],
		time: 'Yesterday',
		read: true,
		starred: true,
		label: 'personal'
	},
	{
		id: 'm5',
		from: { name: 'Stripe', email: 'receipts@stripe.example' },
		subject: 'Your monthly payout has been sent',
		preview: 'A payout of $12,480.00 is on its way to your bank account ending in 4421.',
		body: [
			'Hi,',
			'A payout of $12,480.00 is on its way to your bank account ending in 4421. It should arrive within 1-2 business days.',
			'You can view a full breakdown of the included charges in your dashboard.'
		],
		time: 'Yesterday',
		read: true,
		starred: false,
		label: 'updates'
	},
	{
		id: 'm6',
		from: { name: 'Sofia Ramirez', email: 'sofia.r@acme.example' },
		subject: 'Design tokens are merged 🎉',
		preview:
			'The new color and spacing tokens are live on main — please pull before your next build.',
		body: [
			'Team,',
			'The new color and spacing tokens are merged to main. Please pull the latest before your next build so everyone is rendering against the same values.',
			'I have updated the Figma library to match. Shout if anything looks off in dark mode.'
		],
		time: 'Mon',
		read: true,
		starred: false,
		label: 'work'
	},
	{
		id: 'm7',
		from: { name: 'Anika Patel', email: 'anika@bright.example' },
		subject: 'Speaking slot confirmed for the summit',
		preview: 'Great news — your talk has been accepted for the afternoon track on day two.',
		body: [
			'Hi,',
			'Great news — your talk has been accepted for the afternoon track on day two of the summit. You will have a 30 minute slot followed by 10 minutes of Q&A.',
			'We will send logistics and the green room schedule closer to the date.'
		],
		time: 'Mon',
		read: true,
		starred: false,
		label: 'work'
	},
	{
		id: 'm8',
		from: { name: 'Mom', email: 'eleanor@home.example' },
		subject: 'Photos from the weekend',
		preview: 'Attached a few of my favorites from the garden — the roses finally bloomed!',
		body: [
			'Sweetheart,',
			'Attached a few of my favorites from the weekend. The roses finally bloomed and the whole back garden looks wonderful this year.',
			'Call me when you get a chance. Love you.'
		],
		time: 'Sun',
		read: true,
		starred: true,
		label: 'personal'
	},
	{
		id: 'm9',
		from: { name: 'Figma', email: 'updates@figma.example' },
		subject: 'New comments on “Inbox redesign”',
		preview: 'Three teammates left comments on frames you are watching in the Inbox redesign file.',
		body: [
			'Hello,',
			'Three teammates left comments on frames you are watching in the Inbox redesign file. Most relate to the message list density and the read/unread treatment.',
			'Open the file to reply inline and resolve the threads.'
		],
		time: 'Sun',
		read: true,
		starred: false,
		label: 'updates'
	},
	{
		id: 'm10',
		from: { name: 'Theo Lindqvist', email: 'theo@acme.example' },
		subject: 'Onboarding checklist for the new hires',
		preview:
			'I drafted a checklist for the two engineers joining in July — can you sanity check it?',
		body: [
			'Hi,',
			'I drafted an onboarding checklist for the two engineers joining in July. It covers access requests, the first-week buddy system, and their starter tasks.',
			'Can you give it a sanity check and add anything I missed from the platform side?'
		],
		time: 'Jun 2',
		read: true,
		starred: false,
		label: 'work'
	}
];
