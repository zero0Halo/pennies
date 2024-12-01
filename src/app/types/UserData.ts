import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getIsoDate } from '@/utils/general';

export const UserDataSchema = z
	.object({
		accounts: z.array(z.string()).nullable(),
		categories: z.array(z.string()).nullable(),
		created: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		uid: z.string(),
		updated: z.string(),
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
		first_name: '',
		last_name: '',
		uid: uuidv4(),
		updated: isoDate,
	};

	return UserDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: I don't know what the data looks like, hence validation
export const validateUserData = (data: any) => {
	const result = UserDataSchema.safeParse(data);

	return !!result?.success;
};
