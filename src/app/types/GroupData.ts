import { z } from 'zod';
import { BIWEEKLY, MONTHLY, WEEKLY } from '../constants';
import { getIsoDate } from '@/utils/general';
import { v4 } from 'uuid';

const RecurringTypeEnum = z.enum([BIWEEKLY, MONTHLY, WEEKLY]).optional();
export type RecurringType = z.infer<typeof RecurringTypeEnum>;

export const GroupDataSchema = z
	.object({
		account_uid: z.string(),
		category: z.string(),
		count: z.number(),
		created: z.string(),
		description: z.string(),
		hash: z.number(),
		name: z.string(),
		notes: z.string().optional(),
		prime: z.string(),
		recurring: z.boolean(),
		recurring_type: RecurringTypeEnum,
		siteurl: z.string().optional(),
		still_recurring: z.boolean().optional(),
		terms: z.array(z.string()),
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
	const isoDate = getIsoDate();
	const defaultValues = {
		account_uid: '',
		category: '',
		count: 0,
		created: isoDate,
		description: '',
		hash: 0,
		name: '',
		notes: undefined,
		prime: '',
		recurring: false,
		recurring_type: undefined,
		siteurl: undefined,
		still_recurring: undefined,
		terms: [],
		to_account_uid: undefined,
		transfer_uid: undefined,
		uid: v4(),
		updated: isoDate,
		user_uid: '',
	};

	return GroupDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateGroupData = (data: any) => GroupDataSchema.safeParse(data);
