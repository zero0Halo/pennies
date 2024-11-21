import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getIsoDate } from '@/utils/general';

export const UserDataSchema = z
	.object({
		accounts: z.array(z.string()).nullable(),
		categories: z.array(z.string()).nullable(),
		created: z.string(),
		email: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		uid: z.string(),
	})
	.strict();

export type UserData = z.infer<typeof UserDataSchema>;

export const createUserData = (overrides: Partial<UserData> = {}): UserData => {
	const isoDate = getIsoDate();

	const defaultValues = {
		accounts: null,
		categories: null,
		created: isoDate,
		email: '',
		first_name: undefined,
		last_name: undefined,
		uid: uuidv4(),
	};

	return UserDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateUserData = (data: any) => {
	const result = UserDataSchema.safeParse(data);
	console.log({ data }, result.error);
	return !!result?.success;
};
