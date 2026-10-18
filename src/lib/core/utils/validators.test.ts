import { describe, expect, it } from 'vitest';
import { createEmailSchema, emailSchema, loginSchema, userSchema } from './validators';

describe('portable validators', () => {
	it('uses injected email messages while preserving trimming', () => {
		const schema = createEmailSchema({ required: 'Address needed', invalid: 'Address invalid' });
		expect(schema.parse('  person@example.com  ')).toBe('person@example.com');
		const missing = schema.safeParse('  ');
		const invalid = schema.safeParse('incorrect');
		expect(missing.error?.issues[0].message).toBe('Address needed');
		expect(invalid.error?.issues[0].message).toBe('Address invalid');
	});

	it('retains existing email, login and three-field user schema contracts', () => {
		expect(emailSchema.safeParse('').error?.issues[0].message).toBe('Email is required');
		expect(loginSchema.parse({ email: '  person@example.com ', password: 'secret' })).toEqual({
			email: 'person@example.com',
			password: 'secret'
		});
		expect(
			userSchema.parse({ name: ' Person ', email: 'person@example.com', role: 'editor' })
		).toEqual({ name: 'Person', email: 'person@example.com', role: 'editor' });
	});
});
