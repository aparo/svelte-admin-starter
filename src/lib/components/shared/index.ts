// Compatibility barrel for the starter app. Portable implementations live in core.
export * from '../../core/components/shared';
export { default as ConfirmDialog } from './ConfirmDialog.svelte';
export { default as ConfirmHost } from './ConfirmHost.svelte';
export { default as LanguageToggle } from './LanguageToggle.svelte';
export { default as CommandMenu } from './CommandMenu.svelte';
export { default as DatePicker } from './DatePicker.svelte';
export { default as DateRangePicker } from './DateRangePicker.svelte';
export { default as TimePicker } from './TimePicker.svelte';
export { default as DateTimePicker } from './DateTimePicker.svelte';
export { default as LineItemsEditor } from '../../features/sales/LineItemsEditor.svelte';
export { default as QuickCreateClient } from '../../features/clients/QuickCreateClient.svelte';

export type { EditableLine, ServiceItem } from '../../features/sales/line-items';
export type { Client } from '../../features/clients/QuickCreateClient.svelte';
