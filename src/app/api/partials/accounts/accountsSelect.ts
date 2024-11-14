import { ACCOUNTS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData } from '@/app/types';

interface AccountsSelectArgs {
	selectFrom?: '*' | 'is_default';
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function accountsSelect({
	selectFrom = '*',
	supabase,
	user_uid,
}: AccountsSelectArgs): Promise<ReturnData> {
	const query = supabase.from(ACCOUNTS).select('*').eq('user_uid', user_uid);

	selectFrom === 'is_default'
		? query.eq('is_default', true)
		: query.order('is_default', { ascending: true });

	const { data, error } = await query;

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Unable to Retrieve Accounts', error),
	});
}
