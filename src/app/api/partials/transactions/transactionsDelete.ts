import type { SupabaseClient } from '@supabase/supabase-js';
import { TRANSACTIONS } from '@/app/constants';
import toReturn, { type ReturnData } from '@/app/api/utils/toReturn';
import type { TransactionData } from '@/app/types';
import responseFactory from '../../utils/responseFactory';

interface TransactionsDeleteArgs {
	supabase: SupabaseClient;
	data: TransactionData[];
}

export default async function transactionsDelete({
	supabase,
	data: transactionsData,
}: TransactionsDeleteArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(TRANSACTIONS)
		.delete()
		.in(
			'uid',
			transactionsData.map((m) => m.uid),
		)
		.eq('user_uid', transactionsData[0].user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Error Deleting Transactions', error),
	});
}
