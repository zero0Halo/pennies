import { ACCOUNTS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isoDate, responseFactory, toReturn } from '@/utils/api';
import type { AccountData, ReturnData } from '@/app/types';

interface AccountsUpdateArgs {
	account: AccountData;
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function accountsUpdate({
	account,
	supabase,
	user_uid,
}: AccountsUpdateArgs): Promise<ReturnData> {
	const { name, uid } = account;

	const { data, error } = await supabase
		.from(ACCOUNTS)
		.update({ ...account, updated: isoDate() })
		.eq('uid', uid)
		.eq('user_uid', user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory(`Unable to Update Account, ${name}`, error),
	});
}
