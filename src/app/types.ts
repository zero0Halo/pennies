import type { Dayjs } from 'dayjs';

export type AccountData = {
	is_default: boolean;
	name: string;
	type: string;
};

export interface AccountDBData extends AccountData {
	uid: string; // The UID automatically is created in supabase when a new account is inserted
}

export interface ActiveRowData {
	mode: string | false;
	index: number | false;
}

export interface CategoryData {
	category: string;
}

export interface CsvUploadData {
	csvfile: FileList;
}

export interface FindGroupsData {
	groups: GroupsData[];
	singletons: TransactionData[];
	total: number;
}

export interface GroupsData {
	transactions: TransactionData[];
	group: GroupData;
}

export interface TransactionData {
	amount: number;
	category: string;
	created: string;
	description: string;
	group_uid: string;
	prime: boolean;
	terms: string[];
	timestamp: string;
	uid: string;
	updated: string;
	user_uid: string;
}

export type GroupData = {
	category: string;
	count: number;
	created: string;
	description: string;
	name: boolean | string;
	notes: string;
	prime: string;
	recurring: boolean | string;
	siteurl: string;
	still_recurring: boolean | string;
	terms: string | string[];
	uid: string;
	updated: string;
	user_uid: string;
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
	categories: string[] | null;
	email: string;
	first_name?: string;
	last_name?: string;
	uid: string;
}
