import { z } from 'zod';

export const TransferDataSchema = z.object({
	amount: z.number(),
	created: z.string(),
	description: z.string(),
	from_account_uid: z.string(),
	to_account_uid: z.string(),
	uid: z.string(),
	updated: z.string(),
	user_uid: z.string(),
});

export type TransferData = z.infer<typeof TransferDataSchema>;

export const createTransferData = (
	overrides: Partial<TransferData> = {},
): TransferData => {
	return TransferDataSchema.parse(overrides);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateTransferData = (data: any) =>
	TransferDataSchema.parse(data);
