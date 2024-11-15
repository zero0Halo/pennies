import { z } from 'zod';

export const AccountDataSchema = z.object({
	created: z.string(),
	is_default: z.boolean(),
	name: z.string(),
	type: z.string(),
	uid: z.string(),
	updated: z.string(),
	user_uid: z.string(),
});

export type AccountData = z.infer<typeof AccountDataSchema>;

export const createAccountData = (
	overrides: Partial<AccountData> = {},
): AccountData => {
	return AccountDataSchema.parse(overrides);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateAccountData = (data: any) =>
	AccountDataSchema.safeParse(data);
