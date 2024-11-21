import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const UserDataSchema = z
	.object({
		accounts: z.union([z.array(z.string()), z.null()]),
		categories: z.union([z.array(z.string()), z.null()]),
		email: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		uid: z.string(),
	})
	.strict();

export type UserData = z.infer<typeof UserDataSchema>;

export const createUserData = (overrides: Partial<UserData> = {}): UserData => {
	// TODO: Should really add these fields to the db table
	// const isoDate = getIsoDate();
	// created: isoDate,
	// updated: isoDate,
	const defaultValues = {
		accounts: null,
		email: '',
		uid: uuidv4(),
		user_uid: '',
	};

	return UserDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateUserData = (data: any) => {
	const result = UserDataSchema.safeParse(data);

	return !!result?.success;
};
