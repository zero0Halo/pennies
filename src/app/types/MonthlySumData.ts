import { z } from 'zod';

export const MonthlySumDataSchema = z.object({
	account_uid: z.string(),
	created: z.string(),
	month_uid_key: z.string(),
	timestamp: z.string(),
	uid: z.string(),
	updated: z.string(),
	user_uid: z.string(),
	sum: z.number(),
});

export type MonthlySumData = z.infer<typeof MonthlySumDataSchema>;

export const createMonthlySumData = (
	overrides: Partial<MonthlySumData> = {},
): MonthlySumData => {
	return MonthlySumDataSchema.parse(overrides);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateMonthlySumData = (data: any) =>
	MonthlySumDataSchema.parse(data);
