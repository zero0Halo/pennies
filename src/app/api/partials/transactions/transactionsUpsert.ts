import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData, TransactionData } from '@/app/types';
import { TRANSACTIONS } from '@/app/constants';

export interface TransactionsUpsertArgs {
	supabase: SupabaseClient;
	transactions: TransactionData[];
}

export default async function transactionsUpsert({
	supabase,
	transactions,
}: TransactionsUpsertArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(TRANSACTIONS)
		.upsert(transactions, {
			ignoreDuplicates: true,
			onConflict: 'description',
		})
		.eq('user_uid', transactions[0].user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Error Creating Transactions', error),
	});
}
