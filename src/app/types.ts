import type { Dayjs } from 'dayjs';

export type AccountData = {
	is_default: boolean;
	name: string;
	type: string;
};

// The UID automatically is created in supabase when a new account is inserted
export interface AccountDataDB extends AccountData {
	uid: string;
}

export interface CsvUploadData {
	csvfile: FileList;
}

export interface FormattedRowData {
	amount: number;
	date: string;
	description: string;
	id: string;
	terms: string[];
	timestamp: Dayjs;
}

export type GroupData = {
	description: string;
	id: string;
	name: boolean | string;
	possiblyRecurring: boolean | string;
	prime: FormattedRowData;
	recurring: boolean | string;
	transactions: FormattedRowData[];
};

export type SetEditingFn = (arg: boolean) => void;
export interface SetGroupNameData {
	name: string | boolean;
}

export type SignInData = {
	email: string;
	password: string;
};

export interface SignOutData {
	preventDefault: () => void;
}

export interface SignUpData extends SignInData {
	firstname?: string;
	lastname?: string;
}

export interface UserData {
	accounts: string[] | null;
	email: string;
	first_name?: string;
	last_name?: string;
	uid: string;
}
