import { z } from 'zod';

export const GroupDataSchema = z
	.object({
		account_uid: z.string(),
		category: z.string(),
		count: z.number(),
		created: z.string(),
		description: z.string(),
		hash: z.number(),
		name: z.union([z.boolean(), z.string()]),
		notes: z.string(),
		prime: z.string(),
		recurring: z.union([z.boolean(), z.string()]),
		siteurl: z.string(),
		still_recurring: z.union([z.boolean(), z.string()]),
		terms: z.union([z.array(z.string()), z.string()]),
		to_account_uid: z.string().optional(),
		transfer_uid: z.string().optional(),
		uid: z.string(),
		updated: z.string(),
		user_uid: z.string(),
	})
	.strict();

export type GroupData = z.infer<typeof GroupDataSchema>;

export const createGroupData = (
	overrides: Partial<GroupData> = {},
): GroupData => {
	return GroupDataSchema.parse(overrides);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateGroupData = (data: any) => GroupDataSchema.safeParse(data);
