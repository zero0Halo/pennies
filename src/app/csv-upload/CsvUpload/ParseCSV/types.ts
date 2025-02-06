import type { BIWEEKLY, MONTHLY, WEEKLY } from '@/app/constants';
import type { GroupsData, TransactionData, UserData } from '@/app/types';

export type RecurringTypeData =
	| typeof MONTHLY
	| typeof WEEKLY
	| typeof BIWEEKLY;

export type FindRecurringTransactionsData = {
	recurring: boolean;
	recurring_type: RecurringTypeData | undefined;
	recurring_still: boolean;
};

export interface FormatParsedDataArgs {
	accountUid: string;
	parsedData: ParsedData;
	user_uid: string;
}

export interface ParseCSVArgs {
	fileData: File;
	userData: UserData | null;
	accountUid: string | undefined;
}

export type ParseCSVData = {
	groups: GroupsData[] | null;
	singletons: TransactionData[] | null;
	total: number;
};

export type ParsedData = string[][];
