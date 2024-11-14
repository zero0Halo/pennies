import { ACCOUNTS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { AccountData, ReturnData } from '@/app/types';

interface AccountsDeleteArgs {
	account: AccountData;
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function accountsDelete({
	account,
	supabase,
	user_uid,
}: AccountsDeleteArgs): Promise<ReturnData> {
	const { name, uid } = account;

	const { data, error } = await supabase
		.from(ACCOUNTS)
		.delete()
		.eq('uid', uid)
		.eq('user_uid', user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory(`Unable to Delete Account, ${name}`, error),
	});
}
