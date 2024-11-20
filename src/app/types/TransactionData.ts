import { getIsoDate } from '@/utils/general';
import { v4 } from 'uuid';
import { z } from 'zod';

export const TransactionDataSchema = z
	.object({
		account_uid: z.string(),
		amount: z.number(),
		category: z.string(),
		created: z.string(),
		description: z.string(),
		group_uid: z.string(),
		prime: z.boolean(),
		terms: z.union([z.array(z.string()), z.string()]),
		timestamp: z.string(),
		to_account_uid: z.string().optional(),
		transfer_uid: z.string().optional(),
		uid: z.string(),
		updated: z.string(),
		user_uid: z.string(),
	})
	.strict();

export type TransactionData = z.infer<typeof TransactionDataSchema>;

export const createTransactionData = (
	overrides: Partial<TransactionData> = {},
): TransactionData => {
	const isoDate = getIsoDate();
	const defaultValues = {
		account_uid: '',
		amount: 0,
		category: '',
		created: isoDate,
		description: '',
		group_uid: '',
		prime: false,
		terms: [],
		timestamp: '',
		to_account_uid: undefined,
		transfer_uid: undefined,
		uid: v4(),
		updated: isoDate,
		user_uid: '',
	};

	return TransactionDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateTransactionData = (data: any) =>
	TransactionDataSchema.parse(data);
