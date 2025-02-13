import type { BIWEEKLY, MONTHLY, WEEKLY } from '@/app/constants';
import type { GroupsData, TransactionData } from '@/app/types';

export type RecurringTypeData =
	| typeof MONTHLY
	| typeof WEEKLY
	| typeof BIWEEKLY;

export type FindRecurringTransactionsData = {
	recurring: boolean;
	recurring_type: RecurringTypeData | undefined;
	recurring_still: boolean;
};

export type ParseCSVData = {
	groups: GroupsData[] | null;
	singletons: TransactionData[] | null;
	total: number;
};

export type ParsedData = string[][];
