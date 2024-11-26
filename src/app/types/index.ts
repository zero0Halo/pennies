import type { NextResponse } from 'next/server';
import type { TransactionData } from './TransactionData';
import type { GroupData } from './GroupData';

// Account
export {
	type AccountData,
	AccountDataSchema,
	createAccountData,
	createAccountPayload,
	validateAccountData,
} from './AccountData';

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

// Group
export {
	type GroupData,
	GroupDataSchema,
	createGroupData,
	validateGroupData,
} from './GroupData';

export interface GroupsData {
	transactions: TransactionData[];
	group: GroupData;
}

export {
	type MonthlySumData,
	MonthlySumDataSchema,
	createMonthlySumData,
	validateMonthlySumData,
} from './MonthlySumData';

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

export {
	type TransactionData,
	TransactionDataSchema,
	createTransactionData,
	validateTransactionData,
} from './TransactionData';

// TRANSFER
export {
	type TransferData,
	TransferDataSchema,
	createTransferData,
	createTransferPayload,
	type CreateTransferPayloadData,
	validateTransferData,
} from './TransferData';

export type UpsertOptions = {
	onConflict?: string | string[];
	ignoreDuplicates?: boolean;
	count?: 'exact' | 'planned' | 'estimated';
};

export interface UserData {
	accounts: string[] | null;
	categories: string[] | null;
	email: string;
	first_name?: string;
	last_name?: string;
	uid: string;
}
