import type { MailLabel } from '$lib/data/inbox';
import { t } from '$lib/i18n';

export const LABEL_TONE: Record<MailLabel, string> = {
	work: 'bg-primary/10 text-primary',
	personal: 'bg-secondary text-secondary-foreground',
	updates: 'bg-accent text-accent-foreground'
};

export function labelText(label: MailLabel): string {
	return t(`inbox.labels.${label}`);
}
