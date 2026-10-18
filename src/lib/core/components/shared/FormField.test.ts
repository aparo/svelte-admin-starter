import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Fields from './FormField.test.svelte';

function attribute(tag: string, name: string): string | undefined {
	return new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
}

describe('FormField', () => {
	it('generates distinct control IDs and associates every label in the same form', () => {
		const body = render(Fields, {
			props: { fields: [{ label: 'First email' }, { label: 'Second email' }] }
		}).body;
		const inputs = [...body.matchAll(/<input\b[^>]*>/g)].map(([tag]) => tag);
		const labels = [...body.matchAll(/<label\b[^>]*>/g)].map(([tag]) => tag);
		const ids = inputs.map((input) => attribute(input, 'id'));
		expect(ids).toHaveLength(2);
		expect(ids.every(Boolean)).toBe(true);
		expect(new Set(ids).size).toBe(2);
		expect(labels.map((label) => attribute(label, 'for'))).toEqual(ids);
		expect(body).toContain('Field action');
	});

	it('associates both help and validation feedback with the control', () => {
		const body = render(Fields, {
			props: {
				fields: [
					{
						id: 'email',
						label: 'Email',
						description: 'Use your work address',
						error: 'Enter a valid address'
					}
				]
			}
		}).body;
		const input = /<input\b[^>]*>/.exec(body)![0];
		expect(attribute(input, 'id')).toBe('email');
		expect(attribute(input, 'aria-invalid')).toBe('true');
		expect(attribute(input, 'aria-describedby')).toBe('email-description email-error');
		expect(body).toContain('id="email-description"');
		expect(body).toContain('id="email-error" role="alert"');
		expect(body).toContain('Use your work address');
		expect(body).toContain('Enter a valid address');
	});

	it('omits missing feedback references and keeps help available on valid controls', () => {
		const body = render(Fields, {
			props: {
				fields: [
					{ id: 'name', label: 'Name', description: 'Shown to your team' },
					{ id: 'password', label: 'Password', error: '' }
				]
			}
		}).body;
		const inputs = [...body.matchAll(/<input\b[^>]*>/g)].map(([tag]) => tag);
		expect(attribute(inputs[0], 'aria-describedby')).toBe('name-description');
		expect(attribute(inputs[1], 'aria-describedby')).toBeUndefined();
		expect(inputs.every((input) => attribute(input, 'aria-invalid') === undefined)).toBe(true);
		expect(body).not.toContain('role="alert"');
	});
});
