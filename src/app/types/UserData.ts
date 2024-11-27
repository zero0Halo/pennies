import { string, z } from 'zod';
import { v4 as uuidv4, v4 } from 'uuid';
import { getIsoDate } from '@/utils/general';

export const UserDataSchema = z
	.object({
		accounts: z.array(z.string()).nullable(),
		categories: z.array(z.string()).nullable(),
		created: string(),
		updated: string(),
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
		updated: isoDate,
		email: '',
		uid: v4(),
	};

	return UserDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: Don't know what will be passed. That's the point.
export const validateUserData = (data: any) => {
	const result = UserDataSchema.safeParse(data);

	return !!result?.success;
};
