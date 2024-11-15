import { z } from 'zod';

export const TransactionDataSchema = z.object({
	account_uid: z.string(),
	amount: z.number(),
	category: z.string(),
	created: z.string(),
	description: z.string(),
	group_uid: z.string(),
	prime: z.boolean(),
	terms: z.union([z.array(z.string()), z.string()]),
	timestamp: z.string(),
	transfer_uid: z.string().optional(),
	uid: z.string(),
	updated: z.string(),
	user_uid: z.string(),
});

export type TransactionData = z.infer<typeof TransactionDataSchema>;

export const createTransactionData = (
	overrides: Partial<TransactionData> = {},
): TransactionData => {
	return TransactionDataSchema.parse(overrides);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateTransactionData = (data: any) =>
	TransactionDataSchema.parse(data);
