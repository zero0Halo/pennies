import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getIsoDate } from '@/utils/general';
import type { UserData } from '.';

export const AccountDataSchema = z
	.object({
		created: z.string(),
		is_default: z.boolean(),
		name: z.string(),
		type: z.string(),
		uid: z.string(),
		updated: z.string(),
		user_uid: z.string(),
	})
	.strict();

export type AccountData = z.infer<typeof AccountDataSchema>;

export const createAccountData = (
	overrides: Partial<AccountData> = {},
): AccountData => {
	const isoDate = getIsoDate();
	const defaultValues = {
		created: isoDate,
		is_default: false,
		name: '',
		type: '',
		uid: uuidv4(),
		updated: isoDate,
		user_uid: '',
	};

	return AccountDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateAccountData = (data: any): boolean => {
	if (Array.isArray(data)) {
		return data.every((entry) => !!AccountDataSchema.safeParse(entry).success);
	}

	return !!AccountDataSchema.safeParse(data).success;
};

interface CreateAccountPayloadProps {
	accountsData: AccountData[];
	data: AccountData;
	userData: UserData | null;
}

export function createAccountPayload({
	accountsData,
	data,
	userData,
}: CreateAccountPayloadProps): AccountData | null {
	if (userData === null) return null;

	const noAccounts = accountsData.length === 0;

	const newAccount: AccountData = {
		...data,
		is_default: noAccounts ? true : data.is_default,
		user_uid: userData.uid,
	};

	return newAccount;
}
