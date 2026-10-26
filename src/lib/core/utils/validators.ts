// Reusable zod schemas and a helper for surfacing per-field error messages.
// Shared by auth and user forms across the app.

import { z } from 'zod';

/** A trimmed email address with optional application-provided messages. */
export function createEmailSchema(
	messages: { required: string; invalid: string } = {
		required: 'Email is required',
		invalid: 'Enter a valid email address'
	}
): z.ZodString {
	return z.string().trim().min(1, messages.required).email(messages.invalid);
}

/** A trimmed, well-formed email address. */
export const emailSchema: z.ZodString = createEmailSchema();

/** Credentials accepted by the login form. */
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, 'Password is required')
});

/** Shape of a user record edited via the users form. */
export const userSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	email: emailSchema,
	role: z.enum(['admin', 'editor', 'viewer'])
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UserInput = z.infer<typeof userSchema>;

/**
 * Look up the first validation message for a given field `path` (dot-notation
 * for nested fields) from a `ZodError`. Returns `undefined` when there is no
 * error or no matching issue.
 */
export function fieldError(err: z.ZodError | null, path: string): string | undefined {
	if (!err) return undefined;
	const issue = err.issues.find((i) => i.path.join('.') === path);
	return issue?.message;
}
