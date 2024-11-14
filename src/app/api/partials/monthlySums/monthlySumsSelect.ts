import { MONTHLY_SUMS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData } from '@/app/types';

interface MonthlySumsSelectArgs {
	account_uid: string;
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function monthlySumsSelect({
	account_uid,
	supabase,
	user_uid,
}: MonthlySumsSelectArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(MONTHLY_SUMS)
		.select('*')
		.eq('user_uid', user_uid)
		.eq('account_uid', account_uid)
		.order('month_uid_key', { ascending: false });

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Unable to Retrieve Monthly Sums', error),
	});
}
