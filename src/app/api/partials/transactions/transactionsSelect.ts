import { TRANSACTIONS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData } from '@/app/types';

interface TransactionsSelectArgs {
	account_uid: string;
	month: number;
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function transactionsSelect({
	account_uid,
	month,
	supabase,
	user_uid,
}: TransactionsSelectArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(TRANSACTIONS)
		.select('*')
		.eq('user_uid', user_uid)
		.eq('account_uid', account_uid)
		.order('timestamp', { ascending: false });

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Unable to Retrieve Transactions', error),
	});
}
