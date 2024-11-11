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
	data,
}: TransactionsDeleteArgs): Promise<ReturnData> {
	const { data: transactionsData, error } = await supabase
		.from(TRANSACTIONS)
		.delete()
		.in(
			'uid',
			data.map((m) => m.uid),
		)
		.eq('user_uid', data[0].user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Error Deleting Transactions', error),
	});
}
