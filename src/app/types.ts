import type { NextResponse } from 'next/server';

export type AccountData = {
	created: string;
	is_default: boolean;
	name: string;
	type: string;
	uid: string;
	updated: string;
	user_uid: string;
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
	account: string;
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

export type GroupData = {
	account_uid: string;
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
	transfer_uid?: string;
	uid: string;
	updated: string;
	user_uid: string;
};

export interface MonthlySumData {
	account_uid: string;
	created: string;
	month_uid_key: string;
	timestamp: string;
	uid: string;
	updated: string;
	user_uid: string;
	sum: number;
}

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

export type ReturnData = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: null | any[];
	error?: NextResponse | null;
};

export interface TransactionData {
	account_uid: string;
	amount: number;
	category: string;
	created: string;
	description: string;
	group_uid: string;
	prime: boolean;
	terms: string[] | string;
	timestamp: string;
	transfer_uid?: string;
	uid: string;
	updated: string;
	user_uid: string;
}

export interface TransferData {
	amount: number;
	created: string;
	description: string;
	from_account_uid: string;
	to_account_uid: string;
	uid: string;
	updated: string;
	user_uid: string;
}

export interface UserData {
	accounts: string[] | null;
	categories: string[] | null;
	email: string;
	first_name?: string;
	last_name?: string;
	uid: string;
}
